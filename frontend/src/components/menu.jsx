
// import React, { useState, useEffect } from 'react';
// import {Link} from 'react-router-dom'
// import "../style/menu.css"

// const Menu = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkScreenSize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkScreenSize();
//     window.addEventListener('resize', checkScreenSize);
    
//     return () => window.removeEventListener('resize', checkScreenSize);
//   }, []);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   // Close menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (isMenuOpen && !event.target.closest('.nav-container')) {
//         setIsMenuOpen(false);
//       }
//     };
    
//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, [isMenuOpen]);

//   return (
//     <nav className="nav-container">
//       <div className="nav-layout">
//         {/* Logo */}
//         <div className="logo">
//           <span className="logo-icon">
//          🇳🇵NepalLearn
//           </span>
//         </div>

//         {/* Desktop Navigation */}
//         {!isMobile && (
//           <div className="desktop-nav">
//             <div className="nav-links">
//               <Link to="/" className="nav-link active">Home</Link>
//               <Link to="/flashcard" className="nav-link">Flashcard</Link>
//               <Link to="/quiz" className="nav-link">Quiz</Link>
//               <Link to="/create" className="nav-link">Create</Link>
//               <Link to="/favourites" className="nav-link"> Favourites </Link>
            
//             </div>

//             {/* Desktop Right Side */}
//             <div className="desktop-actions">
//                 <div className="user-avatar">P</div>
//               </div>
//             </div>

//         )}

//         {/* Hamburger Menu Button */}
//         {isMobile && (
//           <button
//             onClick={toggleMenu}
//             className={`hamburger-btn ${isMenuOpen ? 'active' : ''}`}
//           >
//             <div className="hamburger-line"></div>
//             <div className="hamburger-line"></div>
//             <div className="hamburger-line"></div>
//           </button>
//         )}
//       </div>

//       {/* Mobile Menu Dropdown */}
//       {isMobile && (
//         <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
//           <div className="mobile-menu-content">
//             <Link to="/" className="mobile-link active">Home</Link>
//             <Link to="/flashcard" className="mobile-link">FLashcard</Link>
//             <Link to="/Quiz" className="mobile-link">Quiz</Link>
//             <Link to="/learn" className="mobile-link">Learn</Link>
//             <Link to="/favourites" className="mobile-link">Favourites</Link>
//             {/* Mobile Search and Actions */}
//             <div className="mobile-actions">
//               <div className="mobile-user-section">
//                 <div className="mobile-user-actions">
//                   <div className="mobile-avatar">P</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Menu;


// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import "../style/menu.css";

// const Menu = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const location = useLocation(); // Get current route

//   useEffect(() => {
//     const checkScreenSize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkScreenSize();
//     window.addEventListener('resize', checkScreenSize);
//     return () => window.removeEventListener('resize', checkScreenSize);
//   }, []);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   // Close menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (isMenuOpen && !event.target.closest('.nav-container')) {
//         setIsMenuOpen(false);
//       }
//     };
    
//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, [isMenuOpen]);

//   // Close mobile menu when route changes
//   useEffect(() => {
//     setIsMenuOpen(false);
//   }, [location]);

//   // Function to handle mobile link clicks
//   const handleMobileLinkClick = () => {
//     setIsMenuOpen(false);
//   };

//   // Function to check if link is active
//   const isActiveLink = (path) => {
//     return location.pathname === path;
//   };

//   return (
//     <nav className="nav-container">
//       <div className="nav-layout">
//         {/* Logo */}
//         <div className="logo">
//           <span className="logo-icon">
//             🇳🇵NepalLearn
//           </span>
//         </div>

//         {/* Desktop Navigation */}
//         {!isMobile && (
//           <div className="desktop-nav">
//             <div className="nav-links">
//               <Link 
//                 to="/" 
//                 className={`nav-link ${isActiveLink('/') ? 'active' : ''}`}
//               >
//                 Home
//               </Link>
//               <Link 
//                 to="/flashcard" 
//                 className={`nav-link ${isActiveLink('/flashcard') ? 'active' : ''}`}
//               >
//                 Flashcard
//               </Link>
//               <Link 
//                 to="/quiz" 
//                 className={`nav-link ${isActiveLink('/quiz') ? 'active' : ''}`}
//               >
//                 Quiz
//               </Link>
//               {/* <Link 
//                 to="/create" 
//                 className={`nav-link ${isActiveLink('/create') ? 'active' : ''}`}
//               >
//                 Create
//               </Link> */}
//               <Link 
//                 to="/favourites" 
//                 className={`nav-link ${isActiveLink('/favourites') ? 'active' : ''}`}
//               >
//                 Favourites
//               </Link>
//             </div>

