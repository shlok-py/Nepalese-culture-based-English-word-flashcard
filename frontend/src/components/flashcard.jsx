// // import React, { useState, useEffect } from "react";
// // import Dashain from "../assets/dashain.jpg"; // fallback image only
// // import "../style/flashcard.css";
// // import HeartButton from "../components/heart";
// // // import { useNavigate } from "react-router-dom";

// // const API_BASE = "http://127.0.0.1:2000";
// // // Adjust this to match where your FastAPI serves images (examples):
// // //   `${API_BASE}/images/`  or  `${API_BASE}/static/`
// // const IMAGE_BASE = `${API_BASE}/images/`;

// // const Flashcard = () => {
// //   // const navigate = useNavigate();
// //   const [cards, setCards] = useState([]);
// //   const [currentCard, setCurrentCard] = useState(1); // keep 1-based for your UI
// //   const [loading, setLoading] = useState(true);

// //   const totalCards = cards.length;
// //   const currentIndex = Math.max(0, currentCard - 1);
// //   const word = cards[currentIndex] || {};

// //   useEffect(() => {
// //     const fetchCards = async () => {
// //       setLoading(true);
// //       try {
// //         const res = await fetch(`${API_BASE}/api/words`);
// //         const data = await res.json();
// //         setCards(Array.isArray(data) ? data : []);
// //         setCurrentCard(1); // reset to first card on load
// //       } catch (e) {
// //         console.error("Error fetching /api/words:", e);
// //         setCards([]);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchCards();
// //   }, []);

// //   const handlePrev = () => setCurrentCard((c) => Math.max(1, c - 1));
// //   const handleNext = () => setCurrentCard((c) => Math.min(totalCards || 1, c + 1));

// //   // Image from API (filename) -> full URL; fallback to local Dashain if it fails
// //   const imageSrc =
// //     (word.image && `${IMAGE_BASE}${word.image}`) || Dashain;

// //   return (
// //     <>
// //       <div className="content-box">
// //         <div className="header">
// //           <div className="header-left">
// //             <button className="back-button">
// //               <i className="fa-solid fa-left-long"></i>
// //             </button>

// //             <div className="header-text">
// //               <h2>Festivals & traditions</h2>
// //               <p className="card-counter">
// //                 All cards: {totalCards ? currentCard : 0}/{totalCards || 0}
// //               </p>
// //               <ProgressBar
// //                 current={Math.max(0, currentCard - 1)}
// //                 total={Math.max(1, totalCards)}
// //               />
// //             </div>
// //           </div>

// //           <div className="favorites">
// //             <HeartButton />
// //             <span> Favourites</span>
// //           </div>
// //         </div>

// //         <div className="card">
// //           <img
// //             className="card-image"
// //             src={imageSrc}
// //             alt={word.english || "Card image"}
// //             onError={(e) => {
// //               e.currentTarget.src = Dashain;
// //             }}
// //           />

// //           <h2 className="card-title">{loading ? "Loading…" : (word.english || "—")}</h2>

// //           <p className="card-text">ENGLISH</p>

// //           <p className="card-nep">{loading ? "…" : (word.nepaliContext || "—")}</p>

// //           <p className="card-type">
// //             {loading
// //               ? ""
// //               : (word.category && `(${word.category})`) ||
// //                 (word.difficulty && `(${word.difficulty})`) ||
// //                 ""}
// //           </p>

// //           <p className="card-text">नेपाली</p>

// //           <p className="card-desc">
// //             {loading
// //               ? "Loading…"
// //               : (word.meaning ||
// //                  word.example ||
// //                  word.culturalNote ||
// //                  "—")}
// //           </p>
// //         </div>

// //         <div className="navigation">
// //           <button
// //             className="nav-btn prev-btn"
// //             disabled={currentCard === 1 || !totalCards}
// //             onClick={handlePrev}
// //           >
// //             <i className="fa-solid fa-chevron-left"></i>
// //             Previous
// //           </button>

// //           <div className="page-footer">
// //             <span className={`indicator ${totalCards ? "active" : ""}`}></span>
// //             <span className="indicator"></span>
// //             <span className="indicator"></span>
// //           </div>

// //           <button
// //             className="nav-btn prev-btn"
// //             disabled={currentCard === totalCards || !totalCards}
// //             onClick={handleNext}
// //           >
// //             <i className="fa-solid fa-chevron-right"></i>
// //             Next
// //           </button>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default Flashcard;

