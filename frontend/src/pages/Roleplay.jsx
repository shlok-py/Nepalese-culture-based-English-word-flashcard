// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../style/quiz.css"; // Assuming this file is already set up

// const API_BASE = "https://walrus-concise-nationally.ngrok-free.app";
// const POST_URL = `${API_BASE}/api/quiz/generate_understand_quiz`; // Your POST endpoint for quiz generation

// // Helper function to normalize the response from server
// const normalizeFromServer = (q) => {
//   // Handling the options, ensuring they are well-structured
//   const options = [
//     q["1"] ?? q.option_1,
//     q["2"] ?? q.option_2,
//     q["3"] ?? q.option_3,
//     q["4"] ?? q.option_4,
//   ].filter((x) => typeof x === "string" && x.length > 0);

//   // Handling the right_answer field which could be text or index
//   let right = q.right_answer;
//   const asIndex = Number(right);
//   if (Number.isInteger(asIndex) && asIndex >= 1 && asIndex <= 4) {
//     right = options[asIndex - 1];
//   }

//   return {
//     question: q.question ?? "",
//     options,
//     correctAnswer: right ?? "",
//     category: q.category ?? "",
//   };
// };

// const RolePlay = () => {
//   const [currentQuestion, setCurrentQuestion] = useState(null);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [showResult, setShowResult] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate(); // Used to navigate to other pages

//   const [questionNumber, setQuestionNumber] = useState(1); // Track question number for progress

//   // Function to send the POST request for getting the next question
//   const postForQuestion = async (payload) => {
//     const res = await fetch(POST_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });
//     if (!res.ok) throw new Error(`HTTP ${res.status}`);
//     const data = await res.json();
//     return normalizeFromServer(data); // Normalize and return the question object
//   };

//   useEffect(() => {
//     const loadQuestion = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         // Send the initial request with empty fields for quiz generation
//         const nextQ = await postForQuestion({
//           prev_question: "",
//           is_correct: false,
//           right_answer: "",
//           given_answer: "",
//           category: "",
//         });
//         setCurrentQuestion(nextQ);
//         setSelectedAnswer(null);
//         setShowResult(false);
//       } catch (e) {
//         setError("Couldn't load quiz. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadQuestion();
//   }, []);

//   // Handle when an answer is clicked
//   const handleAnswerClick = (answer) => {
//     if (!currentQuestion || showResult) return;
//     setSelectedAnswer(answer);
//     setShowResult(true); // Show result after answering
//   };

//   // Handle the navigation to the next question
//   const handleNextQuestion = async () => {
//     if (!currentQuestion) return;

//     const is_correct = selectedAnswer === currentQuestion.correctAnswer;

//     // Send the current question data to the server to fetch the next question
//     setLoading(true);
//     setError("");
//     try {
//       const nextQ = await postForQuestion({
//         prev_question: currentQuestion.question || "",
//         is_correct,
//         right_answer: currentQuestion.correctAnswer || "",
//         given_answer: selectedAnswer || "",
//         category: currentQuestion.category || "",
//       });

//       setCurrentQuestion(nextQ);
//       setSelectedAnswer(null);
//       setShowResult(false);
//       setQuestionNumber(questionNumber + 1); // Update the question number for progress
//     } catch (e) {
//       setError("Couldn't fetch the next question. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Loading state, error handling, and rendering
//   if (loading && !currentQuestion) return <div className="loading">⏳ Loading quiz…</div>;
//   if (error && !currentQuestion) return <div className="loading">{error}</div>;
//   if (!currentQuestion) return <div className="loading">No question.</div>;

//   const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

//   // Progress bar calculation
//   const progressPercentage = Math.min(100, (questionNumber / 10) * 10) || 10; // Looping progress bar

//   return (
//     <div className="quiz-container">
//       <div className="quiz-wrapper">
//         {/* Header */}
//         <div className="quiz-header">
//           <button onClick={() => navigate("/landing")} className="close-button" aria-label="Close">
//             ×
//           </button>

