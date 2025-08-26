from fastapi import APIRouter, HTTPException, Depends
from typing import List
from ..models import Word
from ..services import WordService

router = APIRouter(prefix="/api/words", tags=["words"])

def get_word_service() -> WordService:
    """Dependency to get word service instance"""
    return WordService()

@router.get("/", response_model=List[Word])
def get_words(word_service: WordService = Depends(get_word_service)):
    """Get all flashcard words"""
    return word_service.get_all_words()

@router.get("/get_random_fav_word")
def get_fav_word(word_service: WordService = Depends(get_word_service)):
    """Get a random favorite word"""
    fav_word = word_service.get_random_favorite_word()
    if not fav_word:
        raise HTTPException(status_code=404, detail="No favorite words found")
    return fav_word

@router.get("/{word_id}", response_model=Word)
def get_word(word_id: str, word_service: WordService = Depends(get_word_service)):
    """Get a specific word by ID"""
    word = word_service.get_word_by_id(word_id)
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    return word

@router.get("/category/{category}", response_model=List[Word])
def get_words_by_category(category: str, word_service: WordService = Depends(get_word_service)):
    """Get words filtered by category"""
    return word_service.get_words_by_category(category)

@router.get("/difficulty/{difficulty}", response_model=List[Word])
def get_words_by_difficulty(difficulty: str, word_service: WordService = Depends(get_word_service)):
    """Get words filtered by difficulty"""
    return word_service.get_words_by_difficulty(difficulty)


