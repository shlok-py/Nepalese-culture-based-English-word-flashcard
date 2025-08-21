import React, { useState, useEffect } from "react";
import "../style/learn.css"
const Learn =() =>{
    return (
        <>

<div className="cat-header">
    <h1 className="header-content"> Choose a Category</h1>
    <div className="header-desc"> Select a category to start Learning Nepali words with cultural context and examples</div>
</div>

                <div className="stats-section">
<div className="stats-grid">
    <div className="stat-card">
    <div className="stat-icon">
            🏠
            </div>     <div className="stat-title">
            Daily Life
        </div>
        <p className="stat-label"> Essential Words for everyday activities</p>
        <button className="start-button">  <i className="fa-solid fa-chevron-right"></i>Start Learning
            </button>
    </div>
    
<div className="stat-card">
        <div className="stat-icon">🍽️ </div>     <div className="stat-title">
        Food & Drink
        </div>
        <p className="stat-label"> Traditional Nepali cuisines and Bevegares</p>
        <button className="start-button">  <i className="fa-solid fa-chevron-right"></i>Start Learning
            </button>
</div>
<div className="stat-card">
    <div className="stat-icon">🎊</div>
        <div className="stat-title">
        Festivals
        </div>
        <p className="stat-label">Cultural celebrations and traditions</p>
        <button className="start-button">  <i className="fa-solid fa-chevron-right"></i>Start Learning
            </button>
</div>
<div className="stat-card">
    <div className="stat-icon">⛰️</div>
            <div className="stat-title">
        Nature
        </div>
        <p className="stat-label"> Mountains,rivers and natural beauty</p>
        <button className="start-button">  <i className="fa-solid fa-chevron-right"></i>Start Learning
            </button>
</div>
    <div className="stat-card">
    <div className="stat-icon">🚌</div>
            <div className="stat-title">
    Transport
        </div>
        <p className="stat-label"> Getting around in Nepla</p>
        <button className="start-button">  <i className="fa-solid fa-chevron-right"></i>Start Learning
            </button>
</div>
    </div>
    </div> 


    </>
)
}

export default Learn