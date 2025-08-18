from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import json
import os

app = FastAPI(title="Nepalese Flashcard API", version="1.0.0")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class Word(BaseModel):
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
    currentCardIndex: int = 0
    favorites: List[str] = []
    completedCards: List[str] = []
    totalCardsViewed: int = 0
    streakDays: int = 0

# In-memory storage (replace with database in production)
words_data = []
user_progress = UserProgress()

def load_words():
    """Load words from JSON file"""
    try:
        with open(r"data\words.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        
        raise ValueError("Fle not found")

@app.on_event("startup")
async def startup_event():
    global words_data
    words_data = load_words()

@app.get("/")
async def root():
    return {"message": "Nepalese Flashcard API"}

@app.get("/api/words", response_model=List[Word])
def get_words():
    """Get all flashcard words"""
    # words_data = load_words()
    return words_data

@app.get("/api/words/{word_id}", response_model=Word)
async def get_word(word_id: str):
    """Get a specific word by ID"""
    word = next((w for w in words_data if w["id"] == word_id), None)
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    return word

@app.get("/api/progress", response_model=UserProgress)
async def get_progress():
    """Get user progress"""
    return user_progress

@app.post("/api/progress")
async def update_progress(progress: UserProgress):
    """Update user progress"""
    global user_progress
    user_progress = progress
    return {"message": "Progress updated successfully"}

@app.post("/api/favorites/{word_id}")
async def toggle_favorite(word_id: str):
    """Toggle favorite status for a word"""
    if word_id in user_progress.favorites:
        user_progress.favorites.remove(word_id)
        action = "removed"
    else:
        user_progress.favorites.append(word_id)
        action = "added"
    
    return {"message": f"Word {action} from favorites", "favorites": user_progress.favorites}

@app.get("/api/favorites", response_model=List[Word])
async def get_favorites():
    """Get all favorite words"""
    favorite_words = [w for w in words_data if w["id"] in user_progress.favorites]
    return favorite_words

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)