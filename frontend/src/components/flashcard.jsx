import React, { useState, useEffect } from "react";
import Dashain from "../assets/dashain.jpg";
import "../style/flashcard.css";
import HeartButton from "../components/heart";
import AudioButton from "../components/AudioButton";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api.js";

const Flashcard = () => {
  const [cards, setCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(null);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [backendStatus, setBackendStatus] = useState(null);
  const navigate = useNavigate();

  const totalCards = cards.length;
  const currentIndex = Math.max(0, currentCard - 1);
  const word = cards[currentIndex] || {};

  // Check backend status on mount
  useEffect(() => {
    const checkBackend = async () => {
      const isAvailable = await apiService.checkHealth();
      setBackendStatus(isAvailable);
      if (!isAvailable) {
        console.warn('⚠️ Backend not available, using fallback data');
      }
    };
    checkBackend();
  }, []);

  const fetchWords = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiService.getWords();
      setCards(data);
      setCurrentCard(1);
      if (data.length === 0) {
        setError("No words found");
      }
    } catch (e) {
      console.debug("Using demo flashcard data");
      // Don't show error - demo mode works seamlessly
      const fallback = apiService.getFallbackWords();
      setCards(fallback);
      setCurrentCard(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchFiltered = async (type, value) => {
    if (!value) return;
    setLoading(true);
    setError("");
    try {
      let data;
      if (type === "difficulty") {
        data = await apiService.getWordsByDifficulty(value);
      } else {
        data = await apiService.getWordsByCategory(value);
      }
      setCards(Array.isArray(data) ? data : []);
      setCurrentCard(1);
      setFilter({ type, value });
    } catch (e) {
      setError(`Failed to load ${type} "${value}".`);
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilter = async () => {
    setFilter(null);
    await fetchWords();
  };

  useEffect(() => {
    fetchWords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch image when word changes
  useEffect(() => {
    const filename = word?.english?.trim?.();
    if (!filename) {
      setImageUrl(null);
      return;
    }

    let oldUrl = imageUrl;
    let isCancelled = false;

    (async () => {
      try {
        const url = await apiService.getImage(filename);
        if (!isCancelled && url) {
          setImageUrl(url);
          if (oldUrl) {
            requestAnimationFrame(() => URL.revokeObjectURL(oldUrl));
          }
        } else if (!isCancelled) {
          setImageUrl(null);
        }
      } catch (err) {
        if (!isCancelled) {
          setImageUrl(null);
        }
      }
    })();

    return () => {
      isCancelled = true;
      if (oldUrl) URL.revokeObjectURL(oldUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word?.english]);

  const handlePrev = () => setCurrentCard((c) => Math.max(1, c - 1));
  const handleNext = () => setCurrentCard((c) => Math.min(totalCards || 1, c + 1));

  const imgSrc = imageUrl || Dashain;

  return (
    <div className="flashcard">
      {/* Backend status logged to console, not shown to users */}
      {backendStatus === false && console.debug("Running in demo mode with cached data")}

      <div className="content-box">
        <div className="header">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate("/dashboard")}>
              ←
            </button>

            <div className="header-text">
              <h2>Learn Nepali Culture</h2>
              <p className="card-counter">
                Card {totalCards ? currentCard : 0} of {totalCards || 0}
              </p>
              <ProgressBar
                current={Math.max(0, currentCard - 1)}
                total={Math.max(1, totalCards)}
              />

              {filter && (
                <div className="filter-bar">
                  <span className="filter-label">
                    Filtered by <strong>{filter.type}</strong>:
                  </span>
                  <span className="filter-chip">"{filter.value}"</span>
                  <button
                    type="button"
                    className="clear-filter"
                    onClick={clearFilter}
                  >
                    Clear filter
                  </button>
                </div>
              )}

              {error && (
                <p className="filter-error">{error}</p>
              )}
            </div>
          </div>

          <div className="favorites">
            <HeartButton wordId={word?.id} />
          </div>
        </div>

        <div className="card">
          <img
            className="card-image"
            src={imgSrc}
            alt={word.english || "Card image"}
            onError={(e) => {
              e.currentTarget.src = Dashain;
            }}
          />

          <div className="card-title-row">
            <h2 className="card-title">
              {loading ? "Loading…" : word.english || "—"}
            </h2>
            {!loading && word.english && (
              <AudioButton text={word.english} language="english" />
            )}
          </div>

          <p className="card-text">ENGLISH</p>

          <p className="card-nep">
            {loading ? "…" : word.nepaliContext || "—"}
          </p>

          <p className="card-type">
            {!loading && word.difficulty && (
              <span
                role="button"
                tabIndex={0}
                onClick={() => fetchFiltered("difficulty", word.difficulty)}
                onKeyDown={(e) =>
                  e.key === "Enter" && fetchFiltered("difficulty", word.difficulty)
                }
                className="clickable-tag"
              >
                {word.difficulty}
              </span>
            )}
            {!loading && word.difficulty && word.category && " · "}
            {!loading && word.category && (
              <span
                role="button"
                tabIndex={0}
                onClick={() => fetchFiltered("category", word.category)}
                onKeyDown={(e) =>
                  e.key === "Enter" && fetchFiltered("category", word.category)
                }
                className="clickable-tag"
              >
                {word.category}
              </span>
            )}
          </p>

          <div className="card-nepali-row">
            <p className="card-text">नेपाली</p>
            {!loading && word.nepaliContext && (
              <AudioButton text={word.nepaliContext} language="nepali" />
            )}
          </div>

          <p className="card-desc">
            {loading
              ? "Loading…"
              : word.meaning || word.example || word.culturalNote || "—"}
          </p>

          {!loading && word.culturalNote && word.meaning && (
            <p className="card-cultural-note">
              💡 {word.culturalNote}
            </p>
          )}
        </div>

        <div className="navigation">
          <button
            className="nav-btn prev-btn"
            disabled={currentCard === 1 || !totalCards}
            onClick={handlePrev}
          >
            ← Previous
          </button>

          <div className="page-indicators">
            {[...Array(Math.min(5, totalCards))].map((_, i) => (
              <span
                key={i}
                className={`indicator ${i === (currentCard - 1) % 5 ? "active" : ""}`}
              />
            ))}
          </div>

          <button
            className="nav-btn next-btn"
            disabled={currentCard === totalCards || !totalCards}
            onClick={handleNext}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;

/* ProgressBar Component */
const ProgressBar = ({ current, total }) => {
  const progressPercentage = total > 0 ? ((current + 1) / total) * 100 : 0;
  return (
    <div style={progressContainer}>
      <div style={progressTrack}>
        <div style={{ ...progressFill, width: `${progressPercentage}%` }} />
      </div>
    </div>
  );
};

const progressContainer = { width: "100%", marginTop: "5px" };
const progressTrack = {
  width: "100%",
  backgroundColor: "#e5e7eb",
  borderRadius: "10px",
  height: "6px",
  overflow: "hidden",
};
const progressFill = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  height: "100%",
  borderRadius: "10px",
  transition: "width 0.3s ease",
};
