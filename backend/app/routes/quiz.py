from fastapi import APIRouter, Depends, HTTPException
import os
from typing import List
from dotenv import load_dotenv
load_dotenv()
from ..models import QuizResponse, QuizRequest, UnderstandQuizResponse
from ..services import GeminiQuizService, WordService

router = APIRouter(prefix="/api/quiz", tags=["quiz"])

def get_word_service() -> WordService:
    """Dependency to get word service instance"""
    return WordService()

def get_quiz_service(word_service: WordService = Depends(get_word_service)):
    """Dependency to get quiz service with Gemini API key"""
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise HTTPException(status_code=500, detail="Gemini API key not configured")
    return GeminiQuizService(gemini_api_key, word_service)

@router.post("/generate", response_model=QuizResponse)
def generate_quiz(
    quiz_request: QuizRequest,
    quiz_service: GeminiQuizService = Depends(get_quiz_service)
):
    """Generate a quiz question based on previous answer correctness"""
    return quiz_service.generate_quiz(quiz_request)

@router.post("/generate_understand_quiz", response_model=UnderstandQuizResponse)
def generate_understand_quiz(
    quiz_request: QuizRequest,
    quiz_service: GeminiQuizService = Depends(get_quiz_service)
):
    """Generate an understanding quiz question"""
    return quiz_service.generate_understand_quiz(quiz_request)