//           <div className="header-content">
//             <div className="quiz-title">
//               <h2 className="title-text">🎯 Quick Quiz</h2>
//               <span className="question-counter">Question {questionNumber}</span>
//             </div>
//             <div className="progress-bar" aria-label="Progress">
//               <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
//             </div>
//             {error && <p className="filter-error">{error}</p>}
//           </div>
//         </div>

//         {/* Question */}
//         <div className="quiz-card">
//           <div className="question-header">
//             <div className="question-icon">🧠</div>
//             <h2 className="question-text">{currentQuestion.question}</h2>
//           </div>

//           {/* Options */}
//           <div className="options-container">
//             {currentQuestion.options.map((option, index) => {
//               let buttonClass = "option-button";
//               if (showResult) {
//                 if (option === currentQuestion.correctAnswer) {
//                   buttonClass += " correct";
//                 } else if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
//                   buttonClass += " incorrect";
//                 } else {
//                   buttonClass += " disabled";
//                 }
//               }

//               const label = String.fromCharCode(65 + index); // A/B/C/D
//               return (
//                 <button
//                   key={index}
//                   onClick={() => handleAnswerClick(option)}
//                   className={buttonClass}
//                   disabled={showResult}
//                 >
//                   <span className="option-badge">{label}</span>
//                   <span className="option-text">{option}</span>
//                 </button>
//               );
//             })}

//             {/* Show result */}
//             {showResult && (
//               <div className={`result-container ${isCorrect ? "correct" : "incorrect"}`}>
//                 <div className="result-content">
//                   <div className="result-icon">{isCorrect ? "🌟" : "🤔"}</div>
//                   <div className="result-text">
//                     <p className={`result-status ${isCorrect ? "correct" : "incorrect"}`}>
//                       {isCorrect ? "Great job!" : "Nice try!"}
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={handleNextQuestion}
//                   className="next-button"
//                   disabled={loading}
//                   aria-busy={loading ? "true" : "false"}
//                 >
//                   <span>{loading ? "Loading…" : "Next question"}</span>
//                   <span>→</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Restart button */}
//         {!showResult && questionNumber >= 5 && (
//           <div style={{ marginTop: 12, textAlign: "center" }}>
//             <button onClick={() => window.location.reload()} className="next-button soft">
//               Restart
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RolePlay;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/roleplay.css"; // Assuming this file is already set up

const API_BASE = "https://walrus-concise-nationally.ngrok-free.app";
const POST_URL = `${API_BASE}/api/quiz/generate_understand_quiz`; // Your POST endpoint for quiz generation

// Helper function to normalize the response from server
const normalizeFromServer = (q) => {
  // Handling the options, ensuring they are well-structured
  const options = [
    q["1"] ?? q.option_1,
    q["2"] ?? q.option_2,
    q["3"] ?? q.option_3,
    q["4"] ?? q.option_4,
  ].filter((x) => typeof x === "string" && x.length > 0);

  // Handling the right_answer field which could be text or index
  let right = q.right_answer;
  const asIndex = Number(right);
  if (Number.isInteger(asIndex) && asIndex >= 1 && asIndex <= 4) {
    right = options[asIndex - 1];
  }

  return {
    context: q.context ?? "",
    question: q.question ?? "",
    options,
    correctAnswer: right ?? "",
    category: q.category ?? "",
  };
};

