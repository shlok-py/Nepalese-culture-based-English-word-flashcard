import asyncio
import tempfile
from pathlib import Path
from typing import Optional

import numpy as np
import sounddevice as sd
import soundfile as sf
from fastapi import FastAPI, Query, APIRouter
from pydantic import BaseModel

import whisper

# ---------- Config ----------
SAMPLE_RATE = 16_000   # Whisper works well at 16 kHz
CHANNELS = 1
MODEL_SIZE = "small"   # tiny/base/small/medium/large-v3 (pick per your GPU/CPU)


# Preload Whisper model at startup (so first request is not slow)
model: Optional[whisper.Whisper] = None



# ---------- Audio utils ----------
def record_audio_wav(duration_sec: float, sample_rate: int = SAMPLE_RATE, channels: int = CHANNELS) -> Path:
    """
    Records from the default system microphone for `duration_sec`, saves to a temp WAV, returns its path.
    """
    print(f"[record] Recording {duration_sec}s at {sample_rate}Hz, {channels}ch ...")
    frames = int(duration_sec * sample_rate)

    # Record float32 PCM from sounddevice
    audio = sd.rec(frames, samplerate=sample_rate, channels=channels, dtype="float32")
    sd.wait()  # block until recording is finished

    # Convert float32 (-1..1) to int16 for standard PCM WAV
    audio_i16 = np.clip(audio, -1.0, 1.0)
    audio_i16 = (audio_i16 * 32767.0).astype(np.int16)

    # Write to temp file
    tmp_dir = Path(tempfile.gettempdir())
    out_path = tmp_dir / f"mic_record_{sample_rate}hz_{channels}ch.wav"
    sf.write(out_path.as_posix(), audio_i16, sample_rate, subtype="PCM_16")
    print(f"[record] Saved WAV -> {out_path}")
    return out_path

def transcribe_with_whisper(wav_path: Path, language: Optional[str] = None) -> dict:
    """
    Transcribes the given WAV file using the preloaded Whisper model.
    Set language='ne' to force Nepali, or None to auto-detect.
    """
    assert model is not None, "Whisper model not loaded"
    print(f"[stt] Transcribing: {wav_path}")
    # You can pass language="ne" for Nepali, or leave auto-detect
    result = model.transcribe(str(wav_path), language=language)
    # result has keys like: text, segments, language
    return {
        "language": result.get("language"),
        "text": result.get("text", "").strip(),
        "segments": result.get("segments", []),
    }

# ---------- Response schema ----------
class STTResponse(BaseModel):
    audio_file: str
    duration_sec: float
    language: Optional[str]
    text: str

# ---------- Endpoint: record 10s then transcribe ----------

router = APIRouter(prefix="/api/record", tags=["record"])


@router.on_event("startup")
def load_model():
    global model
    model = whisper.load_model(MODEL_SIZE)
    # Optional: print(model) to confirm
    print(f"[startup] Whisper model loaded: {MODEL_SIZE}")

@router.get("/record-and-transcribe", response_model=STTResponse)
async def record_and_transcribe(
    duration: float = Query(10.0, ge=1.0, le=120.0, description="Seconds to record from server mic"),
    force_language: Optional[str] = Query(None, description="e.g., 'ne' for Nepali, 'en' for English (else auto)")
):
    """
    Records from the server's default microphone for `duration` seconds, transcribes with Whisper, returns text.
    """
    # Record in a thread (so we don't block the event loop)
    wav_path = await asyncio.to_thread(record_audio_wav, duration, SAMPLE_RATE, CHANNELS)

    # Transcribe (also off the event loop)
    result = await asyncio.to_thread(transcribe_with_whisper, wav_path, force_language)

    return STTResponse(
        audio_file=str(wav_path),
        duration_sec=duration,
        language=result.get("language"),
        text=result.get("text", ""),
    )
