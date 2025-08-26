import React, { useState,useEffect } from "react"
import Menu from "../components/menu"
import "../style/landing.css"

const mockusers  = [
  {name:"Puja", points:920, trends:"+50", status: "online"},
  {name:"Shlok", points: 1000,trends:"+80", status: "online"},
  {name:"Dikshya", points:880,trends:"+40", status: "away"},
  {name:"Akriti", points:800,trends:"+35", status: "offline"},
  {name:"Hemant", points:920,trends:"+60", status: "online"}
]
 const achievements = [
    {label: "Streak master", unlocked : true},
    {label: "Topn Performer", unlocked: true}
  ]
const Landing = () => {

  const [currentStreak, setCurrentstreak] = useState(0);
  const [profileProgress, setProfileProgress] = useState(25);
  const [animateProgress, setAnimateProgress] = useState(false);
  const [hoveredUser, setHoveruser] = useState(null);

 useEffect(() =>{
  setTimeout(() => setAnimateProgress(true), 500);
  const streakTimer = setTimeout(() => setCurrentstreak(7), 1000);
  return () => clearTimeout(streakTimer);
 }, []);

    return (
   <>
   
<div className="app-container">
   <div className="main-container">
    <div className="menu-container">
    <Menu />
    </div>

    <div className="profile-card">
      <div className="profile-gradient-bar"></div>
      <div className="profile-content">
<div className="profile-left">
  <div className="avatar-container">
  <div className="avatar">P</div>
  <div className="status-indicator online"></div>
  </div>

  <div className="profile-info">
    <h2 className="welcome">Hey, Pu!</h2>
    <div className="progress-info">
      <span>Profile</span>
    <div className="progress-wrapper">
  <div className="progress-bar">
        <div className={`progress-fill ${animateProgress ? 'animate':"" }`}>
        </div>
      </div>
      <span className="progress-text"> ${profileProgress}% complete</span>
    </div>
    </div>
  </div>
    </div>
<div className="profile-right">
  <div className="stat-card streak">
    <div className="stat-icon">🔥</div>
    <p className="label">Daily Streak </p>
    <p className="value">{currentStreak} days</p>
  </div>
<div className="stat-card xp">
<div className="stat-icon">⭐️</div>
<div className="label">Total Xp</div>
<div className="value">1,240</div>
</div>
  </div>
</div>

<div className="achievements-section">
<h3 className="achievements-title"> Recent Achievements</h3>
<div className="achievements-list">
  {achievements.map((achievement, index) =>(
   <div key = {index} className="achievement-badge" >
<span className="achievement-icon">🏆</span>
<span>{achievement.label}</span>
</div>
  ))}
</div>
</div>
</div>

<div className="content-grid">
<div className="leaderboard-card" role="region" aria-label="Leaderboard">
<div className="card-header">
  <div className="header-info">
    <h3 className="lb-title">🏆 Leaderboard</h3>
    <p className="lb-subtitle">Top lkearners this week</p>
  </div>
    <button className="view-all-btn">View All</button>
    </div>

    <div className="leaderboard-content">
  <ul className="leaderboard-list">
    {mockusers.map((user,index) =>(
  <li key = {user.name} 
  className={`leaderboard-item ${hoveredUser === index ? 'hovered':''}`}
  onMouseEnter={() => setHoveruser(index)}
  onMouseLeave={() => setHoveruser(null)}
  >
        <div className={`rank rank-${index+1}`}> #{index+1}</div>
        <div className="user-info">
          <div className="user-avatar-container">
 <div className="user-avatar">  {user.name[0]}</div>
 </div>
            <div className="user-details">
              <div className="user-name">{user.name}</div>
              <div className="user-trend">{user.trends} this week</div>
            </div>
          </div>
          <div className="points-info">
          <div className="points">{user.points.toLocaleString()} </div>
           <div className="points-label">XP</div>
          </div>
      </li>
    ))}
  </ul>
     </div>
</div>
<div className="sidebar">
  <div className="stats-card">
    <h3 className="stats-title"> 🗓️ This week</h3>
    <div className="stats-list">
      <div className="stat-row">
        <span>Lesson Completed</span>
        <span className="stat-value">12</span>
        </div>
        <div className="stat-row">
        <span>Study Time</span>
        <span className="stat-value"> 4.2h</span>
      </div>
      <div className="stat-row">
        <span>Quiz Average</span>
        <span className="stat-value success">92</span>
      </div>
    </div>
    <div className="goal-section">
      <div className="goal-header">
        <span>Weekly goal</span>
        <span className="goal-percentage"> 80%</span>
      </div>
      <div className="goal-bar">
        <div className="goal-progress"></div>
      </div>
    </div>
  </div>
  <div className="actions-card">
    <h3 className="actions-title">Quick Actions</h3>
    <div className="actions-list">
      <button className="action-btn primary">Continue Learning</button>
            <button className="action-btn secondary">Take Quiz</button>
                  <button className="action-btn secondary">View Progress</button>
    </div>
  </div>
</div>
   </div>
   </div>
</div>
</>
    )
}


export default Landing


// import React from "react";
// import "../style/learn.css";
// import { useNavigate } from "react-router-dom";

// const Learn = () => {
//   const navigate = useNavigate();

//   const categories = [
//     {
//       icon: "🏠",
//       title: "Daily Life",
//       description: "Essential Words for everyday activities",
//       path: "/daily-life"
//     },
//     {
//       icon: "🍽️",
//       title: "Food & Drink",
//       description: "Traditional Nepali cuisines and beverages",
//       path: "/food-drink"
//     },
//     {
//       icon: "🎊",
//       title: "Festivals",
//       description: "Cultural celebrations and traditions",
//       path: "/festivals"
//     },
//     {
//       icon: "⛰️",
//       title: "Nature",
//       description: "Mountains, rivers and natural beauty",
//       path: "/nature"
//     },
//     {
//       icon: "🚌",
//       title: "Transport",
//       description: "Getting around in Nepal",
//       path: "/transport"
//     }
//   ];

//   const handleCategoryClick = (path) => {
//     // Navigate to the specific category learning page
//     navigate(path);
//   };

//   return (
//     <>
//       <div className="cat-header">
//         <h1 className="header-content">Choose a Category</h1>
//         <div className="header-desc">
//           Select a category to start Learning Nepali words with cultural context and examples
//         </div>
//       </div>
      
//       <div className="stats-section">
//         <div className="stats-grid">
//           {categories.map((category, index) => (
//             <div key={index} className="stat-card">
//               <div className="stat-icon">{category.icon}</div>
//               <div className="stat-title">{category.title}</div>
//               <p className="stat-label">{category.description}</p>
//               <button 
//                 className="start-button"
//                 onClick={() => handleCategoryClick(category.path)}
//                 aria-label={`Start learning ${category.title}`}
//               >
//                 <i className="fa-solid fa-chevron-right"></i>
//                 Start Learning
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Learn;