import os
from typing import List

class Settings:
    """Application settings and configuration"""
    
    # API Configuration
    API_TITLE: str = "Nepalese Flashcard API"
    API_VERSION: str = "1.0.0"
    
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "*"  # Allow all origins (for development; restrict in production)
    ]
    
    # Data Configuration - use os.path.join for cross-platform compatibility
    DATA_FILE_PATH: str = os.path.join("data", "words.json")
    FAV_FILE_PATH: str = os.path.join("data", "favorites.json")
    
    # Server Configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

# Global settings instance
settings = Settings()
