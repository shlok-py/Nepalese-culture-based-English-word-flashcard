import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../style/leaderboard.css";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      if (!token) {
        navigate("/login");
        return;
      }

      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }

      try {
        const response = await fetch("http://localhost:8000/api/users/leaderboard?limit=20", {
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          setLeaderboard(data);
        } else {
          // Fallback data
          setLeaderboard(getFallbackLeaderboard());
        }
      } catch (err) {
        console.debug("Leaderboard fetch error, using fallback");
        setLeaderboard(getFallbackLeaderboard());
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [navigate]);

  const getFallbackLeaderboard = () => [
    { rank: 1, username: "NepaliLearner", total_xp: 2450, daily_streak: 12 },
    { rank: 2, username: "CultureExplorer", total_xp: 2180, daily_streak: 8 },
    { rank: 3, username: "WordMaster", total_xp: 1950, daily_streak: 15 },
    { rank: 4, username: "FlashcardPro", total_xp: 1720, daily_streak: 6 },
    { rank: 5, username: "QuizChamp", total_xp: 1540, daily_streak: 9 },
    { rank: 6, username: "LanguageBuff", total_xp: 1380, daily_streak: 4 },
    { rank: 7, username: "StudyBuddy", total_xp: 1150, daily_streak: 7 },
    { rank: 8, username: "LearnDaily", total_xp: 980, daily_streak: 3 },
    { rank: 9, username: "VocabBuilder", total_xp: 820, daily_streak: 5 },
    { rank: 10, username: "NewLearner", total_xp: 450, daily_streak: 2 },
  ];

  const getRankBadge = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  if (loading) {
    return (
      <div className="leaderboard-loading">
        <div className="loading-spinner-large"></div>
        <p>Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      {/* Header */}
      <div className="leaderboard-header-section">
        <Link to="/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>
        <div className="header-content-lb">
          <h1>🏆 Leaderboard</h1>
          <p>See how you rank against other learners</p>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="podium-section">
        {leaderboard.slice(0, 3).map((user, index) => (
          <div 
            key={user.username} 
            className={`podium-item podium-${index + 1}`}
          >
            <div className="podium-avatar">
              {user.username[0].toUpperCase()}
            </div>
            <div className="podium-badge">{getRankBadge(user.rank)}</div>
            <div className="podium-name">{user.username}</div>
            <div className="podium-xp">{user.total_xp.toLocaleString()} XP</div>
            <div className="podium-streak">🔥 {user.daily_streak} days</div>
          </div>
        ))}
      </div>

      {/* Full Leaderboard Table */}
      <div className="leaderboard-table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Total XP</th>
              <th>Daily Streak</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user) => (
              <tr 
                key={user.username}
                className={currentUser?.username === user.username ? 'current-user-row' : ''}
              >
                <td className="rank-cell">
                  <span className={`rank-badge rank-${user.rank}`}>
                    {getRankBadge(user.rank)}
                  </span>
                </td>
                <td className="user-cell">
                  <div className="user-info-lb">
                    <span className="user-avatar-lb">
                      {user.username[0].toUpperCase()}
                    </span>
                    <span className="user-name-lb">{user.username}</span>
                    {currentUser?.username === user.username && (
                      <span className="you-badge">You</span>
                    )}
                  </div>
                </td>
                <td className="xp-cell">
                  <span className="xp-value">{user.total_xp.toLocaleString()}</span>
                  <span className="xp-label">XP</span>
                </td>
                <td className="streak-cell">
                  <span className="streak-icon">🔥</span>
                  <span className="streak-value">{user.daily_streak} days</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
