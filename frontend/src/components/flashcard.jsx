import React, { useState, useEffect } from "react";
import Dashain from "../assets/dashain.jpg"
import "../style/flashcard.css"
import HeartButton from "../components/heart";
const Flashcard = () =>{
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
        <div className="main-container">
            <div className="content-box">
  <div className="header">
                <div className="header-left">
                    <button className="back-button">
                        <i className="fa-solid fa-left-long"></i>
                    </button>
                    <div className="header-text">
  <h2> Festivals & traditions</h2>
  <p className="card-counter"> All cards: {currentCard}/{totalCards} </p>
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
