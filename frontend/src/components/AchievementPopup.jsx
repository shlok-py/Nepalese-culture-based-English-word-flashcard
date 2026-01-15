import React, { useEffect } from 'react';
import '../style/achievement.css';

// Simple confetti implementation without external dependency
const fireConfetti = () => {
  const colors = ['#8B5CF6', '#FFD700', '#FF69B4', '#00D9FF', '#FF6B6B'];
  const confettiContainer = document.createElement('div');
  confettiContainer.className = 'confetti-container';
  document.body.appendChild(confettiContainer);

  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = `${Math.random() * 2}s`;
    confetti.style.animationDuration = `${2 + Math.random() * 2}s`;
    confettiContainer.appendChild(confetti);
  }

  setTimeout(() => {
    confettiContainer.remove();
  }, 4000);
};

const AchievementPopup = ({ achievement, onClose }) => {
  useEffect(() => {
    // Fire confetti animation when popup appears
    fireConfetti();

    // Auto-close after 5 seconds
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!achievement) return null;

  return (
    <div className="achievement-overlay" onClick={onClose}>
      <div className="achievement-popup" onClick={(e) => e.stopPropagation()}>
        <div className="achievement-popup-header">
          <h2>🎉 Achievement Unlocked!</h2>
        </div>
        <div className="achievement-icon-large">
          {achievement.icon}
        </div>
        <h3 className="achievement-popup-name">{achievement.name}</h3>
        <p className="achievement-popup-description">{achievement.description}</p>
        <div className="achievement-xp-bonus">
          <span className="xp-label">Bonus XP</span>
          <span className="xp-amount">+{achievement.xp_bonus}</span>
        </div>
        <button className="achievement-close-btn" onClick={onClose}>
          Awesome! 🎊
        </button>
      </div>
    </div>
  );
};

export default AchievementPopup;
