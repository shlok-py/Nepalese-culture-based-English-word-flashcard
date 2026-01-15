import React, { useState } from 'react';

const AudioButton = ({ text, language = 'english' }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const speak = () => {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-speech not supported in this browser');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language based on prop
    if (language === 'nepali' || language === 'ne') {
      utterance.lang = 'ne-NP'; // Nepali
      // Fallback to Hindi if Nepali not available (similar script)
      const voices = window.speechSynthesis.getVoices();
      const nepaliVoice = voices.find(v => v.lang.startsWith('ne'));
      const hindiVoice = voices.find(v => v.lang.startsWith('hi'));
      if (nepaliVoice) {
        utterance.voice = nepaliVoice;
      } else if (hindiVoice) {
        utterance.voice = hindiVoice;
        utterance.lang = 'hi-IN';
      }
    } else {
      utterance.lang = 'en-US'; // English
    }

    // Speech settings for better learning
    utterance.rate = 0.85; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button 
      className={`audio-btn ${isPlaying ? 'playing' : ''}`}
      onClick={speak}
      title={`Hear ${language === 'nepali' ? 'Nepali' : 'English'} pronunciation`}
      aria-label={`Play ${language} pronunciation`}
    >
      {isPlaying ? '🔊' : '🔈'}
    </button>
  );
};

export default AudioButton;
