import React from "react";
import Navbar from "../components/navbar";
import "../style/home.css"
import { useNavigate } from "react-router-dom";

// const Homepage = () =>{
//       const handleStartLearning = () => {
//     console.log("Start Learning clicked");
//   };

//   const handleLearnMore = () => {
//     console.log("Learn More clicked");
//   };

// const handleSubmit = ((onNavigate) =>{
//       const goBack  = () =>{
// onNavigate('/login')
//     }
// })
//     return(
//         <>
//         <div className="app-container">
//             <div className="nav-container">
//    <Navbar />      
//             </div>
//                 <div className="hero-section">
//    <div className="header">
//              <h2> 
//                 <span>Discover Nepal's </span><br />
//                 <span style={{color:"yellow"}}>Rich Culture </span>
//                 </h2>
//              <p className="hero-desc"> Learn Nepali words through beautiful flashcards. </p>
//              <div className="hero-buttons">
//              <button className="start-button" onClick={handleSubmit}> 
//                  <i className="fa-solid fa-chevron-right"></i>Start Learning
//               </button>
//              <button className="learn-more"> Learn More</button>
//              </div>

//    </div>
//         </div>
//         <div className="stats-section">
//     <div className="stats-grid">
//         <div className="stat-card">
//    <div className="stat-icon">📚</div>
//          <p className="stat-number"> 1</p>
//          <p className="stat-label"> Total Words</p>
//         </div>
        
//     <div className="stat-card">
//             <div className="stat-icon">🌐</div>
//          <p className="stat-number"> 1</p>
//          <p className="stat-label"> Categories</p>
//     </div>
//     <div className="stat-card">
//        <div className="stat-icon">❤️</div>
//          <p className="stat-number"> 1</p>
//          <p className="stat-label"> Your Favourites</p>
//     </div>

//         </div>
//         </div>    
//         <div className="footer">
//             <h2 > Explore Categories</h2>
//         <p className="card-desc">
//             Discover different aspects of Nepal culture through organized learning categories
//         </p>
//         </div>
    
//         <div className="bottom-section">
//              <h2> Why Learn with NepalLearn?</h2>
//             <div className="bottom-grid">
//                   <div className="bottom-card">
//         <div className="bottom-icon interactive" > <i className="fa-regular fa-book-open"></i> </div>
//          <div className="bottom-title"> Interactive Learning</div>
//          <div className="bottom-label"> Learn through  flashcards with cultural context and real examples
//          </div>
//     </div>  
//    <div className="bottom-card">
//         <div className="bottom-icon favourites">     <i className="fa-regular fa-heart" ></i> </div>
//          <div className="bottom-title"> Personal Favourites</div>
//          <div className="bottom-label"> Save your favorite words and create your
// personalized learning creation.
// </div>
//     </div> 
//                 <div className="bottom-card">
//         <div className="bottom-icon cultural"> <i className="fa-regular fa-star"></i>  </div>
//          <div className="bottom-title"> Cultural insights</div>
//          <div className="bottom-label">Understand the cultural significance behind each
// word and phrase.
// </div>
//     </div> 
//             </div>
//         </div>
//             </div>
    
//         </>
//     )

// }


// export default Homepage

 
export default function HomePage() {
    const navigate = useNavigate()
    const handlestartlearning = () =>{
navigate('/login')
    }

  return (
    <>
      {/* HERO */}
      <div className="nav-container">
  <Navbar />
      </div>
    
      <section className="hero">
        <div className="hero-emojis" aria-hidden>
          🗻 🇳🇵 🕉️
        </div>
        <h1 className="hero-title">
          Discover Nepal’s <span>Rich Culture</span>
        </h1>
        <p className="hero-sub">
          Learn Nepali words through beautiful flashcards. Explore traditions,
          festivals, food, and daily life in the heart of the Himalayas.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={handlestartlearning}>
            Start Learning <i className="fa-solid fa-arrow-right"></i>
          </button>
          <button className="btn-ghost">Learn More</button>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <article className="stat">
          <div className="stat-emoji">📚</div>
          <div className="stat-num">100</div>
          <div className="stat-label">Total Words</div>
        </article>
        <article className="stat">
          <div className="stat-emoji">🌐</div>
          <div className="stat-num">5</div>
          <div className="stat-label">Categories</div>
        </article>
        <article className="stat">
          <div className="stat-emoji">💖</div>
          <div className="stat-num">2</div>
          <div className="stat-label">Your favorites</div>
        </article>
      </section>

      {/* EXPLORE */}
      <section className="explore">
        <h2>Explore Categories</h2>
        <p>
          Discover different aspects of Nepali culture through our organized
          learning categories.
        </p>
       
      </section>

      {/* WHY */}
      <section className="why">
        <h2>Why Learn with NepalLearn?</h2>
        <div className="why-grid">
          <article className="why-card">
            <div className="why-icon blue">📖</div>
            <h3>Interactive Learning</h3>
            <p>
              Learn through beautiful flashcards with cultural context and real
              examples.
            </p>
          </article>
          <article className="why-card">
            <div className="why-icon green">💚</div>
            <h3>Personal Favorites</h3>
            <p>
              Save your favorite words and create your personalized learning
              creation.
            </p>
          </article>
          <article className="why-card">
            <div className="why-icon purple">⭐</div>
            <h3>Cultural Insights</h3>
            <p>
              Understand the cultural significance behind each word and phrase.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}