import React, { useState, useEffect } from "react";
import Dashain from "../assets/dashain.jpg"
import "../style/flashcard.css"
import HeartButton from "../components/heart";
import {useNavigate} from "react-router-dom"

const Flashcard = () =>{

// const navigate = useNavigate();


// const handleGoBack = () =>{
//   navigate(-1)
// };
    const [card,setCard] = useState("")
     const [currentCard, setCurrentCard] = useState(1);
  const totalCards = 50;
    const [cards, SetCards] = useState([])

    const fetchCards = async () => {
    try {
      const response = await api.get('/api/cards/');
      SetCards(response.data.cards);
    } catch (error) {
      console.error("Error fetching Card", error);
    }
  };
   useEffect(() => {
    fetchCards();
  }, []);

  const favcounter = (card) => {
favcard++;
  }
    return (
        <>
  
            <div className="content-box">
  <div className="header">
                <div className="header-left">
                    <button className="back-button" 
                   >
                        <i className="fa-solid fa-left-long"></i>
                    </button>
                    <div className="header-text">
  <h2> Festivals & traditions</h2>
  <p className="card-counter"> All cards: {currentCard}/{totalCards} </p>
  <ProgressBar  current = {currentCard - 1} total = {totalCards}/>
                    </div>
                </div>
                <div className="favorites">
                    {/* <i className="fa-regular fa-heart"></i> */}
                    <HeartButton/>
                    <span> Favourites</span>
                </div>
            </div>
            <div className="card">
            <img className = "card-image" src={Dashain} alt="Dashian pic" />
            <h2 className="card-title"> Dashain </h2>
            <p className="card-text">ENGLISH</p>
                <p className="card-nep">दशैं </p>
                <p className="card-type">(dashain) </p>
                <p className="card-text">नेपाली </p>
                <p className="card-desc"> hkudawbgcguail</p>
        </div>

        <div className="navigation">
            <button className="nav-btn prev-btn" disabled= {currentCard ===1}>
                {/* <button className="nav-btn prev-btn" disabled= {currentCard ===1} onClick={handleGoBack}></button> */}
                <i className="fa-solid fa-chevron-left"></i>
           Previous 
           </button>
           <div className="page-footer">
            <span className="indicator active"></span>
           <span className="indicator"></span>
           <span className="indicator"></span>
           </div>
           <button className="nav-btn prev-btn" disabled= {currentCard ===totalCards}>
                <i className="fa-solid fa-chevron-right"></i>
           Next</button>
        </div>
            </div>
          

      

        </>
    )
}


export default Flashcard

    // <div className="card">
    //         <img className = "card-image" src={Dashain} alt="Dashian pic" />
    //         <h2 className="card-title"> Dashain </h2>
    //         <p className="card-text">English</p>
    //             <p className="card-text">दशैं </p>
    //     </div>


 const ProgressBar = ({ current, total }) => {
  const progressPercentage = total > 0 ? ((current + 1) / total) * 100 : 0;
  
  return (
    <div style={progressContainer}>
      <div style={progressTrack}>
        <div 
          style={{
            ...progressFill,
            width: `${progressPercentage}%`
          }}
        />
      </div>
    </div>
  );
};

const progressContainer = {
  width: '200%',
  marginTop: '5px'
};

const progressTrack = {
  width: '100%',
  backgroundColor: '#e5e7eb',
  borderRadius: '10px',
  height: '6px',
  overflow: 'hidden'
};

const progressFill = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  height: '100%',
  borderRadius: '10px',
  transition: 'width 0.3s ease'
};