// // /* ProgressBar (unchanged styling) */
// // const ProgressBar = ({ current, total }) => {
// //   const progressPercentage = total > 0 ? ((current + 1) / total) * 100 : 0;
// //   return (
// //     <div style={progressContainer}>
// //       <div style={progressTrack}>
// //         <div style={{ ...progressFill, width: `${progressPercentage}%` }} />
// //       </div>
// //     </div>
// //   );
// // };

// // const progressContainer = { width: "200%", marginTop: "5px" };
// // const progressTrack = {
// //   width: "100%",
// //   backgroundColor: "#e5e7eb",
// //   borderRadius: "10px",
// //   height: "6px",
// //   overflow: "hidden",
// // };
// // const progressFill = {
// //   background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
// //   height: "100%",
// //   borderRadius: "10px",
// //   transition: "width 0.3s ease",
// // };

// import React, { useState, useEffect } from "react";
// import Dashain from "../assets/dashain.jpg"; 
// import "../style/flashcard.css";
// import HeartButton from "../components/heart";
// import { useNavigate } from "react-router-dom";


// const API_BASE = "https://walrus-concise-nationally.ngrok-free.app";
// const IMAGE_BASE = `${API_BASE}/images/`; // change if your FastAPI serves images elsewhere

// const Flashcard = () => {
//   const [cards, setCards] = useState([]);
//   const [currentCard, setCurrentCard] = useState(1); // 1-based for your UI
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState(null); // { type: 'difficulty'|'category', value: string } | null
//   const [error, setError] = useState("");
//   const navigate = useNavigate();


//   const totalCards = cards.length;
//   const currentIndex = Math.max(0, currentCard - 1);
//   const word = cards[currentIndex] || {};

//   const fetchWords = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch(`${API_BASE}/api/words`,{
//            headers: {
//             "ngrok-skip-browser-warning": "true",
//             "Content-Type": "application/json",
//           },
//       });
//       const data = await res.json();
//       setCards(Array.isArray(data) ? data : []);
//       setCurrentCard(1);
//     } catch (e) {
//       setError("Failed to load words.");
//       setCards([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchFiltered = async (type, value) => {
//     if (!value) return;
//     setLoading(true);
//     setError("");
//     try {
//       const path =
//         type === "difficulty"
//           ? `/api/words/difficulty/${encodeURIComponent(value)}`
//           : `/api/words/category/${encodeURIComponent(value)}`;
//       const res = await fetch(`${API_BASE}${path}`);
//       const data = await res.json();
//       setCards(Array.isArray(data) ? data : []);
//       setCurrentCard(1);
//       setFilter({ type, value });
//     } catch (e) {
//       setError(`Failed to load ${type} "${value}".`);
//       setCards([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearFilter = async () => {
//     setFilter(null);
//     await fetchWords();
//   };

//   useEffect(() => {
//     fetchWords();
//   }, []);

//   const handlePrev = () => setCurrentCard((c) => Math.max(1, c - 1));
//   const handleNext = () =>
//     setCurrentCard((c) => Math.min(totalCards || 1, c + 1));

//   const imageSrc = (word.image && `${IMAGE_BASE}${word.image}`) || Dashain;

//   return (
//     <>
//     <div className="flashcard">
// <div className="content-box">
//         <div className="header">
//           <div className="header-left">
//             <button className="back-button" onClick={() => navigate("/landing")}>
//               <i className="fa-solid fa-left-long"></i>
//             </button>

//             <div className="header-text">
//               <h2>Festivals & traditions</h2>
//               <p className="card-counter">
//                 All cards: {totalCards ? currentCard : 0}/{totalCards || 0}
//               </p>
//               <ProgressBar
//                 current={Math.max(0, currentCard - 1)}
//                 total={Math.max(1, totalCards)}
//               />
//               {filter ? (
//                 <div className="filter-bar">
//                   <span className="filter-label">
//                     Filtered by <strong>{filter.type}</strong>:
//                   </span>
//                   <span className="filter-chip">“{filter.value}”</span>
//                   <button
//                     type="button"
//                     className="clear-filter"
//                     onClick={clearFilter}
//                   >
//                     Clear filter
//                   </button>
//                 </div>
//               ) : null}

//               {error ? <p className="filter-error">{error}</p> : null}

