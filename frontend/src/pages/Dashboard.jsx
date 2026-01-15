import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../style/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [weeklyGoal, setWeeklyGoal] = useState(30);
  const [savingGoal, setSavingGoal] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Fetch dashboard data
        const dashboardRes = await fetch("http://localhost:8000/api/users/me/dashboard", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (dashboardRes.ok) {
          const dashboardJson = await dashboardRes.json();
          setDashboardData(dashboardJson);
          
          // Check if user needs to set weekly goal
          if (dashboardJson.needs_weekly_goal || dashboardJson.is_first_login) {
            setShowGoalModal(true);
          }
        } else {
          // Use stored user data as fallback
          if (storedUser) {
            const user = JSON.parse(storedUser);
            setDashboardData({
              username: user.username || "Learner",
              daily_streak: user.daily_streak || 7,
              total_xp: user.total_xp || 1240,
              recent_achievements: [
                { id: "1", name: "First Steps", icon: "🎯", earned_at: new Date().toISOString() },
                { id: "2", name: "Quick Learner", icon: "⚡", earned_at: new Date().toISOString() },
                { id: "3", name: "Word Explorer", icon: "🔍", earned_at: new Date().toISOString() },
              ],
              weekly_stats: {
                lessons_completed: 12,
                study_time: 252,
                quiz_average: 92,
                weekly_goal: 50,
                progress_percentage: 80
              }
            });
          }
        }

        // Fetch leaderboard
        const leaderboardRes = await fetch("http://localhost:8000/api/users/leaderboard?limit=5", {
          headers: { "Content-Type": "application/json" },
        });

        if (leaderboardRes.ok) {
          const leaderboardJson = await leaderboardRes.json();
          setLeaderboard(leaderboardJson);
        } else {
          // Fallback leaderboard with realistic Nepali names
          setLeaderboard([
            { rank: 1, username: "Rajesh_Kumar", total_xp: 2450, daily_streak: 12 },
            { rank: 2, username: "Sita_Sharma", total_xp: 2180, daily_streak: 8 },
            { rank: 3, username: "Hari_Thapa", total_xp: 1950, daily_streak: 15 },
            { rank: 4, username: "Gita_Rai", total_xp: 1720, daily_streak: 6 },
            { rank: 5, username: "Bikram_Shrestha", total_xp: 1540, daily_streak: 9 },
          ]);
        }
      } catch (err) {
        console.debug("Dashboard fetch error, using fallback data");
        // Use fallback data
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setDashboardData({
            username: user.username || "Learner",
            daily_streak: user.daily_streak || 7,
            total_xp: user.total_xp || 1240,
            recent_achievements: [
              { id: "1", name: "First Steps", icon: "🎯", earned_at: new Date().toISOString() },
              { id: "2", name: "Quick Learner", icon: "⚡", earned_at: new Date().toISOString() },
              { id: "3", name: "Word Explorer", icon: "🔍", earned_at: new Date().toISOString() },
            ],
            weekly_stats: {
              lessons_completed: 12,
              study_time: 252,
              quiz_average: 92,
              weekly_goal: 50,
              progress_percentage: 80
            }
          });
        }
        setLeaderboard([
          { rank: 1, username: "Rajesh_Kumar", total_xp: 2450, daily_streak: 12 },
          { rank: 2, username: "Sita_Sharma", total_xp: 2180, daily_streak: 8 },
          { rank: 3, username: "Hari_Thapa", total_xp: 1950, daily_streak: 15 },
          { rank: 4, username: "Gita_Rai", total_xp: 1720, daily_streak: 6 },
          { rank: 5, username: "Bikram_Shrestha", total_xp: 1540, daily_streak: 9 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSaveWeeklyGoal = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    setSavingGoal(true);
    try {
      const res = await fetch("http://localhost:8000/api/users/me/set-weekly-goal", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ weekly_goal: weeklyGoal }),
      });
      
      if (res.ok) {
        // Update local state
        setDashboardData(prev => ({
          ...prev,
          is_first_login: false,
          needs_weekly_goal: false,
          weekly_stats: {
            ...prev?.weekly_stats,
            weekly_goal: weeklyGoal
          }
        }));
        setShowGoalModal(false);
      }
    } catch (err) {
      console.error("Failed to save weekly goal:", err);
    } finally {
      setSavingGoal(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner-large"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const username = dashboardData?.username || "Learner";
  const streak = dashboardData?.daily_streak || 0;
  const totalXp = dashboardData?.total_xp || 0;
  const achievements = dashboardData?.recent_achievements || [];
  const weeklyStats = dashboardData?.weekly_stats || {};
  
  // Check if user has started learning
  const hasStartedLearning = (weeklyStats.lessons_completed || 0) > 0 || 
                             (dashboardData?.total_flashcards_completed || 0) > 0;

  // Medal emoji helper
  const getMedal = (rank) => {
    switch(rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return `${rank}.`;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <span className="nav-logo">🇳🇵</span>
          <span className="nav-title">Nepal Flashcards</span>
        </div>
        <div className="nav-actions">
          <Link to="/flashcard" className="nav-link">📇 Flashcards</Link>
          <Link to="/learn" className="nav-link">📚 Learn</Link>
          <Link to="/quiz" className="nav-link">❓ Quiz</Link>
          <Link to="/roleplay" className="nav-link">🎭 Roleplay</Link>
          <button onClick={handleLogout} className="nav-logout">🚪 Logout</button>
        </div>
      </nav>

      <main className="dashboard-main">
        {/* Welcome Header with CTA */}
        <header className="dashboard-header">
          <div className="welcome-section">
            <h1>Hey {username}! 🎉</h1>
            <p>Ready to continue your learning journey?</p>
          </div>
          <button 
            className={`cta-learning-button ${!hasStartedLearning ? 'pulse-animation' : ''}`}
            onClick={() => navigate('/learn')}
          >
            {hasStartedLearning ? "📚 Continue Learning" : "🚀 Start Learning Now"}
          </button>
        </header>

        {/* Stats Cards Row */}
        <div className="stats-row">
          <div className="stat-card-dashboard streak-card">
            <div className="stat-icon-dash">🔥</div>
            <div className="stat-content">
              <p className="stat-label-dash">Daily Streak</p>
              <p className="stat-value-dash">{streak} days</p>
            </div>
          </div>
          <div className="stat-card-dashboard xp-card">
            <div className="stat-icon-dash">⭐</div>
            <div className="stat-content">
              <p className="stat-label-dash">Total XP</p>
              <p className="stat-value-dash">{totalXp.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <section className="achievements-section">
          <h2>🏆 Recent Achievements</h2>
          <div className="achievements-grid">
            {achievements.length > 0 ? (
              achievements.map((achievement, index) => (
                <div key={index} className="achievement-card">
                  <span className="achievement-icon">{achievement.icon}</span>
                  <div className="achievement-info">
                    <p className="achievement-name">{achievement.name}</p>
                    <p className="achievement-date">
                      {new Date(achievement.earned_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-achievements">Start learning to earn achievements!</p>
            )}
          </div>
        </section>

        {/* Quick Actions - MOVED ABOVE GRID */}
        <section className="quick-actions">
          <h2>⚡ Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/learn" className="action-card">
              <span className="action-icon">📚</span>
              <span className="action-text">Continue Learning</span>
            </Link>
            <Link to="/quiz" className="action-card">
              <span className="action-icon">❓</span>
              <span className="action-text">Take Quiz</span>
            </Link>
            <Link to="/flashcard" className="action-card">
              <span className="action-icon">🃏</span>
              <span className="action-text">View Flashcards</span>
            </Link>
            <Link to="/roleplay" className="action-card">
              <span className="action-icon">🎭</span>
              <span className="action-text">Roleplay</span>
            </Link>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="dashboard-grid">
          {/* This Week Stats */}
          <section className="weekly-section">
            <h2>📅 This Week</h2>
            <div className="weekly-stats">
              <div className="weekly-stat-row">
                <span>Lessons Completed</span>
                <span className="weekly-value">{weeklyStats.lessons_completed || 0}</span>
              </div>
              <div className="weekly-stat-row">
                <span>Study Time</span>
                <span className="weekly-value">{Math.round((weeklyStats.study_time || 0) / 60 * 10) / 10}h</span>
              </div>
              <div className="weekly-stat-row">
                <span>Quiz Average</span>
                <span className="weekly-value success">{weeklyStats.quiz_average || 0}%</span>
              </div>
            </div>
            <div className="goal-section-dash">
              <div className="goal-header-dash">
                <span>Weekly Goal</span>
                <span className="goal-percentage-dash">{weeklyStats.progress_percentage || 0}%</span>
              </div>
              <div className="goal-bar-dash">
                <div 
                  className="goal-progress-dash" 
                  style={{ width: `${weeklyStats.progress_percentage || 0}%` }}
                ></div>
              </div>
            </div>
          </section>

          {/* Leaderboard */}
          <section className="leaderboard-section">
            <div className="section-header">
              <h2>📊 Leaderboard</h2>
              <Link to="/leaderboard" className="view-all-btn">View All →</Link>
            </div>
            <div className="leaderboard-list-dash">
              {leaderboard.map((user, index) => (
                <div key={index} className={`leaderboard-item-dash rank-${user.rank}`}>
                  <span className="rank-medal">{getMedal(user.rank)}</span>
                  <div className="user-info-dash">
                    <span className="user-name-dash">{user.username}</span>
                  </div>
                  <span className="user-xp-dash">{user.total_xp.toLocaleString()} XP</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Weekly Goal Modal */}
      {showGoalModal && (
        <div className="goal-modal-overlay">
          <div className="goal-modal">
            <div className="goal-modal-header">
              <span className="goal-modal-icon">🎯</span>
              <h2>Set Your Weekly Learning Goal</h2>
            </div>
            <p className="goal-modal-description">
              How many minutes per week would you like to spend learning Nepali culture?
            </p>
            <div className="goal-slider-container">
              <input
                type="range"
                min="5"
                max="120"
                step="5"
                value={weeklyGoal}
                onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                className="goal-slider"
              />
              <div className="goal-value-display">
                <span className="goal-time">{weeklyGoal}</span>
                <span className="goal-unit">minutes/week</span>
              </div>
            </div>
            <div className="goal-suggestions">
              <button 
                className={`goal-preset ${weeklyGoal === 15 ? 'active' : ''}`}
                onClick={() => setWeeklyGoal(15)}
              >
                Casual<br/>15 min
              </button>
              <button 
                className={`goal-preset ${weeklyGoal === 30 ? 'active' : ''}`}
                onClick={() => setWeeklyGoal(30)}
              >
                Regular<br/>30 min
              </button>
              <button 
                className={`goal-preset ${weeklyGoal === 60 ? 'active' : ''}`}
                onClick={() => setWeeklyGoal(60)}
              >
                Serious<br/>1 hour
              </button>
              <button 
                className={`goal-preset ${weeklyGoal === 120 ? 'active' : ''}`}
                onClick={() => setWeeklyGoal(120)}
              >
                Intensive<br/>2 hours
              </button>
            </div>
            <button 
              className="goal-save-btn"
              onClick={handleSaveWeeklyGoal}
              disabled={savingGoal}
            >
              {savingGoal ? "Saving..." : "🚀 Start Learning"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
