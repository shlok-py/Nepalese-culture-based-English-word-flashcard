from fastapi import APIRouter, Depends, HTTPException
from typing import List
from pydantic import BaseModel

from ..database import user_db, achievement_db
from .auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])

class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    total_xp: int
    daily_streak: int

class Achievement(BaseModel):
    id: str
    name: str
    icon: str
    earned_at: str

class WeeklyStats(BaseModel):
    lessons_completed: int
    study_time: int
    quiz_average: float
    weekly_goal: int
    progress_percentage: int

class DashboardResponse(BaseModel):
    username: str
    daily_streak: int
    total_xp: int
    recent_achievements: List[Achievement]
    weekly_stats: WeeklyStats
    is_first_login: bool = False
    needs_weekly_goal: bool = False

@router.get("/me/dashboard", response_model=DashboardResponse)
def get_dashboard(current_user: dict = Depends(get_current_user)):
    """Get dashboard data for current user"""
    # Get user's recent achievements
    achievements_data = achievement_db.get_user_achievements(current_user["id"], limit=3)
    achievements = [
        Achievement(
            id=a.get("id", ""),
            name=a.get("name", ""),
            icon=a.get("icon", "🏆"),
            earned_at=a.get("earned_at", "")
        )
        for a in achievements_data
    ]
    
    # Calculate weekly progress percentage
    weekly_goal = current_user.get("weekly_goal", 0)
    total_xp = current_user.get("total_xp", 0)
    # For demo, assume weekly XP is a portion of total
    weekly_xp = min(total_xp, weekly_goal * 2) if weekly_goal > 0 else 0
    progress_percentage = min(100, int((weekly_xp / weekly_goal) * 100)) if weekly_goal > 0 else 0
    
    # Check if user needs to set weekly goal
    is_first_login = current_user.get("is_first_login", False)
    needs_weekly_goal = weekly_goal == 0 or is_first_login
    
    return DashboardResponse(
        username=current_user["username"],
        daily_streak=current_user.get("daily_streak", 0),
        total_xp=current_user.get("total_xp", 0),
        recent_achievements=achievements,
        weekly_stats=WeeklyStats(
            lessons_completed=current_user.get("weekly_lessons_completed", 0),
            study_time=current_user.get("weekly_study_time", 0),
            quiz_average=current_user.get("weekly_quiz_average", 0),
            weekly_goal=weekly_goal,
            progress_percentage=progress_percentage
        ),
        is_first_login=is_first_login,
        needs_weekly_goal=needs_weekly_goal
    )

@router.get("/leaderboard", response_model=List[LeaderboardEntry])
def get_leaderboard(limit: int = 10):
    """Get leaderboard - top users by XP"""
    leaderboard_data = user_db.get_leaderboard(limit=limit)
    return [
        LeaderboardEntry(
            rank=entry["rank"],
            username=entry["username"],
            total_xp=entry["total_xp"],
            daily_streak=entry["daily_streak"]
        )
        for entry in leaderboard_data
    ]

@router.post("/me/add-xp")
def add_user_xp(xp: int, current_user: dict = Depends(get_current_user)):
    """Add XP to current user (for demo/testing)"""
    if xp < 0 or xp > 1000:
        raise HTTPException(status_code=400, detail="XP must be between 0 and 1000")
    
    updated_user = user_db.add_xp(current_user["id"], xp)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": f"Added {xp} XP", "total_xp": updated_user["total_xp"]}


class WeeklyGoalRequest(BaseModel):
    weekly_goal: int  # Minutes per week

@router.post("/me/set-weekly-goal")
def set_weekly_goal(request: WeeklyGoalRequest, current_user: dict = Depends(get_current_user)):
    """Set or update user's weekly learning goal"""
    if request.weekly_goal < 5 or request.weekly_goal > 300:
        raise HTTPException(status_code=400, detail="Weekly goal must be between 5 and 300 minutes")
    
    # Update user with new goal and mark first login complete
    updates = {
        "weekly_goal": request.weekly_goal,
        "is_first_login": False
    }
    updated_user = user_db.update_user(current_user["id"], updates)
    
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "message": "Weekly goal set successfully",
        "weekly_goal": request.weekly_goal
    }


class AchievementCheckRequest(BaseModel):
    trigger_type: str
    context_data: dict = {}

class AchievementUnlocked(BaseModel):
    id: str
    name: str
    icon: str
    description: str
    xp_bonus: int
    earned_at: str

class AchievementCheckResponse(BaseModel):
    newly_unlocked: List[AchievementUnlocked]
    total_xp_awarded: int

@router.post("/achievements/check", response_model=AchievementCheckResponse)
def check_achievements(request: AchievementCheckRequest, current_user: dict = Depends(get_current_user)):
    """Check and award achievements based on trigger type"""
    result = achievement_db.check_achievements(
        user_id=current_user["id"],
        trigger_type=request.trigger_type,
        context_data=request.context_data
    )
    
    newly_unlocked = [
        AchievementUnlocked(
            id=a.get("id", ""),
            name=a.get("name", ""),
            icon=a.get("icon", "🏆"),
            description=a.get("description", ""),
            xp_bonus=a.get("xp_bonus", 0),
            earned_at=a.get("earned_at", "")
        )
        for a in result.get("newly_unlocked", [])
    ]
    
    return AchievementCheckResponse(
        newly_unlocked=newly_unlocked,
        total_xp_awarded=result.get("total_xp_awarded", 0)
    )


@router.post("/me/save-progress")
def save_progress(current_user: dict = Depends(get_current_user)):
    """Save user progress (called before logout)"""
    # In a real app, this would flush any pending progress to the database
    # For our demo, all progress is already saved
    return {"message": "Progress saved successfully"}


# Category Progress Tracking
class CategoryProgressUpdate(BaseModel):
    category: str
    cards_completed: int
    total_cards: int

class CategoryProgress(BaseModel):
    category: str
    cards_completed: int
    total_cards: int
    percentage: float
    last_updated: str

class CategoryProgressResponse(BaseModel):
    progress: dict

@router.put("/me/flashcard-progress")
def update_flashcard_progress(
    progress_update: CategoryProgressUpdate, 
    current_user: dict = Depends(get_current_user)
):
    """Update user's flashcard progress for a category"""
    updated_user = user_db.update_category_progress(
        user_id=current_user["id"],
        category=progress_update.category,
        cards_completed=progress_update.cards_completed,
        total_cards=progress_update.total_cards
    )
    
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    category_progress = updated_user.get("category_progress", {}).get(progress_update.category, {})
    
    return {
        "message": "Progress updated",
        "category": progress_update.category,
        "percentage": category_progress.get("percentage", 0),
        "cards_viewed": updated_user.get("cards_viewed", 0)
    }

@router.get("/me/category-progress", response_model=CategoryProgressResponse)
def get_category_progress_endpoint(current_user: dict = Depends(get_current_user)):
    """Get user's progress for all categories"""
    progress = user_db.get_category_progress(current_user["id"])
    return CategoryProgressResponse(progress=progress)