//               {error ? (
//                 <p
//                   className="card-counter"
//                   style={{ color: "#b91c1c", marginTop: 6 }}
//                 >
//                   {error}
//                 </p>
//               ) : null}
//             </div>
//           </div>

//           <div className="favorites">
//             <HeartButton />
      
//           </div>
//         </div>

//         <div className="card">
//           <img
//             className="card-image"
//             src={imageSrc}
//             alt={word.english || "Card image"}
//             onError={(e) => {
//               e.currentTarget.src = Dashain;
//             }}
//           />

//           <h2 className="card-title">
//             {loading ? "Loading…" : word.english || "—"}
//           </h2>

//           <p className="card-text">ENGLISH</p>

//           <p className="card-nep">
//             {loading ? "…" : word.nepaliContext || "—"}
//           </p>

//           {/* Clickable difficulty & category */}
//           <p className="card-type">
//             {/* Difficulty */}
//             {!loading && word.difficulty ? (
//               <span
//                 role="button"
//                 tabIndex={0}
//                 onClick={() => fetchFiltered("difficulty", word.difficulty)}
//                 onKeyDown={(e) =>
//                   e.key === "Enter" &&
//                   fetchFiltered("difficulty", word.difficulty)
//                 }
//                 style={{ cursor: "pointer", textDecoration: "underline" }}
//               >
//                 ({word.difficulty})
//               </span>
//             ) : null}
//             {/* Spacer */}
//             {!loading && word.difficulty && word.category ? " · " : ""}
//             {/* Category */}
//             {!loading && word.category ? (
//               <span
//                 role="button"
//                 tabIndex={0}
//                 onClick={() => fetchFiltered("category", word.category)}
//                 onKeyDown={(e) =>
//                   e.key === "Enter" && fetchFiltered("category", word.category)
//                 }
//                 style={{ cursor: "pointer", textDecoration: "underline" }}
//               >
//                 {word.category}
//               </span>
//             ) : null}
//           </p>

//           <p className="card-text">नेपाली</p>

//           <p className="card-desc">
//             {loading
//               ? "Loading…"
//               : word.meaning || word.example || word.culturalNote || "—"}
//           </p>
//         </div>

//         <div className="navigation">
//           <button
//             className="nav-btn prev-btn"
//             disabled={currentCard === 1 || !totalCards}
//             onClick={handlePrev}
//           >
//             <i className="fa-solid fa-chevron-left"></i>
//             Previous
//           </button>

//           <div className="page-footer">
//             <span className={`indicator ${totalCards ? "active" : ""}`}></span>
//             <span className="indicator"></span>
//             <span className="indicator"></span>
//           </div>

//           <button
//             className="nav-btn prev-btn"
//             disabled={currentCard === totalCards || !totalCards}
//             onClick={handleNext}
//           >
//             <i className="fa-solid fa-chevron-right"></i>
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
      
//     </>
//   );
// };

// export default Flashcard;

// /* ProgressBar unchanged */
// const ProgressBar = ({ current, total }) => {
//   const progressPercentage = total > 0 ? ((current + 1) / total) * 100 : 0;
//   return (
//     <div style={progressContainer}>
//       <div style={progressTrack}>
//         <div style={{ ...progressFill, width: `${progressPercentage}%` }} />
//       </div>
//     </div>
//   );
// };

// const progressContainer = { width: "100%", marginTop: "5px" };
// const progressTrack = {
//   width: "100%",
//   backgroundColor: "#e5e7eb",
//   borderRadius: "10px",
//   height: "6px",
//   overflow: "hidden",
// };
// const progressFill = {
//   background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//   height: "100%",
//   borderRadius: "10px",
//   transition: "width 0.3s ease",
// };



import React, { useState, useEffect } from "react";
import Dashain from "../assets/dashain.jpg";
import "../style/flashcard.css";
import HeartButton from "../components/heart";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://walrus-concise-nationally.ngrok-free.app";

