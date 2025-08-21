import React, { useState, useEffect } from "react";
import { Navbar } from "../components/navbar";
import "../style/home.css"

const Homepage = () =>{
    return(
        <>
        <div className="app-container">
                <Navbar />
                <div className="hero-section">
   <div className="header">
        
             <h2> 
                <span>Discover Nepal's </span>
                <br />
                <span style={{color:"yellow"}}>Rich Culture </span>
                </h2>
             <p className="hero-desc"> Learn Nepali words
                 </p>
             <div className="hero-buttons">
             <button className="start-button">  <i className="fa-solid fa-chevron-left"></i>Start Learning
              </button>
             <button className="learn-more"> Learn More</button>
             </div>

   </div>
        </div>
        <div className="stats-section">
    <div className="stats-grid">
        <div className="stat-card">
   <div className="stat-icon">📚</div>
         <p className="stat-number"> 1</p>
         <p className="stat-label"> Total Words</p>
        </div>
        
    <div className="stat-card">
            <div className="stat-icon">🌐</div>
         <p className="stat-number"> 1</p>
         <p className="stat-label"> Categories</p>
    </div>
    <div className="stat-card">
       <div className="stat-icon">❤️</div>
         <p className="stat-number"> 1</p>
         <p className="stat-label"> Your Favourites</p>
    </div>
    <div className="stat-card">
        <div className="stat-icon">👥</div>
         <p className="stat-number"> 1</p>
         <p className="stat-label"> Learners</p>
    </div>
        </div>
        </div>    
         </div>
        <div className="footer">
            <h2 > Explore Categories</h2>
        <p className="card-desc">
            Discover different aspects of Nepal culture through organized learning categories
        </p>
        </div>
            
    
        </>
    )

}


export default Homepage

 
