import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/roleplay.css";
import apiService from "../services/api.js";
import MainNavbar, { Breadcrumbs } from "../components/MainNavbar.jsx";

// Normalize response from server
const normalizeFromServer = (q) => {
  const options = [
    q["1"] ?? q.option_1,
    q["2"] ?? q.option_2,
    q["3"] ?? q.option_3,
    q["4"] ?? q.option_4,
  ].filter((x) => typeof x === "string" && x.length > 0);

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

// Fallback roleplay scenarios when API is unavailable
const getFallbackScenarios = () => [
  {
    context: "You are at a traditional Nepali tea shop (chiya pasal) in Kathmandu. The shopkeeper greets you warmly.",
    question: "How would you politely greet the shopkeeper?",
    options: ["Just wave silently", "Say 'Namaste' with folded hands", "Say 'Hey there!'", "Ignore and sit down"],
    correctAnswer: "Say 'Namaste' with folded hands",
    category: "greetings"
  },
  {
    context: "You are invited to a Nepali home for dinner. The host offers you a second helping of dal bhat.",
    question: "What is the polite way to accept more food?",
    options: ["Grab the bowl yourself", "Say 'Dhanyabad' and accept graciously", "Refuse loudly", "Leave the table"],
    correctAnswer: "Say 'Dhanyabad' and accept graciously",
    category: "customs"
  },
  {
    context: "You are visiting Pashupatinath Temple during a festival. Many devotees are praying.",
    question: "What should you do before entering the temple premises?",
    options: ["Wear shoes inside", "Remove your shoes and cover your head", "Take photos with flash", "Speak loudly on phone"],
    correctAnswer: "Remove your shoes and cover your head",
    category: "temples"
  },
  {
    context: "It's Dashain festival and an elder is about to give you tika (blessing). You should receive it properly.",
    question: "How do you receive tika from elders during Dashain?",
    options: ["Stand with hands on hips", "Bow your head and receive with respect", "Turn your back", "Take a selfie first"],
    correctAnswer: "Bow your head and receive with respect",
    category: "festivals"
  },
  {
    context: "You are at Ason Bazaar trying to buy spices. The vendor shows you different varieties of masala.",
    question: "How do you politely ask about the price in Nepal?",
    options: ["Point and grunt", "Ask 'Kati ho?' (How much?)", "Just take it and walk away", "Shout the price you want"],
    correctAnswer: "Ask 'Kati ho?' (How much?)",
    category: "shopping"
  },
  {
    context: "You're at a Nepali wedding ceremony. The bride and groom are exchanging garlands (mala).",
    question: "What is this ceremony called?",
    options: ["Janti", "Mala badalne (garland exchange)", "Sindoor", "Barat"],
    correctAnswer: "Mala badalne (garland exchange)",
    category: "customs"
  }
];

const RolePlay = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [useOffline, setUseOffline] = useState(false);
  const [offlineIndex, setOfflineIndex] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const navigate = useNavigate();

  // Fetch question from API
  const postForQuestion = async (payload) => {
    const data = await apiService.generateUnderstandQuiz(payload);
    return normalizeFromServer(data);
  };

  // Load offline scenario
  const loadOfflineScenario = (index) => {
    const scenarios = getFallbackScenarios();
    const q = scenarios[index % scenarios.length];
    setCurrentQuestion(q);
    setSelectedAnswer(null);
    setShowResult(false);
    setLoading(false);
  };

  useEffect(() => {
    const loadQuestion = async () => {
      setLoading(true);
      setError("");
      try {
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
        setUseOffline(false);
      } catch (e) {
        console.warn("Roleplay API unavailable, using offline mode");
        setUseOffline(true);
        loadOfflineScenario(0);
        setError("Using offline roleplay mode");
      } finally {
        setLoading(false);
      }
    };

    loadQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswerClick = (answer) => {
    if (!currentQuestion || showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
  };

  const handleNextQuestion = async () => {
    if (!currentQuestion) return;

    const is_correct = selectedAnswer === currentQuestion.correctAnswer;

    if (useOffline) {
      const nextIndex = offlineIndex + 1;
      setOfflineIndex(nextIndex);
      setQuestionNumber(questionNumber + 1);
      loadOfflineScenario(nextIndex);
      return;
    }

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
      setQuestionNumber(questionNumber + 1);
    } catch (e) {
      setError("Switching to offline mode");
      setUseOffline(true);
      const nextIndex = offlineIndex + 1;
      setOfflineIndex(nextIndex);
      setQuestionNumber(questionNumber + 1);
      loadOfflineScenario(nextIndex);
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setOfflineIndex(0);
    setQuestionNumber(1);
    setSelectedAnswer(null);
    setShowResult(false);
    if (useOffline) {
      loadOfflineScenario(0);
    } else {
      window.location.reload();
    }
  };

  if (loading && !currentQuestion) return <div className="loading">⏳ Loading roleplay…</div>;
  if (error && !currentQuestion) return <div className="loading">{error}</div>;
  if (!currentQuestion) return <div className="loading">No scenario available.</div>;

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const progressPercentage = Math.min(100, (questionNumber / 10) * 10) || 10;

  return (
    <>
      <MainNavbar />
      <Breadcrumbs path={["Dashboard", "Roleplay"]} />
      <div className="quiz-container roleplay-container roleplay-with-navbar">
        <div className="quiz-wrapper">
          {/* Header */}
          <div className="quiz-header">
            <button 
              onClick={() => navigate("/dashboard")} 
              className="close-button" 
              aria-label="Close"
            >
              ×
            </button>

          <div className="header-content">
            <div className="quiz-title">
              <h2 className="title-text">🎭 Cultural Roleplay</h2>
              <span className="question-counter">Scenario {questionNumber}</span>
              {useOffline && <span className="offline-badge">📴 Offline</span>}
            </div>
            <p className="subtitle">Experience Nepali culture through scenarios</p>
            <div className="progress-bar" aria-label="Progress">
              <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
            </div>
            {error && <p className="filter-error">{error}</p>}
          </div>
        </div>

        {/* Scenario Card */}
        <div className="quiz-card roleplay-card">
          {/* Context/Scenario */}
          <div className="context-section">
            <div className="context-icon">📍</div>
            <p className="context-text">{currentQuestion.context}</p>
          </div>

          {/* Question */}
          <div className="question-header">
            <div className="question-icon">💭</div>
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

              const label = String.fromCharCode(65 + index);
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

            {/* Result */}
            {showResult && (
              <div className={`result-container ${isCorrect ? "correct" : "incorrect"}`}>
                <div className="result-content">
                  <div className="result-icon">{isCorrect ? "🎉" : "💡"}</div>
                  <div className="result-text">
                    <p className={`result-status ${isCorrect ? "correct" : "incorrect"}`}>
                      {isCorrect ? "Excellent cultural awareness!" : "Good try! Learn from this:"}
                    </p>
                    {!isCorrect && (
                      <p className="correct-answer-text">
                        The appropriate response: {currentQuestion.correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleNextQuestion}
                  className="next-button"
                  disabled={loading}
                  aria-busy={loading ? "true" : "false"}
                >
                  <span>{loading ? "Loading…" : "Next scenario"}</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Restart button */}
        {!showResult && questionNumber >= 3 && (
          <div style={{ marginTop: 12, textAlign: "center" }}>
            <button onClick={handleRestart} className="restart-button">
              🔄 Start Over
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default RolePlay;