const Flashcard = () => {
  const [cards, setCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(1); // 1-based for your UI
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(null);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState(null); // <- object URL from bytes
  const navigate = useNavigate();

  const totalCards = cards.length;
  const currentIndex = Math.max(0, currentCard - 1);
  const word = cards[currentIndex] || {};

  const fetchWords = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/words`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setCards(Array.isArray(data) ? data : []);
      setCurrentCard(1);
    } catch (e) {
      setError("Failed to load words.");
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFiltered = async (type, value) => {
    if (!value) return;
    setLoading(true);
    setError("");
    try {
      const path =
        type === "difficulty"
          ? `/api/words/difficulty/${encodeURIComponent(value)}`
          : `/api/words/category/${encodeURIComponent(value)}`;
      const res = await fetch(`${API_BASE}${path}`, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      const data = await res.json();
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
  }, []);

  useEffect(() => {
    const filename = word?.english?.trim?.();
    if (!filename) {
      setImageUrl(null);
      return;
    }
  
    const ctrl = new AbortController();
    let oldUrl = imageUrl;
  
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/image/${encodeURIComponent(filename.toLowerCase())}`,
          {
            method: "POST",
            headers: { "ngrok-skip-browser-warning": "true" },
            signal: ctrl.signal,
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
  
        // Get the image as a Blob and create an object URL for it
        const blob = await res.blob();
        const nextUrl = URL.createObjectURL(blob);
        setImageUrl(nextUrl); // Update imageUrl state with the new object URL
  
        // Revoke the previous URL to free up memory
        if (oldUrl) {
          requestAnimationFrame(() => URL.revokeObjectURL(oldUrl));
          oldUrl = null;
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setImageUrl(null); // Fallback in case of error
        }
      }
    })();
  
    return () => {
      ctrl.abort();
      if (oldUrl) URL.revokeObjectURL(oldUrl); // Clean up on unmount
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word?.english]); // Re-run effect whenever word changes
  

  const handlePrev = () => setCurrentCard((c) => Math.max(1, c - 1));
  const handleNext = () =>
    setCurrentCard((c) => Math.min(totalCards || 1, c + 1));

  // Render object URL if present, else fallback image
  const imgSrc = imageUrl;

  return (
    <>
      <div className="flashcard">
        <div className="content-box">
          <div className="header">
            <div className="header-left">
              <button className="back-button" onClick={() => navigate("/landing")}>
                <i className="fa-solid fa-left-long"></i>
              </button>

              <div className="header-text">
                <h2>Festivals & traditions</h2>
                <p className="card-counter">
                  All cards: {totalCards ? currentCard : 0}/{totalCards || 0}
                </p>
                <ProgressBar
                  current={Math.max(0, currentCard - 1)}
                  total={Math.max(1, totalCards)}
                />

                {filter ? (
                  <div className="filter-bar">
                    <span className="filter-label">
                      Filtered by <strong>{filter.type}</strong>:
                    </span>
                    <span className="filter-chip">“{filter.value}”</span>
                    <button
                      type="button"
                      className="clear-filter"
                      onClick={clearFilter}
                    >
                      Clear filter
                    </button>
                  </div>
                ) : null}

                {error ? <p className="filter-error">{error}</p> : null}

                {error ? (
                  <p
                    className="card-counter"
                    style={{ color: "#b91c1c", marginTop: 6 }}
                  >
                    {error}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="favorites">
              <HeartButton />
            </div>
          </div>

          <div className="card">
            <img
              className="card-image"
              src={imgSrc}
              alt={word.english || "Card image"}
              onError={() => setImageUrl(null)} // In case of error, fallback to Dashain
            />

            <h2 className="card-title">
              {loading ? "Loading…" : word.english || "—"}
            </h2>

            <p className="card-text">ENGLISH</p>

            <p className="card-nep">{loading ? "…" : word.nepaliContext || "—"}</p>

            <p className="card-type">
              {!loading && word.difficulty ? (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => fetchFiltered("difficulty", word.difficulty)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && fetchFiltered("difficulty", word.difficulty)
                  }
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                >
                  ({word.difficulty})
                </span>
              ) : null}
              {!loading && word.difficulty && word.category ? " · " : ""}
              {!loading && word.category ? (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => fetchFiltered("category", word.category)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && fetchFiltered("category", word.category)
                  }
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                >
                  {word.category}
                </span>
              ) : null}
            </p>

            <p className="card-text">नेपाली</p>

            <p className="card-desc">
              {loading
                ? "Loading…"
                : word.meaning || word.example || word.culturalNote || "—"}
            </p>
          </div>

          <div className="navigation">
            <button
              className="nav-btn prev-btn"
              disabled={currentCard === 1 || !totalCards}
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
              disabled={currentCard === totalCards || !totalCards}
              onClick={handleNext}
            >
              <i className="fa-solid fa-chevron-right"></i>
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Flashcard;

/* ProgressBar unchanged */
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
