from fastapi import APIRouter

router = APIRouter(tags=["health"])

@router.get("/")
def root():
    """Root endpoint"""
    return {"message": "Nepalese Flashcard API"}

@router.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "API is running"}
