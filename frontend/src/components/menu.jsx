
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
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Menu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Check screen size for responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const isPracticeActive = () => {
    return location.pathname === '/quiz' || location.pathname === '/roleselect';
  };

  // Styles
  const navStyle = {
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative'
  };

  const linkStyle = {
    textDecoration: 'none',
    margin: '0 10px',
    padding: '8px 16px',
    borderRadius: '4px',
    color: '#333',
    transition: 'background-color 0.2s ease'
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: '#007bff',
    color: 'white'
  };

  const dropdownButtonStyle = {
    ...linkStyle,
    backgroundColor: isPracticeActive() ? '#007bff' : 'transparent',
    color: isPracticeActive() ? 'white' : '#333',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  };

  const dropdownMenuStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    background: 'white',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    borderRadius: '8px',
    marginTop: '4px',
    listStyle: 'none',
    padding: '8px 0',
    minWidth: '140px',
    zIndex: 1000,
    opacity: isDropdownOpen ? 1 : 0,
    visibility: isDropdownOpen ? 'visible' : 'hidden',
    transform: isDropdownOpen ? 'translateY(0)' : 'translateY(-10px)',
    transition: 'all 0.2s ease'
  };

  const dropdownItemStyle = {
    display: 'block',
    padding: '10px 16px',
    color: '#333',
    textDecoration: 'none',
    transition: 'background-color 0.2s ease'
  };

  const hamburgerStyle = {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease'
  };

  return (
    <nav style={navStyle}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
          🇳🇵NepalLearn
        </span>
      </div>

      {!isMobile ? (
        // Desktop Navigation
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link
            to="/flashcard"
            style={isActiveLink('/flashcard') ? activeLinkStyle : linkStyle}
          >
            Flashcard
          </Link>

          {/* Practice Dropdown */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              style={dropdownButtonStyle}
              onClick={toggleDropdown}
              onMouseEnter={() => setIsDropdownOpen(true)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              Practice
              <span style={{ 
                transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
                fontSize: '12px'
              }}>
                ▼
              </span>
            </button>

            <ul style={dropdownMenuStyle}>
              <li>
                <Link
                  to="/quiz"
                  style={{
                    ...dropdownItemStyle,
                    backgroundColor: isActiveLink('/quiz') ? '#f0f8ff' : 'transparent'
                  }}
                  onClick={closeDropdown}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = isActiveLink('/quiz') ? '#f0f8ff' : 'transparent'}
                >
                  📝 Quiz
                </Link>
              </li>
              <li>
                <Link
                  to="/roleselect"
                  style={{
                    ...dropdownItemStyle,
                    backgroundColor: isActiveLink('/roleplay') ? '#f0f8ff' : 'transparent'
                  }}
                  onClick={closeDropdown}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = isActiveLink('/roleplay') ? '#f0f8ff' : 'transparent'}
                >
                  🎭 RolePlay
                </Link>
              </li>
            </ul>
          </div>

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
        <button 
          onClick={toggleMenu} 
          style={{
            ...hamburgerStyle,
            backgroundColor: isMenuOpen ? '#f8f9fa' : 'transparent'
          }}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      )}

      {/* Mobile Menu */}
      {isMobile && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          padding: '20px',
          opacity: isMenuOpen ? 1 : 0,
          visibility: isMenuOpen ? 'visible' : 'hidden',
          transform: isMenuOpen ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'all 0.3s ease',
          borderRadius: '0 0 8px 8px'
        }}>
          <Link 
            to="/flashcard" 
            style={{ 
              display: 'block', 
              padding: '12px 0', 
              textDecoration: 'none', 
              color: isActiveLink('/flashcard') ? '#007bff' : '#333',
              borderBottom: '1px solid #f0f0f0'
            }}
            onClick={() => setIsMenuOpen(false)}
          >
            Flashcard
          </Link>
          
          {/* Mobile Practice Section */}
          <div style={{ borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ 
              padding: '12px 0', 
              color: isPracticeActive() ? '#007bff' : '#333',
              fontWeight: isPracticeActive() ? 'bold' : 'normal'
            }}>
              Practice
            </div>
            <div style={{ paddingLeft: '16px', paddingBottom: '8px' }}>
              <Link 
                to="/quiz" 
                style={{ 
                  display: 'block', 
                  padding: '8px 0', 
                  textDecoration: 'none', 
                  color: isActiveLink('/quiz') ? '#007bff' : '#666',
                  fontSize: '14px'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                📝 Quiz
              </Link>
              <Link 
                to="/roleplay" 
                style={{ 
                  display: 'block', 
                  padding: '8px 0', 
                  textDecoration: 'none', 
                  color: isActiveLink('/roleplay') ? '#007bff' : '#666',
                  fontSize: '14px'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                🎭 RolePlay
              </Link>
            </div>
          </div>
          
          <Link 
            to="/favourites" 
            style={{ 
              display: 'block', 
              padding: '12px 0', 
              textDecoration: 'none', 
              color: isActiveLink('/favourites') ? '#007bff' : '#333',
              borderBottom: '1px solid #f0f0f0'
            }}
            onClick={() => setIsMenuOpen(false)}
          >
            Favourites
          </Link>
          <Link 
            to="/learn" 
            style={{ 
              display: 'block', 
              padding: '12px 0', 
              textDecoration: 'none', 
              color: isActiveLink('/learn') ? '#007bff' : '#333'
            }}
            onClick={() => setIsMenuOpen(false)}
          >
            Learn
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Menu;