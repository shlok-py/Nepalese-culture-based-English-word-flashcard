import React, { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import "../style/favourites.css";
import Dashain from "../assets/dashain.jpg";

const API_BASE = "https://walrus-concise-nationally.ngrok-free.app";
const IMAGE_BASE = `${API_BASE}/images/`; // adjust if images served elsewhere

const Favourites = () => {
  const [cards, setCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(1); // 1-based
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/favorites`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];
        setCards(arr);
        setCurrentCard(arr.length ? 1 : 0);
      } catch (e) {
        setError("Failed to load favorites.");
        setCards([]);
        setCurrentCard(0);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const visibleCards = useMemo(() => {
    if (!query.trim()) return cards;
    const q = query.toLowerCase();
    return cards.filter(
      (w) =>
        (w.english && w.english.toLowerCase().includes(q)) ||
        (w.nepaliContext && w.nepaliContext.toLowerCase().includes(q)) ||
        (w.meaning && w.meaning.toLowerCase().includes(q)) ||
        (w.category && w.category.toLowerCase().includes(q)) ||
        (w.difficulty && w.difficulty.toLowerCase().includes(q))
    );
  }, [cards, query]);

  const totalCards = visibleCards.length;
  const currentIndex = Math.max(0, currentCard - 1);
  const word = visibleCards[currentIndex] || {};

  const handlePrev = () => setCurrentCard((c) => Math.max(1, c - 1));
  const handleNext = () => setCurrentCard((c) => Math.min(totalCards || 1, c + 1));
  const onSearch = (e) => {
    setQuery(e.target.value);
    setCurrentCard(1);
  };

  const imageSrc = (word.image && `${IMAGE_BASE}${word.image}`) || Dashain;
  const progressPercentage = totalCards > 0 ? (currentCard / totalCards) * 100 : 0;

  return (
    <>
      <div className="favourites-page">
      <div className="content-box">
        {/* Page header */}
        <div className="cat-header" style={{ marginBottom: 12 }}>
          <h1 className="header-content">Your Favourites</h1>
          <div className="header-desc">Saved words</div>
        </div>

        {/* Search */}
        <div className="input-wrapper" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search favourites…" value={query} onChange={onSearch} />
        </div>

        {/* Flashcard-style header */}
        <div className="header" style={{ marginTop: 8 }}>
          <div className="header-left">
            <button className="back-button" disabled>
              <i className="fa-solid fa-left-long"></i>
            </button>
            <div className="header-text">
              <h2>Favourite words</h2>
              <p className="card-counter">
                Saved: {totalCards ? currentCard : 0}/{totalCards || 0}
              </p>

              {/* Progress bar (inline to keep your CSS untouched) */}
              <div style={{ width: "100%", marginTop: 5 }}>
                <div style={{ width: "100%", backgroundColor: "#e5e7eb", borderRadius: 10, height: 6, overflow: "hidden" }}>
                  <div
                    style={{
                      background: "#3498db",
                      height: "100%",
                      borderRadius: 10,
                      transition: "width 0.3s ease",
                      width: `${progressPercentage}%`,
                    }}
                  />
                </div>
              </div>

              {loading && <p className="card-counter" style={{ marginTop: 6 }}>Loading…</p>}
              {error && <p className="card-counter" style={{ marginTop: 6, color: "#b91c1c" }}>{error}</p>}
            </div>
          </div>
        </div>

        {/* Card */}
        {totalCards === 0 ? (
          <div className="card" style={{ marginTop: 12 }}>
            <h3 style={{ margin: 0 }}>No favourites found.</h3>
            <p style={{ marginTop: 6, color: "#6b7280" }}>
              Add words to favourites from the flashcards page and they’ll appear here.
            </p>
          </div>
        ) : (
          <div className="card" style={{ marginTop: 12 }}>
            <img
              className="card-image"
              src={imageSrc}
              alt={word.english || "Card image"}
              onError={(e) => (e.currentTarget.src = Dashain)}
            />
            <h2 className="card-title">{word.english || "—"}</h2>

            <p className="card-text">ENGLISH</p>
            <p className="card-nep">{word.nepaliContext || "—"}</p>

            {/* Show as plain text (not clickable) */}
            <p className="card-type">
              {word.difficulty ? `(${word.difficulty})` : ""}
              {word.difficulty && word.category ? " · " : ""}
              {word.category || ""}
            </p>

            <p className="card-text">नेपाली</p>
            <p className="card-desc">{word.meaning || word.example || word.culturalNote || "—"}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="navigation">
          <button className="nav-btn prev-btn" disabled={currentCard <= 1 || totalCards === 0} onClick={handlePrev}>
            <i className="fa-solid fa-chevron-left"></i>
            Previous
          </button>

          <div className="page-footer">
            <span className={`indicator ${totalCards ? "active" : ""}`}></span>
            <span className="indicator"></span>
            <span className="indicator"></span>
          </div>

          <button className="nav-btn prev-btn" disabled={currentCard >= totalCards || totalCards === 0} onClick={handleNext}>
            <i className="fa-solid fa-chevron-right"></i>
            Next
          </button>
        </div>
      </div>
      </div>
    </>
  );
};

export default Favourites;