const RolePlay = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Used to navigate to other pages

  const [questionNumber, setQuestionNumber] = useState(1); // Track question number for progress

  // Function to send the POST request for getting the next question
  const postForQuestion = async (payload) => {
    const res = await fetch(POST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return normalizeFromServer(data); // Normalize and return the question object
  };

  useEffect(() => {
    const loadQuestion = async () => {
      setLoading(true);
      setError("");
      try {
        // Send the initial request with empty fields for quiz generation
        const nextQ = await postForQuestion({
          prev_question: "",
          is_correct: false,
          right_answer: "",
          given_answer: "",
          category: "",
        });
        setCurrentQuestion(nextQ);
        setSelectedAnswer(null);
        setShowResult(false);
      } catch (e) {
        setError("Couldn't load quiz. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadQuestion();
  }, []);

  // Handle when an answer is clicked
  const handleAnswerClick = (answer) => {
    if (!currentQuestion || showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true); // Show result after answering
  };

  // Handle the navigation to the next question
  const handleNextQuestion = async () => {
    if (!currentQuestion) return;

    const is_correct = selectedAnswer === currentQuestion.correctAnswer;

    // Send the current question data to the server to fetch the next question
    setLoading(true);
    setError("");
    try {
      const nextQ = await postForQuestion({
        prev_question: currentQuestion.question || "",
        is_correct,
        right_answer: currentQuestion.correctAnswer || "",
        given_answer: selectedAnswer || "",
        category: currentQuestion.category || "",
      });

      setCurrentQuestion(nextQ);
      setSelectedAnswer(null);
      setShowResult(false);
      setQuestionNumber(questionNumber + 1); // Update the question number for progress
    } catch (e) {
      setError("Couldn't fetch the next question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Loading state, error handling, and rendering
  if (loading && !currentQuestion) return <div className="loading">⏳ Loading quiz…</div>;
  if (error && !currentQuestion) return <div className="loading">{error}</div>;
  if (!currentQuestion) return <div className="loading">No question.</div>;

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  // Progress bar calculation
  const progressPercentage = Math.min(100, (questionNumber / 10) * 10) || 10; // Looping progress bar

  return (
    <div className="quiz-container">
      <div className="quiz-wrapper">
        {/* Header */}
        <div className="quiz-header">
          <button onClick={() => navigate("/landing")} className="close-button" aria-label="Close">
            ×
          </button>

          <div className="header-content">
            <div className="quiz-title">
              <h2 className="title-text">🎯 Quick Quiz</h2>
              <span className="question-counter">Question {questionNumber}</span>
            </div>
            <div className="progress-bar" aria-label="Progress">
              <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
            </div>
            {error && <p className="filter-error">{error}</p>}
          </div>
        </div>

        {/* Context and Question */}
        <div className="quiz-card">
          <div className="question-header">
            <div className="question-icon">🧠</div>
            <p className="context-text">{currentQuestion.context}</p> {/* Display context */}
            <h2 className="question-text">{currentQuestion.question}</h2>
          </div>

          {/* Options */}
          <div className="options-container">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = "option-button";
              if (showResult) {
                if (option === currentQuestion.correctAnswer) {
                  buttonClass += " correct";
                } else if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
                  buttonClass += " incorrect";
                } else {
                  buttonClass += " disabled";
                }
              }

              const label = String.fromCharCode(65 + index); // A/B/C/D
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(option)}
                  className={buttonClass}
                  disabled={showResult}
                >
                  <span className="option-badge">{label}</span>
                  <span className="option-text">{option}</span>
                </button>
              );
            })}

            {/* Show result */}
            {showResult && (
              <div className={`result-container ${isCorrect ? "correct" : "incorrect"}`}>
                <div className="result-content">
                  <div className="result-icon">{isCorrect ? "🌟" : "🤔"}</div>
                  <div className="result-text">
                    <p className={`result-status ${isCorrect ? "correct" : "incorrect"}`}>
                      {isCorrect ? "Great job!" : "Nice try!"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleNextQuestion}
                  className="next-button"
                  disabled={loading}
                  aria-busy={loading ? "true" : "false"}
                >
                  <span>{loading ? "Loading…" : "Next question"}</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Restart button */}
        {!showResult && questionNumber >= 5 && (
          <div style={{ marginTop: 12, textAlign: "center" }}>
            <button onClick={() => window.location.reload()} className="next-button soft">
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RolePlay;