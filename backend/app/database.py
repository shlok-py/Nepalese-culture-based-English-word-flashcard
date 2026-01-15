"""
Simple JSON-based database for demo purposes.
Uses file-based storage for persistence during the demo.
"""

import json
import os
import hashlib
from pathlib import Path
from datetime import datetime
from typing import Optional, List
import uuid

# Database file paths
DATA_DIR = Path(__file__).parent.parent / "data"
USERS_FILE = DATA_DIR / "users.json"
ACHIEVEMENTS_FILE = DATA_DIR / "achievements.json"

def ensure_data_files():
    """Ensure data directory and files exist"""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    if not USERS_FILE.exists():
        with open(USERS_FILE, "w") as f:
            json.dump([], f)
    
    if not ACHIEVEMENTS_FILE.exists():
        with open(ACHIEVEMENTS_FILE, "w") as f:
            json.dump([], f)

def hash_password(password: str) -> str:
    """Simple password hashing for demo"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, password_hash: str) -> bool:
    """Verify password against hash"""
    return hash_password(password) == password_hash

class UserDatabase:
    """Simple user database using JSON file storage"""
    
    def __init__(self):
        ensure_data_files()
        self._load_users()
        self._seed_demo_users()
    
    def _load_users(self):
        """Load users from file"""
        try:
            with open(USERS_FILE, "r") as f:
                data = json.load(f)
                self.users = {user["id"]: user for user in data}
        except (json.JSONDecodeError, FileNotFoundError):
            self.users = {}
    
    def _save_users(self):
        """Save users to file"""
        with open(USERS_FILE, "w") as f:
            json.dump(list(self.users.values()), f, indent=2, default=str)
    
    def _seed_demo_users(self):
        """Seed demo users for leaderboard with realistic Nepali names"""
        demo_users = [
            {"username": "Rajesh_Kumar", "email": "rajesh@demo.com", "total_xp": 2450, "daily_streak": 12},
            {"username": "Sita_Sharma", "email": "sita@demo.com", "total_xp": 2180, "daily_streak": 8},
            {"username": "Hari_Thapa", "email": "hari@demo.com", "total_xp": 1950, "daily_streak": 15},
            {"username": "Gita_Rai", "email": "gita@demo.com", "total_xp": 1720, "daily_streak": 6},
            {"username": "Bikram_Shrestha", "email": "bikram@demo.com", "total_xp": 1540, "daily_streak": 9},
            {"username": "Anita_Gurung", "email": "anita@demo.com", "total_xp": 1380, "daily_streak": 4},
            {"username": "Suresh_Adhikari", "email": "suresh@demo.com", "total_xp": 1150, "daily_streak": 7},
            {"username": "Kamala_Basnet", "email": "kamala@demo.com", "total_xp": 980, "daily_streak": 3},
            {"username": "Dipak_Magar", "email": "dipak@demo.com", "total_xp": 820, "daily_streak": 5},
            {"username": "Rupa_Tamang", "email": "rupa@demo.com", "total_xp": 450, "daily_streak": 2},
        ]
        
        for demo_user in demo_users:
            # Check if user already exists by email
            existing = self.get_by_email(demo_user["email"])
            if not existing:
                user_id = str(uuid.uuid4())
                self.users[user_id] = {
                    "id": user_id,
                    "username": demo_user["username"],
                    "email": demo_user["email"],
                    "password_hash": hash_password("demo123"),
                    "daily_streak": demo_user["daily_streak"],
                    "total_xp": demo_user["total_xp"],
                    "last_login": datetime.utcnow().isoformat(),
                    "created_at": datetime.utcnow().isoformat(),
                    "weekly_lessons_completed": demo_user["total_xp"] // 100,
                    "weekly_study_time": demo_user["total_xp"] // 10,
                    "weekly_quiz_average": min(95, 70 + demo_user["daily_streak"] * 2),
                    "weekly_goal": 50
                }
        self._save_users()
    
    def create_user(self, username: str, email: str, password: str) -> Optional[dict]:
        """Create a new user"""
        # Check if email already exists
        if self.get_by_email(email):
            return None
        
        user_id = str(uuid.uuid4())
        user = {
            "id": user_id,
            "username": username,
            "email": email,
            "password_hash": hash_password(password),
            "daily_streak": 0,  # Start with 0 streak - earn it by learning
            "total_xp": 0,  # Start with 0 XP - earn it through activities
            "last_login": datetime.utcnow().isoformat(),
            "created_at": datetime.utcnow().isoformat(),
            "weekly_lessons_completed": 0,
            "weekly_study_time": 0,
            "weekly_quiz_average": 0.0,
            "weekly_goal": 0,  # 0 means not set yet - prompt user
            "is_first_login": True,  # Flag for first login to show goal prompt
            "category_progress": {},  # Track progress per category
            "cards_viewed": 0,  # Total cards viewed
            "quizzes_completed": 0  # Total quizzes completed
        }
        self.users[user_id] = user
        self._save_users()
        return user
    
    def get_by_email(self, email: str) -> Optional[dict]:
        """Get user by email"""
        for user in self.users.values():
            if user["email"] == email:
                return user
        return None
    
    def get_by_id(self, user_id: str) -> Optional[dict]:
        """Get user by ID"""
        return self.users.get(user_id)
    
    def authenticate(self, email: str, password: str) -> Optional[dict]:
        """Authenticate user and return user data if valid"""
        user = self.get_by_email(email)
        if user and verify_password(password, user["password_hash"]):
            # Update last login
            user["last_login"] = datetime.utcnow().isoformat()
            self._save_users()
            return user
        return None
    
    def update_user(self, user_id: str, updates: dict) -> Optional[dict]:
        """Update user data"""
        if user_id in self.users:
            self.users[user_id].update(updates)
            self._save_users()
            return self.users[user_id]
        return None
    
    def get_leaderboard(self, limit: int = 10) -> List[dict]:
        """Get top users by XP"""
        sorted_users = sorted(
            self.users.values(),
            key=lambda x: x.get("total_xp", 0),
            reverse=True
        )[:limit]
        
        return [
            {
                "rank": i + 1,
                "username": user["username"],
                "total_xp": user.get("total_xp", 0),
                "daily_streak": user.get("daily_streak", 0)
            }
            for i, user in enumerate(sorted_users)
        ]
    
    def add_xp(self, user_id: str, xp: int) -> Optional[dict]:
        """Add XP to user"""
        if user_id in self.users:
            self.users[user_id]["total_xp"] = self.users[user_id].get("total_xp", 0) + xp
            self._save_users()
            return self.users[user_id]
        return None
    
    def update_category_progress(self, user_id: str, category: str, cards_completed: int, total_cards: int) -> Optional[dict]:
        """Update user's progress for a specific category"""
        if user_id in self.users:
            user = self.users[user_id]
            
            # Initialize category_progress if not exists
            if "category_progress" not in user:
                user["category_progress"] = {}
            
            # Update category progress
            user["category_progress"][category] = {
                "cards_completed": cards_completed,
                "total_cards": total_cards,
                "percentage": round((cards_completed / total_cards) * 100, 1) if total_cards > 0 else 0,
                "last_updated": datetime.utcnow().isoformat()
            }
            
            # Update total cards viewed
            user["cards_viewed"] = user.get("cards_viewed", 0) + 1
            
            self._save_users()
            return user
        return None
    
    def get_category_progress(self, user_id: str) -> dict:
        """Get user's progress for all categories"""
        if user_id in self.users:
            return self.users[user_id].get("category_progress", {})
        return {}


