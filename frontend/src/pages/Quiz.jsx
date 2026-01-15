import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/quiz.css";
import apiService from "../services/api.js";
import MainNavbar, { Breadcrumbs } from "../components/MainNavbar.jsx";

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

// Expanded fallback quiz questions with Nepali script when API is unavailable
const getFallbackQuestions = () => [
  // Daily Life with Nepali script
  {
    id: 1,
    question: "What does 'नमस्ते' (Namaste) mean in English?",
    options: ["Hello/Greetings", "Goodbye", "Thank you", "Please"],
    correctAnswer: "Hello/Greetings",
    category: "daily_life"
  },
  {
    id: 2,
    question: "How do you say 'Thank you' in Nepali?",
    options: ["धन्यवाद (Dhanyabad)", "माफ गर्नुहोस् (Maaf garnuhos)", "कृपया (Kripaya)", "नमस्ते (Namaste)"],
    correctAnswer: "धन्यवाद (Dhanyabad)",
    category: "daily_life"
  },
  {
    id: 3,
    question: "'घर' (Ghar) means _____ in English",
    options: ["House", "Car", "School", "Market"],
    correctAnswer: "House",
    category: "daily_life"
  },
  {
    id: 4,
    question: "What is the Nepali word for 'water'?",
    options: ["पानी (Pani)", "दूध (Dudh)", "चिया (Chiya)", "जुस (Jus)"],
    correctAnswer: "पानी (Pani)",
    category: "food_drink"
  },
  {
    id: 5,
    question: "What are 'मोमो' (Momo)?",
    options: ["Traditional dumplings", "A type of bread", "Sweet dessert", "Spicy curry"],
    correctAnswer: "Traditional dumplings",
    category: "food_drink"
  },
  // Festivals
  {
    id: 6,
    question: "What is 'दशैं' (Dashain) in Nepal?",
    options: ["The biggest festival", "A type of food", "A mountain", "A dance"],
    correctAnswer: "The biggest festival",
    category: "festivals"
  },
  {
    id: 7,
    question: "During which festival do Nepalis worship 'दीपावली' (lights)?",
    options: ["Tihar", "Dashain", "Holi", "Teej"],
    correctAnswer: "Tihar",
    category: "festivals"
  },
  {
    id: 8,
    question: "What is 'टीका' (Tika) used for during Dashain?",
    options: ["Blessing mark on forehead", "A sweet dish", "A musical instrument", "A prayer mat"],
    correctAnswer: "Blessing mark on forehead",
    category: "festivals"
  },
  // Culture & Clothing
  {
    id: 9,
    question: "What is a 'टोपी' (Topi)?",
    options: ["Traditional Nepali cap", "A shoe", "A musical instrument", "A cooking pot"],
    correctAnswer: "Traditional Nepali cap",
    category: "clothing"
  },
  {
    id: 10,
    question: "What is 'गुन्यू चोलो' (Gunyu Cholo)?",
    options: ["Traditional women's dress", "Men's shirt", "A type of dance", "A festival"],
    correctAnswer: "Traditional women's dress",
    category: "clothing"
  },
  // Greetings & Phrases
  {
    id: 11,
    question: "How do you say 'How are you?' in Nepali?",
    options: ["तपाईंलाई कस्तो छ? (Tapailai kasto cha?)", "धन्यवाद (Dhanyabad)", "माफ गर्नुहोस् (Maaf garnuhos)", "नमस्ते (Namaste)"],
    correctAnswer: "तपाईंलाई कस्तो छ? (Tapailai kasto cha?)",
    category: "daily_life"
  },
  {
    id: 12,
    question: "'म ठीक छु' (Ma thik chu) means:",
    options: ["I am fine", "I am hungry", "I am tired", "I am happy"],
    correctAnswer: "I am fine",
    category: "daily_life"
  },
  // Food
  {
    id: 13,
    question: "What is 'दाल भात' (Dal Bhat)?",
    options: ["Rice and lentil soup (staple meal)", "Sweet dessert", "Fried snack", "Spicy pickle"],
    correctAnswer: "Rice and lentil soup (staple meal)",
    category: "food_drink"
  },
  {
    id: 14,
    question: "'चिया' (Chiya) is the Nepali word for:",
    options: ["Tea", "Coffee", "Milk", "Juice"],
    correctAnswer: "Tea",
    category: "food_drink"
  },
  {
    id: 15,
    question: "What is 'अचार' (Achar)?",
    options: ["Spicy pickle/condiment", "Rice dish", "Sweet dessert", "Soup"],
    correctAnswer: "Spicy pickle/condiment",
    category: "food_drink"
  },
  // Nature
  {
    id: 16,
    question: "'सगरमाथा' (Sagarmatha) is the Nepali name for:",
    options: ["Mount Everest", "A river", "A temple", "A city"],
    correctAnswer: "Mount Everest",
    category: "nature"
  },
  {
    id: 17,
    question: "What does 'हिमाल' (Himal) mean?",
    options: ["Mountain/Himalaya", "River", "Forest", "Lake"],
    correctAnswer: "Mountain/Himalaya",
    category: "nature"
  },
  // Numbers
  {
    id: 18,
    question: "'एक' (Ek) is the Nepali number for:",
    options: ["One", "Two", "Three", "Four"],
    correctAnswer: "One",
    category: "daily_life"
  },
  {
    id: 19,
    question: "How do you say 'five' in Nepali?",
    options: ["पाँच (Panch)", "दुई (Dui)", "तीन (Tin)", "चार (Char)"],
    correctAnswer: "पाँच (Panch)",
    category: "daily_life"
  },
  // Transport
  {
    id: 20,
    question: "'बस' (Bus) in Nepali means:",
    options: ["Bus (same as English)", "Car", "Bicycle", "Train"],
    correctAnswer: "Bus (same as English)",
    category: "transport"
  },
  // More advanced
  {
    id: 21,
    question: "What is 'पुजा' (Puja)?",
    options: ["Religious worship/prayer", "A dance", "A food", "A game"],
    correctAnswer: "Religious worship/prayer",
    category: "festivals"
  },
  {
    id: 22,
    question: "'मन्दिर' (Mandir) refers to:",
    options: ["Temple", "House", "School", "Market"],
    correctAnswer: "Temple",
    category: "daily_life"
  },
  {
    id: 23,
    question: "What is 'खाना' (Khana)?",
    options: ["Food", "Water", "House", "Family"],
    correctAnswer: "Food",
    category: "food_drink"
  },
  {
    id: 24,
    question: "'परिवार' (Parivar) means:",
    options: ["Family", "Friend", "Neighbor", "Teacher"],
    correctAnswer: "Family",
    category: "daily_life"
  },
  {
    id: 25,
    question: "What does 'राम्रो' (Ramro) mean?",
    options: ["Good/Beautiful", "Bad", "Big", "Small"],
    correctAnswer: "Good/Beautiful",
    category: "daily_life"
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
        console.debug("Quiz API unavailable, using demo mode");
        setUseOffline(true);
        loadOfflineQuestion(0);
        // Don't show error to user - demo mode works seamlessly
        setError("");
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
      console.debug("Couldn't fetch the next question, using demo mode");
      setUseOffline(true);
      const nextIndex = offlineIndex + 1;
      setOfflineIndex(nextIndex);
      loadOfflineQuestion(nextIndex);
      // Don't show error to user - demo mode works seamlessly
      setError("");
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
    <>
      <MainNavbar />
      <Breadcrumbs path={["Dashboard", "Quiz"]} />
      <div className="quiz-container quiz-with-navbar">
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
            onClick={() => navigate("/dashboard")}
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
    </>
  );
};

export default Quiz;
