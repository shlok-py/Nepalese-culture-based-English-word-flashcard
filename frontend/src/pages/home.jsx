import React from "react";
import "../style/home.css"
const Homepage = () =>{

    return(
        <>
        <div className="app-container">
          {/* <Navbar />       */}
    
                <div className="hero-section">
   <div className="header">
        
             <h2> 
                <span>Discover Nepal's </span>
                <br />
                <span style={{color:"yellow"}}>Rich Culture </span>
                </h2>
             <p className="hero-desc"> Learn Nepali words </p>
             <div className="hero-buttons">
             <button className="start-button">  <i className="fa-solid fa-chevron-right"></i>Start Learning
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

        </div>
        </div>    
         </div>
        <div className="footer">
            <h2 > Explore Categories</h2>
        <p className="card-desc">
            Discover different aspects of Nepal culture through organized learning categories
        </p>
        </div>
        {/* <div className="home-bottom">
            <h2> Why Learn with NepalLearn?</h2>
        </div> */}
        <div className="bottom-section">
             <h2> Why Learn with NepalLearn?</h2>
            <div className="bottom-grid">
                  <div className="bottom-card">
        <div className="bottom-icon interactive" > <i className="fa-regular fa-book-open"></i> </div>
         <p className="bottom-title"> Interactive Learning</p>
         <p className="bottom-label"> Learn through  flashcards with cultural context and real examples</p>
    </div>  
   <div className="bottom-card">
        <div className="bottom-icon favourites">     <i className="fa-regular fa-heart" ></i> </div>
         <p className="bottom-title"> Personal Favourites</p>
         <p className="bottom-label"> Save your favorite words and create your
personalized learning creation.</p>
    </div> 
                <div className="bottom-card">
        <div className="bottom-icon cultural"> <i className="fa-regular fa-star"></i>  </div>
         <p className="bottom-title"> Cultural insights</p>
         <p className="bottom-label">Understand the cultural significance behind each
word and phrase.</p>
    </div> 
            </div>
        </div>
            
    
        </>
    )

}


export default Homepage

 
