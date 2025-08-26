// import React, { useEffect, useState } from "react";


// const Quiz =  () => {

//       const [card,setCard] = useState("")
//          const [currentCard, setCurrentCard] = useState(1);
//       const totalCards = 50;
//         const [cards, SetCards] = useState([])
    
//         const fetchCards = async () => {
//         try {
//           const response = await api.get('/api/cards/');
//           SetCards(response.data.cards);
//         } catch (error) {
//           console.error("Error fetching Card", error);
//         }
//       };
//        useEffect(() => {
//         fetchCards();
//       }, []);
    
//       const favcounter = (card) => {
//     favcard++;
//       }

// const [currentquestion, setCurrentQuestion] = useState(0);
// const [ selectedanswer,SetSelectedAnswer] = useState(null);
// const [showResult , setShowResult] = useState(false);
// const [questions, setQuestions] = useState([])

// useEffect(() =>{
//     setQuestions(quizdata)
// }, [])

// const handleAnswerClick  = (answer) =>{
//     if(showResult) return;


//     SetSelectedAnswer(answer);
//     setShowResult(true);
// }
// const handleNextQuestion = () => {
//     if (currentQuestion < questions.length - 1) {
//       setCurrentQuestion(currentQuestion + 1);
//       setSelectedAnswer(null);
//       setShowResult(false);
//     }
//   };

//   const handlePreviousQuestion = () => {
//     if (currentQuestion > 0) {
//       setCurrentQuestion(currentQuestion - 1);
//       setSelectedAnswer(null);
//       setShowResult(false);
//     }
//   };

//   if (questions.length === 0) {
//     return <div className="loading">Loading...</div>;
//   }

//   const current = questions[currentQuestion];
//   const isCorrect = selectedAnswer === current.correctAnswer;
//   const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;



//     return (
// <>
// <div className="quiz-container">
//     <div className="quiz-wrapper">
// <div className="quiz-header">
// <button 
// onClick={handlePreviousQuestion}
// disabled = {currentquestion ===0}
// className="back-button">
// ←
// </button>
// <div className="header-content">
//     <div className="quiz-title">
//          <h2 className="title-text">Quick Quiz</h2>
//          <span className="question-counter">
//      Question {currentQuestion + 1} of {questions.length}
//          </span>
//     </div>
//     <p className="subtitle"> Test What you've learned</p>
//     <div className="progress-bar">
//         <div className="progress-fill" style={{width: `${progressPercentage}%`}}>
//         </div>
//     </div>
// </div>
//     </div>
//     <div className="quiz-card">
//         <div className="question-header">
//             <div className="question-icon"></div>
//                      <h2 className="question-text">{current.question}</h2>
//         </div>
//         div.
//     </div>
// </div>
// <div className="quiz-box">
// <div className="options-container">
//     {current.options.map((options) => {
//         let buttonclass = "option-button";

//         if(showResult) {
//             buttonclass +="correct";
//         } else if (options== selectedanswer && option !== current.correctAnswer){
//             buttonclass += "incorrect";
//         } else{
//             buttonclass +="disabled"
//         }
// return (
//     <button key = {index}
//     onClick = {() =>  handleAnswerClick(option) }
//     className = {buttonclass}
//     disabled  = {showResult} >
//         {option}
//     </button>
// );

//     })}

//    {/* Result Section */}
//               {showResult && (
//                 <div className={`result-container ${isCorrect ? 'correct' : 'incorrect'}`}>
//                   <div className="result-content">
//                     <div className="result-icon">
//                       {isCorrect ? '✅' : '❌'}
//                     </div>
//                     <div className="result-text">
//                       <p className={`result-status ${isCorrect ? 'correct' : 'incorrect'}`}>
//                         {isCorrect ? 'Correct!' : 'Incorrect!'}
//                       </p>
//                       <div className="result-explanation">
//                         {current.explanation}
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Next Button */}
//                   {currentQuestion < questions.length - 1 ? (
//                     <button
//                       onClick={handleNextQuestion}
//                       className="next-button"
//                     >
//                       <span>Next question</span>
//                       <span>→</span>
//                     </button>
//                   ) : (
//                     <div className="complete-message">
//                       🎉 Quiz Complete! Great job!
//                     </div>
//                   )}
//                 </div>
//               )}
// </div>
// </div>
// </>


