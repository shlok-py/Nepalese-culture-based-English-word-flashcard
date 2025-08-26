from fastapi import APIRouter, Depends
from typing import List
from ..models import Word, UserProgress
from ..services import ProgressService, WordService

router = APIRouter(prefix="/api", tags=["progress"])

def get_progress_service() -> ProgressService:
    """Dependency to get progress service instance"""
    return ProgressService()

def get_word_service() -> WordService:
    """Dependency to get word service instance"""
    return WordService()

@router.get("/progress", response_model=UserProgress)
def get_progress(progress_service: ProgressService = Depends(get_progress_service)):
    """Get user progress"""
    return progress_service.get_progress()

@router.post("/progress")
def update_progress(
    progress: UserProgress, 
    progress_service: ProgressService = Depends(get_progress_service)
):
    """Update user progress"""
    progress_service.update_progress(progress)
    return {"message": "Progress updated successfully"}

@router.post("/favorites/{word_id}")
def toggle_favorite(
    word_id: str, 
    progress_service: ProgressService = Depends(get_progress_service)
):
    """Toggle favorite status for a word"""
    return progress_service.toggle_favorite(word_id)

@router.get("/favorites", response_model=List[Word])
def get_favorites():
    """Get all favorite words from data/favorites.json"""
    import json
    from ..config import settings
    from ..models import Word
    with open(settings.FAV_FILE_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    return [Word(**item) for item in data]