//             {/* Desktop Right Side */}
//             <div className="desktop-actions">
//               <div className="user-avatar">P</div>
//             </div>
//           </div>
//         )}

//         {/* Hamburger Menu Button */}
//         {isMobile && (
//           <button
//             onClick={toggleMenu}
//             className={`hamburger-btn ${isMenuOpen ? 'active' : ''}`}
//           >
//             <div className="hamburger-line"></div>
//             <div className="hamburger-line"></div>
//             <div className="hamburger-line"></div>
//           </button>
//         )}
//       </div>

//       {/* Mobile Menu Dropdown */}
//       {isMobile && (
//         <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
//           <div className="mobile-menu-content">
//             <Link 
//               to="/" 
//               className={`mobile-link ${isActiveLink('/') ? 'active' : ''}`}
//               onClick={handleMobileLinkClick}
//             >
//               Home
//             </Link>
//             <Link 
//               to="/flashcard" 
//               className={`mobile-link ${isActiveLink('/flashcard') ? 'active' : ''}`}
//               onClick={handleMobileLinkClick}
//             >
//               Flashcard
//             </Link>
//             <Link 
//               to="/quiz" 
//               className={`mobile-link ${isActiveLink('/quiz') ? 'active' : ''}`}
//               onClick={handleMobileLinkClick}
//             >
//               Quiz
//             </Link>
//             <Link 
//               to="/learn" 
//               className={`mobile-link ${isActiveLink('/learn') ? 'active' : ''}`}
//               onClick={handleMobileLinkClick}
//             >
//               Learn
//             </Link>
//             <Link 
//               to="/favourites" 
//               className={`mobile-link ${isActiveLink('/favourites') ? 'active' : ''}`}
//               onClick={handleMobileLinkClick}
//             >
//               Favourites
//             </Link>

//             {/* Mobile Search and Actions */}
//             <div className="mobile-actions">
//               <div className="mobile-user-section">
//                 <div className="mobile-user-actions">
//                   <div className="mobile-avatar">P</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Menu;


// components/Menu.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Comment out the CSS import temporarily to test if it's causing issues
// import "../style/menu.css";

const Menu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  // Inline styles for testing (remove when CSS works)
  const navStyle = {
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const linkStyle = {
    textDecoration: 'none',
    margin: '0 10px',
    padding: '8px 16px',
    borderRadius: '4px',
    color: '#333'
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: '#007bff',
    color: 'white'
  };

  return (
    <nav style={navStyle}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
          🇳🇵NepalLearn
        </span>
      </div>

      {!isMobile ? (
        // Desktop Navigation
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* <Link
            to="/"
            style={isActiveLink('/') ? activeLinkStyle : linkStyle}
          >
            Home
          </Link> */}
          <Link
            to="/flashcard"
            style={isActiveLink('/flashcard') ? activeLinkStyle : linkStyle}
          >
            Flashcard
          </Link>
          <Link
            to="/quiz"
            style={isActiveLink('/quiz') ? activeLinkStyle : linkStyle}
          >
            Quiz
          </Link>
          <Link
            to="/favourites"
            style={isActiveLink('/favourites') ? activeLinkStyle : linkStyle}
          >
            Favourites
          </Link>
          <Link
            to="/learn"
            style={isActiveLink('/learn') ? activeLinkStyle : linkStyle}
          >
            Learn
          </Link>
        </div>
      ) : (
        // Mobile Hamburger
        <button onClick={toggleMenu} style={{ background: 'none', border: 'none', fontSize: '20px' }}>
          ☰
        </button>
      )}

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          padding: '20px'
        }}>
          <Link to="/" style={{ display: 'block', padding: '10px 0', textDecoration: 'none', color: '#333' }}>Home</Link>
          <Link to="/flashcard" style={{ display: 'block', padding: '10px 0', textDecoration: 'none', color: '#333' }}>Flashcard</Link>
          <Link to="/quiz" style={{ display: 'block', padding: '10px 0', textDecoration: 'none', color: '#333' }}>Quiz</Link>
          <Link to="/favourites" style={{ display: 'block', padding: '10px 0', textDecoration: 'none', color: '#333' }}>Favourites</Link>
          <Link to="/learn" style={{ display: 'block', padding: '10px 0', textDecoration: 'none', color: '#333' }}>Learn</Link>
        </div>
      )}
    </nav>
  );
};

export default Menu;