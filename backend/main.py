import uvicorn
from app.app import app
from app.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "app.app:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )