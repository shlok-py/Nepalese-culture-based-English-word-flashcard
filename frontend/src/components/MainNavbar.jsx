import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "../style/main-navbar.css";

const MainNavbar = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      // Save any pending progress
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("http://localhost:8000/api/users/me/save-progress", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (err) {
      console.debug("Progress save failed, continuing with logout");
    }
    
    // Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Redirect to login
    navigate("/login");
  };

  return (
    <>
      <nav className="main-navbar" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
          <span className="brand-logo">🇳🇵</span>
          <span className="brand-text" style={{ color: '#ffffff' }}>Nepal Culture</span>
        </div>

        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          style={{ color: '#ffffff' }}
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>

        <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`} style={{ background: isMenuOpen ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent' }}>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            onClick={() => setIsMenuOpen(false)}
            style={({ isActive }) => ({ color: isActive ? '#FFD700' : '#ffffff' })}
          >
            🏠 Dashboard
          </NavLink>
          <NavLink 
            to="/flashcard" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            onClick={() => setIsMenuOpen(false)}
            style={({ isActive }) => ({ color: isActive ? '#FFD700' : '#ffffff' })}
          >
            📇 Flashcards
          </NavLink>
          <NavLink 
            to="/learn" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            onClick={() => setIsMenuOpen(false)}
            style={({ isActive }) => ({ color: isActive ? '#FFD700' : '#ffffff' })}
          >
            📚 Learn
          </NavLink>
          <NavLink 
            to="/quiz" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            onClick={() => setIsMenuOpen(false)}
            style={({ isActive }) => ({ color: isActive ? '#FFD700' : '#ffffff' })}
          >
            ❓ Quiz
          </NavLink>
          <NavLink 
            to="/roleplay" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            onClick={() => setIsMenuOpen(false)}
            style={({ isActive }) => ({ color: isActive ? '#FFD700' : '#ffffff' })}
          >
            🎭 Roleplay
          </NavLink>
          <button className="logout-btn" onClick={handleLogoutClick} style={{ color: '#ffffff', background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)' }}>
            🚪 Logout
          </button>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Are you sure you want to logout?</h3>
            <p>Your progress has been saved automatically.</p>
            <div className="modal-buttons">
              <button className="btn-confirm" onClick={confirmLogout}>
                💾 Save & Logout
              </button>
              <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Breadcrumbs component
export const Breadcrumbs = ({ path }) => {
  const pathMap = {
    "Dashboard": "/dashboard",
    "Learn": "/learn",
    "Quiz": "/quiz",
    "Roleplay": "/roleplay",
    "Flashcards": "/flashcard",
    "Leaderboard": "/leaderboard",
  };

  return (
    <div className="breadcrumbs">
      {path.map((item, index) => (
        <span key={index}>
          {index > 0 && <span className="separator"> › </span>}
          {index < path.length - 1 ? (
            <Link to={pathMap[item] || `/${item.toLowerCase()}`} className="breadcrumb-link">
              {item}
            </Link>
          ) : (
            <span className="breadcrumb-current">{item}</span>
          )}
        </span>
      ))}
    </div>
  );
};

export default MainNavbar;
