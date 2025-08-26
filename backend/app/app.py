from fastapi import FastAPI
from .config import settings
from .middleware import setup_middleware
from .routes import words, progress, health, quiz, recorder, images

def create_app() -> FastAPI:
    """Create and configure the FastAPI application"""
    app = FastAPI(
        title=settings.API_TITLE,
        version=settings.API_VERSION,
        description="A REST API for Nepalese culture-based English word flashcards"
    )
    
    # Setup middleware
    setup_middleware(app)
    
    # Include routers
    app.include_router(health.router)
    app.include_router(words.router)
    app.include_router(progress.router)
    app.include_router(quiz.router)
    app.include_router(recorder.router)
    app.include_router(images.router)
    return app

# Create the app instance
app = create_app()
