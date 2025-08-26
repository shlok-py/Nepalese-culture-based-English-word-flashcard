import React, { useEffect, useState } from "react";
import "../style/learn.css";

const API_BASE = "http://127.0.0.1:2000";
const IMAGE_BASE = `${API_BASE}/images/`; // change if your images live elsewhere

const categories = [
  { label: "Daily Life",   value: "daily_life",   icon: "🏠", desc: "Essential words for everyday activities" },
  { label: "Food & Drink", value: "food",         icon: "🍽️", desc: "Traditional Nepali cuisines and beverages" },
  { label: "Festivals",    value: "festivals",    icon: "🎊", desc: "Cultural celebrations and traditions" },
  { label: "Nature",       value: "nature",       icon: "⛰️", desc: "Mountains, rivers and natural beauty" },
  { label: "Transport",    value: "transport",    icon: "🚌", desc: "Getting around in Nepal" },
];

const Learn = () => {
  const [open, setOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null); // { label, value }

  const openCategory = (cat) => {
    setSelectedCat(cat);
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
    setSelectedCat(null);
  };

  return (
    <>
      <div className="cat-header">
        <h1 className="header-content">Choose a Category</h1>
        <div className="header-desc">
          Select a category to start learning Nepali words with cultural context and examples
        </div>
      </div>

      <div className="stats-section">
        <div className="stats-grid">
          {categories.map((c) => (
            <div className="stat-card" key={c.value}>
              <div className="stat-icon">{c.icon}</div>
              <div className="stat-title">{c.label}</div>
              <p className="stat-label">{c.desc}</p>
              <button className="start-button" onClick={() => openCategory(c)}>
                <i className="fa-solid fa-chevron-right"></i>
                Start Learning
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Popup modal */}
      {open && selectedCat && (
        <Modal onClose={closeModal} title={`${selectedCat.label}`}>
          <CategoryFlashcard category={selectedCat} onClose={closeModal} />
        </Modal>
      )}
    </>
  );
};

export default Learn;

/* ---------- Reusable Modal ---------- */
const Modal = ({ title, children, onClose }) => {
  // close on Esc
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

/* ---------- Flashcard filtered by category ---------- */
const CategoryFlashcard = ({ category, onClose }) => {
  const [cards, setCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(1); // 1-based for header
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const totalCards = cards.length;
  const idx = Math.max(0, currentCard - 1);
  const word = cards[idx] || {};

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${API_BASE}/api/words/category/${encodeURIComponent(category.value)}`
        );
        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];
        setCards(arr);
        setCurrentCard(arr.length ? 1 : 0);
      } catch (e) {
        setError("Failed to load words for this category.");
        setCards([]);
        setCurrentCard(0);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category]);

  const handlePrev = () => setCurrentCard((c) => Math.max(1, c - 1));
  const handleNext = () => setCurrentCard((c) => Math.min(totalCards || 1, c + 1));

  const progressPercentage = totalCards > 0 ? (currentCard / totalCards) * 100 : 0;
  const imageSrc =
    (word.image && `${IMAGE_BASE}${word.image}`) ||
    // fallback emoji image via data URL (keeps your CSS intact without importing an asset)
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='28'>📚</text></svg>";

  return (
    <div className="content-box">
      <div className="header">
        <div className="header-left">
          <button className="back-button" onClick={onClose}>
            <i className="fa-solid fa-left-long"></i>
          </button>
          <div className="header-text">
            <h2>{category.label}</h2>
            <p className="card-counter">
              Cards: {totalCards ? currentCard : 0}/{totalCards || 0}
            </p>

            {/* progress bar (100% width so it doesn't overflow) */}
            <div style={{ width: "100%", marginTop: 5 }}>
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#e5e7eb",
                  borderRadius: 10,
                  height: 6,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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

      {totalCards === 0 ? (
        <div className="card" style={{ marginTop: 12 }}>
          <h3 style={{ margin: 0 }}>No words found.</h3>
          <p style={{ marginTop: 6, color: "#6b7280" }}>
            Try a different category.
          </p>
        </div>
      ) : (
        <div className="card" style={{ marginTop: 12 }}>
          <img
            className="card-image"
            src={imageSrc}
            alt={word.english || "Card image"}
            onError={(e) => {
              e.currentTarget.src = imageSrc;
            }}
          />
          <h2 className="card-title">{word.english || "—"}</h2>

          <p className="card-text">ENGLISH</p>
          <p className="card-nep">{word.nepaliContext || "—"}</p>

          <p className="card-type">
            {word.difficulty ? `(${word.difficulty})` : ""}
            {word.difficulty && word.category ? " · " : ""}
            {word.category || ""}
          </p>

          <p className="card-text">नेपाली</p>
          <p className="card-desc">
            {word.meaning || word.example || word.culturalNote || "—"}
          </p>
        </div>
      )}

      {/* nav */}
      <div className="navigation">
        <button
          className="nav-btn prev-btn"
          disabled={currentCard <= 1 || totalCards === 0}
          onClick={handlePrev}
        >
          <i className="fa-solid fa-chevron-left"></i>
          Previous
        </button>

        <div className="page-footer">
          <span className={`indicator ${totalCards ? "active" : ""}`}></span>
          <span className="indicator"></span>
          <span className="indicator"></span>
        </div>

        <button
          className="nav-btn prev-btn"
          disabled={currentCard >= totalCards || totalCards === 0}
          onClick={handleNext}
        >
          <i className="fa-solid fa-chevron-right"></i>
          Next
        </button>
      </div>
    </div>
  );
};
