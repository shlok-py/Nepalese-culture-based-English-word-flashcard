import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ⬅️ add
import "../style/quiz.css";

const API_BASE = "http://127.0.0.1:2000";
const POST_URL = `${API_BASE}/api/quiz/generate`;

const normalizeFromServer = (q, idx = 0) => {
  // Accept aliases "1".."4" OR option_1..option_4
  const options = [
    q["1"] ?? q.option_1,
    q["2"] ?? q.option_2,
    q["3"] ?? q.option_3,
    q["4"] ?? q.option_4,
  ].filter((x) => typeof x === "string" && x.length > 0);

  // right_answer could be text or index "1".."4"
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
    // These fields aren't in your model, but if the API includes them we keep them
    category: q.category ?? "",
  };
};

const Quiz = () => {
  const [current, setCurrent] = useState(null);           // current question object
  const [history, setHistory] = useState([]);             // stack of previous questions
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();  

  const questionNumber = history.length + (current ? 1 : 0);

  // POST helper
  const postForQuestion = async (payload) => {
    const res = await fetch(POST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return normalizeFromServer(data, questionNumber); // normalize next question
  };

  // initial load -> POST with empty fields, is_correct false
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
      } catch (e) {
        setError("Couldn't load quiz. Please try again.");
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

    // push current into history so the "Previous" button works
    setHistory((h) => [...h, { ...current, selectedAnswer, is_correct }]);

    setLoading(true);
    setError("");
    try {
      const nextQ = await postForQuestion({
        prev_question: current.question || "",
        is_correct,
        right_answer: current.correctAnswer || "",
        given_answer: selectedAnswer || "",
        category: current.category || "", // may be empty if API didn't send it
      });

      setCurrent(nextQ);
      setSelectedAnswer(null);
      setShowResult(false);
    } catch (e) {
      setError("Couldn't fetch the next question. Please try again.");
      // If it fails, pop history back (so UI doesn't jump ahead)
      setHistory((h) => h.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (!history.length) return;
    // move one step back locally (no API call)
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
    } catch (e) {
      setError("Couldn't restart quiz.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !current) return <div className="loading">⏳ Loading quiz…</div>;
  if (error && !current) return <div className="loading">{error}</div>;
  if (!current) return <div className="loading">No question.</div>;

  const isCorrect = selectedAnswer === current.correctAnswer;

  // We don't know total questions; show only the current index
  const progressPercentage = Math.min(100, (questionNumber % 10) * 10) || 10; // a fun looping bar

  return (
    <>
      <div className="quiz-container">
        <div className="quiz-wrapper">
        
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
              </div>
              <p className="subtitle">Test what you’ve learned</p>
              <div className="progress-bar" aria-label="Progress">
                <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
              </div>

              {error ? (
                <p className="filter-error" style={{ marginTop: 8 }}>{error}</p>
              ) : null}
            </div>
             {/* NEW: X button pinned to header’s top-right */}
  <button
    type="button"
    className="close-button"
    onClick={() => navigate("/landing")}
    aria-label="Close and go to landing"
    title="Close"
  >
    ×
  </button>
          </div>

          <div className="quiz-card">
            <div className="question-header">
              <div className="question-icon">🧠</div>
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

              {showResult && (
                <div className={`result-container ${isCorrect ? "correct" : "incorrect"}`}>
                  <div className="result-content">
                    <div className="result-icon">{isCorrect ? "🌟" : "🤔"}</div>
                    <div className="result-text">
                      <p className={`result-status ${isCorrect ? "correct" : "incorrect"}`}>
                        {isCorrect ? "Great job!" : "Nice try!"}
                      </p>
                      {/* No explanation in model; if backend later adds it, you can render it here */}
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

          {/* Restart button at bottom (optional) */}
          {!showResult && history.length >= 5 ? (
            <div style={{ marginTop: 12, textAlign: "center" }}>
              <button onClick={handleRestart} className="next-button soft">Restart</button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Quiz;