class AchievementDatabase:
    """Simple achievement database using JSON file storage"""
    
    # Achievement definitions
    ACHIEVEMENT_DEFINITIONS = [
        {
            "id": "first_card",
            "name": "First Step",
            "description": "Complete your first flashcard",
            "icon": "🎯",
            "xp_bonus": 50,
            "trigger": "flashcard_complete"
        },
        {
            "id": "quick_learner",
            "name": "Quick Learner",
            "description": "Complete 5 flashcards in one session",
            "icon": "⚡",
            "xp_bonus": 100,
            "trigger": "session_complete"
        },
        {
            "id": "streak_3",
            "name": "Daily Warrior",
            "description": "Maintain a 3-day streak",
            "icon": "🔥",
            "xp_bonus": 150,
            "trigger": "daily_login"
        },
        {
            "id": "streak_7",
            "name": "Week Champion",
            "description": "Maintain a 7-day streak",
            "icon": "👑",
            "xp_bonus": 300,
            "trigger": "daily_login"
        },
        {
            "id": "quiz_master",
            "name": "Quiz Master",
            "description": "Score 80% or higher on a quiz",
            "icon": "🎓",
            "xp_bonus": 200,
            "trigger": "quiz_complete"
        },
        {
            "id": "category_complete",
            "name": "Category Champion",
            "description": "Complete all flashcards in one category",
            "icon": "🏅",
            "xp_bonus": 250,
            "trigger": "category_complete"
        },
        {
            "id": "xp_500",
            "name": "Rising Star",
            "description": "Earn 500 total XP",
            "icon": "⭐",
            "xp_bonus": 100,
            "trigger": "xp_milestone"
        },
        {
            "id": "xp_1000",
            "name": "Knowledge Seeker",
            "description": "Earn 1000 total XP",
            "icon": "🌟",
            "xp_bonus": 200,
            "trigger": "xp_milestone"
        }
    ]
    
    def __init__(self):
        ensure_data_files()
        self._load_achievements()
    
    def _load_achievements(self):
        """Load achievements from file"""
        try:
            with open(ACHIEVEMENTS_FILE, "r") as f:
                data = json.load(f)
                self.achievements = data
        except (json.JSONDecodeError, FileNotFoundError):
            self.achievements = []
    
    def _save_achievements(self):
        """Save achievements to file"""
        with open(ACHIEVEMENTS_FILE, "w") as f:
            json.dump(self.achievements, f, indent=2, default=str)
    
    def get_user_achievements(self, user_id: str, limit: int = 5) -> List[dict]:
        """Get achievements for a user"""
        user_achievements = [a for a in self.achievements if a.get("user_id") == user_id]
        # Sort by earned_at descending and limit
        user_achievements.sort(key=lambda x: x.get("earned_at", ""), reverse=True)
        return user_achievements[:limit]
    
    def has_achievement(self, user_id: str, achievement_id: str) -> bool:
        """Check if user has a specific achievement"""
        return any(
            a.get("user_id") == user_id and a.get("achievement_id") == achievement_id 
            for a in self.achievements
        )
    
    def add_achievement(self, user_id: str, achievement_id: str = None, name: str = None, icon: str = None, description: str = None, xp_bonus: int = 0) -> dict:
        """Add achievement for user"""
        achievement = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "achievement_id": achievement_id,
            "name": name,
            "icon": icon,
            "description": description,
            "xp_bonus": xp_bonus,
            "earned_at": datetime.utcnow().isoformat()
        }
        self.achievements.append(achievement)
        self._save_achievements()
        return achievement
    
    def check_achievements(self, user_id: str, trigger_type: str, context_data: dict = None) -> dict:
        """Check and award achievements based on trigger type"""
        context_data = context_data or {}
        newly_unlocked = []
        total_xp_awarded = 0
        
        # Get user data
        user = user_db.get_by_id(user_id)
        if not user:
            return {"newly_unlocked": [], "total_xp_awarded": 0}
        
        for achievement_def in self.ACHIEVEMENT_DEFINITIONS:
            if achievement_def["trigger"] != trigger_type:
                continue
            
            # Skip if already unlocked
            if self.has_achievement(user_id, achievement_def["id"]):
                continue
            
            # Check conditions based on trigger type
            should_unlock = False
            
            if trigger_type == "flashcard_complete":
                if achievement_def["id"] == "first_card":
                    should_unlock = True  # First flashcard completed
                    
            elif trigger_type == "session_complete":
                session_cards = context_data.get("session_cards", 0)
                if achievement_def["id"] == "quick_learner" and session_cards >= 5:
                    should_unlock = True
                    
            elif trigger_type == "daily_login":
                streak = user.get("daily_streak", 0)
                if achievement_def["id"] == "streak_3" and streak >= 3:
                    should_unlock = True
                elif achievement_def["id"] == "streak_7" and streak >= 7:
                    should_unlock = True
                    
            elif trigger_type == "quiz_complete":
                score = context_data.get("score", 0)
                if achievement_def["id"] == "quiz_master" and score >= 80:
                    should_unlock = True
                    
            elif trigger_type == "category_complete":
                if achievement_def["id"] == "category_complete":
                    should_unlock = True
                    
            elif trigger_type == "xp_milestone":
                total_xp = user.get("total_xp", 0)
                if achievement_def["id"] == "xp_500" and total_xp >= 500:
                    should_unlock = True
                elif achievement_def["id"] == "xp_1000" and total_xp >= 1000:
                    should_unlock = True
            
            if should_unlock:
                # Award achievement
                new_achievement = self.add_achievement(
                    user_id=user_id,
                    achievement_id=achievement_def["id"],
                    name=achievement_def["name"],
                    icon=achievement_def["icon"],
                    description=achievement_def["description"],
                    xp_bonus=achievement_def["xp_bonus"]
                )
                newly_unlocked.append(new_achievement)
                total_xp_awarded += achievement_def["xp_bonus"]
                
                # Award XP bonus
                user_db.add_xp(user_id, achievement_def["xp_bonus"])
        
        return {
            "newly_unlocked": newly_unlocked,
            "total_xp_awarded": total_xp_awarded
        }
    
    def seed_user_achievements(self, user_id: str):
        """Seed starter achievements for new user"""
        starter_achievements = [
            {"id": "first_steps", "name": "First Steps", "icon": "🎯", "description": "Started your learning journey", "xp_bonus": 25},
            {"id": "word_explorer", "name": "Word Explorer", "icon": "🔍", "description": "Curious about Nepali culture", "xp_bonus": 25},
        ]
        for achievement in starter_achievements:
            self.add_achievement(
                user_id, 
                achievement_id=achievement["id"],
                name=achievement["name"], 
                icon=achievement["icon"],
                description=achievement["description"],
                xp_bonus=achievement["xp_bonus"]
            )


# Singleton instances
user_db = UserDatabase()
achievement_db = AchievementDatabase()
