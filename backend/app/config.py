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
        "http://127.0.0.1:3000"
    ]
    
    # Data Configuration
    DATA_FILE_PATH: str = r"data\words.json"
    FAV_FILE_PATH: str = r"data\favorites.json"
    
    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000

# Global settings instance
settings = Settings()
