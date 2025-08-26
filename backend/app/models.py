from pydantic import BaseModel, Field
from typing import List, Optional

class Word(BaseModel):
    """Model for flashcard word data"""
    id: str
    english: str
    nepaliContext: str
    meaning: str
    example: str
    culturalNote: str
    image: str
    difficulty: str
    category: str

class UserProgress(BaseModel):
    """Model for user progress tracking"""
    currentCardIndex: int = 0
    favorites: List[str] = []
    completedCards: List[str] = []
    totalCardsViewed: int = 0
    streakDays: int = 0

class ProgressUpdate(BaseModel):
    """Model for updating user progress"""
    currentCardIndex: Optional[int] = None
    favorites: Optional[List[str]] = None
    completedCards: Optional[List[str]] = None
    totalCardsViewed: Optional[int] = None
    streakDays: Optional[int] = None

class QuizResponse(BaseModel):
    """Model for quiz response"""
    question: str
    option_1: str = Field(alias="1")
    option_2: str = Field(alias="2") 
    option_3: str = Field(alias="3")
    option_4: str = Field(alias="4")
    right_answer: str
    
    class Config:
        population_by_name = True

class QuizRequest(BaseModel):
    """Model for quiz generation request"""
    prev_question: Optional[str] = None
    is_correct: Optional[bool] = None  
    right_answer: Optional[str] = None
    given_answer: Optional[str] = None
    category: Optional[str] = None

class UnderstandQuizResponse(BaseModel):
    context: str
    question: str
    option_1: str = Field(alias="1")
    option_2: str = Field(alias="2") 
    option_3: str = Field(alias="3")
    right_answer: str