//     )
// }


// export default Quiz

import React, { useEffect, useState } from "react";
import "../style/quiz.css"
const quizdata = [
  {
    id: 1,
    question: 'What is a "School" in Nepali?',
    options: ['लुगा', 'टेबल', 'विद्यालय', 'पुस्तक'],
    correctAnswer: 'विद्यालय',
    explanation: 'School = विद्यालय\nEducation is highly valued in Nepali culture'
  },
  {
    id: 2,
    question: 'What is "Book" in Nepali?',
    options: ['कलम', 'पुस्तक', 'कागज', 'मेज'],
    correctAnswer: 'पुस्तक',
    explanation: 'Book = पुस्तक\nBooks are considered sacred in Nepali culture'
  },
  {
    id: 3,
    question: 'What is "Water" in Nepali?',
    options: ['दूध', 'चिया', 'पानी', 'रस'],
    correctAnswer: 'पानी',
    explanation: 'Water = पानी\nWater is essential and sacred in Nepali traditions'
  },
  {
    id: 4,
    question: 'What is "House" in Nepali?',
    options: ['घर', 'ढोका', 'झ्याल', 'छत'],
    correctAnswer: 'घर',
    explanation: 'House = घर\nHome is the center of Nepali family life'
  },
  {
    id: 5,
    question: 'What is "Friend" in Nepali?',
    options: ['शत्रु', 'साथी', 'अपरिचित', 'छिमेकी'],
    correctAnswer: 'साथी',
    explanation: 'Friend = साथी\nFriendship is highly valued in Nepali society'
  }
];

const Quiz = () => {
  // Fixed variable names and consistency
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    setQuestions(quizdata);
  }, []);

  const handleAnswerClick = (answer) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  if (questions.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  const current = questions[currentQuestion];
  const isCorrect = selectedAnswer === current.correctAnswer;
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <>

      <div className="quiz-container">
        <div className="quiz-wrapper">
          <div className="quiz-header">
            <button 
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="back-button"
            >
              ←
            </button>
            <div className="header-content">
              <div className="quiz-title">
                <h2 className="title-text">🎯 Quick Quiz</h2>
                <span className="question-counter">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
              </div>
              <p className="subtitle">Test What you've learned</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${progressPercentage}%`}}>
                </div>
              </div>
            </div>
          </div>

          <div className="quiz-card">
            <div className="question-header">
              <div className="question-icon">🏫</div>
              <h2 className="question-text">{current.question}</h2>
            </div>

            <div className="options-container">
              {current.options.map((option, index) => {
                let buttonClass = "option-button";
                
                if (showResult) {
                  if (option === current.correctAnswer) {
                    buttonClass += " correct";
                  } else if (option === selectedAnswer && option !== current.correctAnswer) {
                    buttonClass += " incorrect";
                  } else {
                    buttonClass += " disabled";
                  }
                }

                return (
                  <button 
                    key={index}
                    onClick={() => handleAnswerClick(option)}
                    className={buttonClass}
                    disabled={showResult}
                  >
                    {option}
                  </button>
                );
              })}

              {/* Result Section */}
              {showResult && (
                <div className={`result-container ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="result-content">
                    <div className="result-icon">
                      {isCorrect ? '✅' : '❌'}
                    </div>
                    <div className="result-text">
                      <p className={`result-status ${isCorrect ? 'correct' : 'incorrect'}`}>
                        {isCorrect ? 'Correct!' : 'Incorrect!'}
                      </p>
                      <div className="result-explanation">
                        {current.explanation}
                      </div>
                    </div>
                  </div>
                  
                  {/* Next Button */}
                  {currentQuestion < questions.length - 1 ? (
                    <button
                      onClick={handleNextQuestion}
                      className="next-button"
                    >
                      <span>Next question</span>
                      <span>→</span>
                    </button>
                  ) : (
                    <div className="complete-message">
                      🎉 Quiz Complete! Great job!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Quiz;
