from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional
from datetime import datetime, timedelta
from pydantic import BaseModel, field_validator
import hashlib
import os
import re

from ..database import user_db, achievement_db

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Simple token generation for demo (in production, use proper JWT)
def create_token(user_id: str) -> str:
    """Create a simple token for demo purposes"""
    # For demo: just use a hash of user_id + secret
    secret = os.getenv("JWT_SECRET", "nepal-flashcard-demo-secret")
    token_data = f"{user_id}:{secret}:{datetime.utcnow().date()}"
    return hashlib.sha256(token_data.encode()).hexdigest()[:32] + ":" + user_id

def decode_token(token: str) -> Optional[str]:
    """Decode token and return user_id"""
    try:
        parts = token.split(":")
        if len(parts) >= 2:
            return parts[1]
        return None
    except:
        return None

def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    """Dependency to get current authenticated user"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Extract token from "Bearer <token>"
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    token = parts[1]
    user_id = decode_token(token)
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user = user_db.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

# Request/Response models
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        if not re.match(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$', v):
            raise ValueError('Invalid email format')
        return v.lower()

class UserLogin(BaseModel):
    email: str
    password: str
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        return v.lower()

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    daily_streak: int
    total_xp: int
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

@router.post("/register", response_model=TokenResponse)
def register(user_data: UserCreate):
    """Register a new user"""
    # Validate username length
    if len(user_data.username) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters")
    
    # Validate password length
    if len(user_data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    
    # Create user
    user = user_db.create_user(
        username=user_data.username,
        email=user_data.email,
        password=user_data.password
    )
    
    if not user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Seed starter achievements
    achievement_db.seed_user_achievements(user["id"])
    
    # Create token
    token = create_token(user["id"])
    
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user["id"],
            username=user["username"],
            email=user["email"],
            daily_streak=user["daily_streak"],
            total_xp=user["total_xp"],
            created_at=user["created_at"]
        )
    )

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin):
    """Login and get access token"""
    user = user_db.authenticate(credentials.email, credentials.password)
    
    if not user:
        # For demo mode, create user if doesn't exist
        username = credentials.email.split("@")[0]
        user = user_db.create_user(
            username=username,
            email=credentials.email,
            password=credentials.password
        )
        if user:
            achievement_db.seed_user_achievements(user["id"])
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_token(user["id"])
    
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user["id"],
            username=user["username"],
            email=user["email"],
            daily_streak=user["daily_streak"],
            total_xp=user["total_xp"],
            created_at=user["created_at"]
        )
    )

@router.get("/me")
def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user info"""
    return UserResponse(
        id=current_user["id"],
        username=current_user["username"],
        email=current_user["email"],
        daily_streak=current_user["daily_streak"],
        total_xp=current_user["total_xp"],
        created_at=current_user["created_at"]
    )
