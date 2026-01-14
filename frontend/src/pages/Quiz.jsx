import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/quiz.css";
import apiService from "../services/api.js";

// Normalize quiz response from server
const normalizeFromServer = (q, idx = 0) => {
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
    id: q.id ?? idx + 1,
    question: q.question ?? "",
    options,
    correctAnswer: right ?? "",
    category: q.category ?? "",
  };
};

// Fallback quiz questions when API is unavailable
const getFallbackQuestions = () => [
  {
    id: 1,
    question: "What is 'Namaste' in Nepali culture?",
    options: ["A food dish", "A traditional greeting", "A festival", "A dance form"],
    correctAnswer: "A traditional greeting",
    category: "greetings"
  },
  {
    id: 2,
    question: "Which festival is the biggest in Nepal?",
    options: ["Tihar", "Holi", "Dashain", "Christmas"],
    correctAnswer: "Dashain",
    category: "festivals"
  },
  {
    id: 3,
    question: "What are 'Momos'?",
    options: ["Traditional dumplings", "A type of bread", "Sweet dessert", "Spicy curry"],
    correctAnswer: "Traditional dumplings",
    category: "food"
  },
  {
    id: 4,
    question: "What is a 'Topi'?",
    options: ["A shoe", "Traditional Nepali cap", "A musical instrument", "A cooking pot"],
    correctAnswer: "Traditional Nepali cap",
    category: "clothing"
  },
  {
    id: 5,
    question: "What does 'Dhanyabad' mean?",
    options: ["Hello", "Goodbye", "Thank you", "Sorry"],
    correctAnswer: "Thank you",
    category: "greetings"
  }
];

const Quiz = () => {
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [useOffline, setUseOffline] = useState(false);
  const [offlineIndex, setOfflineIndex] = useState(0);
  const navigate = useNavigate();

  const questionNumber = history.length + (current ? 1 : 0);

  // Fetch question from API
  const postForQuestion = async (payload) => {
    const data = await apiService.generateQuiz(payload);
    return normalizeFromServer(data, questionNumber);
  };

  // Load offline question
  const loadOfflineQuestion = (index) => {
    const questions = getFallbackQuestions();
    const q = questions[index % questions.length];
    setCurrent(q);
    setSelectedAnswer(null);
    setShowResult(false);
    setLoading(false);
  };

  // Initial load
  useEffect(() => {
    const init = async () => {
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
        setCurrent(nextQ);
        setSelectedAnswer(null);
        setShowResult(false);
        setUseOffline(false);
      } catch (e) {
        console.warn("Quiz API unavailable, using offline mode");
        setUseOffline(true);
        loadOfflineQuestion(0);
        setError("Using offline quiz mode");
      } finally {
        setLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswerClick = (answer) => {
    if (!current || showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
  };

  const handleNextQuestion = async () => {
    if (!current) return;

    const is_correct = selectedAnswer === current.correctAnswer;
    setHistory((h) => [...h, { ...current, selectedAnswer, is_correct }]);

    if (useOffline) {
      const nextIndex = offlineIndex + 1;
      setOfflineIndex(nextIndex);
      loadOfflineQuestion(nextIndex);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const nextQ = await postForQuestion({
        prev_question: current.question || "",
        is_correct,
        right_answer: current.correctAnswer || "",
        given_answer: selectedAnswer || "",
        category: current.category || "",
      });

      setCurrent(nextQ);
      setSelectedAnswer(null);
      setShowResult(false);
    } catch (e) {
      setError("Couldn't fetch the next question. Switching to offline mode.");
      setUseOffline(true);
      const nextIndex = offlineIndex + 1;
      setOfflineIndex(nextIndex);
      loadOfflineQuestion(nextIndex);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setCurrent(prev);
    setSelectedAnswer(prev.selectedAnswer ?? null);
    setShowResult(!!prev.selectedAnswer);
  };

  const handleRestart = async () => {
    setHistory([]);
    setSelectedAnswer(null);
    setShowResult(false);
    setOfflineIndex(0);
    setLoading(true);
    setError("");
    
    if (useOffline) {
      loadOfflineQuestion(0);
      return;
    }

    try {
      const nextQ = await postForQuestion({
        prev_question: "",
        is_correct: false,
        right_answer: "",
        given_answer: "",
        category: "",
      });
      setCurrent(nextQ);
    } catch (e) {
      setUseOffline(true);
      loadOfflineQuestion(0);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !current) return <div className="loading">⏳ Loading quiz…</div>;
  if (error && !current) return <div className="loading">{error}</div>;
  if (!current) return <div className="loading">No question available.</div>;

  const isCorrect = selectedAnswer === current.correctAnswer;
  const progressPercentage = Math.min(100, (questionNumber % 10) * 10) || 10;

  return (
    <div className="quiz-container">
      <div className="quiz-wrapper">
        {/* Header */}
        <div className="quiz-header">
          <button
            onClick={handlePreviousQuestion}
            disabled={!history.length}
            className="back-button"
            aria-label="Previous question"
            title="Previous"
          >
            ←
          </button>

          <div className="header-content">
            <div className="quiz-title">
              <h2 className="title-text">🎯 Quick Quiz</h2>
              <span className="question-counter">Question {questionNumber}</span>
              {useOffline && <span className="offline-badge">📴 Offline</span>}
            </div>
            <p className="subtitle">Test what you've learned</p>
            <div className="progress-bar" aria-label="Progress">
              <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
            </div>
            {error && <p className="filter-error">{error}</p>}
          </div>

          <button
            type="button"
            className="close-button"
            onClick={() => navigate("/landing")}
            aria-label="Close"
            title="Close"
          >
            ×
          </button>
        </div>

        {/* Question Card */}
        <div className="quiz-card">
          <div className="question-header">
            <div className="question-icon">🧠</div>
            <h2 className="question-text">{current.question}</h2>
          </div>

          {/* Options */}
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
                  <div className="result-icon">{isCorrect ? "🌟" : "🤔"}</div>
                  <div className="result-text">
                    <p className={`result-status ${isCorrect ? "correct" : "incorrect"}`}>
                      {isCorrect ? "Great job!" : "Nice try!"}
                    </p>
                    {!isCorrect && (
                      <p className="correct-answer-text">
                        Correct answer: {current.correctAnswer}
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
                  <span>{loading ? "Loading…" : "Next question"}</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Restart button */}
        {!showResult && history.length >= 3 && (
          <div style={{ marginTop: 12, textAlign: "center" }}>
            <button onClick={handleRestart} className="restart-button">
              🔄 Restart Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
