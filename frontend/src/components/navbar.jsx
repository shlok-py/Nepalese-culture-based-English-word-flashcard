import React  from "react";
import "../style/navbar.css"
// import { NavLink } from 'react-router-dom'


//  const Navbar = () =>{ 

//   return (
//      <>
//      <nav className="navbar"> 
//         <div className="nav-brand"> 
//           <span className="nav-title">NeplaiLearn</span> 

//           </div> 
//           <div className="nav-links"> 
//             <NavLink className={({isActive}) =>

//   isActive ? "nav-link active-link" : "nav-link"
//              }
//              to="/"> 
//             <i className="fa-regular fa-house-user"></i>
//             Home</NavLink >
//              <NavLink className={({isActive}) =>

//   isActive ? "nav-link active-link" : "nav-link"
//              } to="/learn"> 
//              <i className="fa-regular fa-book-open"></i>Learn</NavLink >
//               <NavLink className={({isActive}) =>

//   isActive ? "nav-link active-link" : "nav-link"
//              } to="/favourites"> <i className = "fa-heart fa-regular"></i> Favourites </NavLink > 
//               <NavLink className={({isActive}) =>

//   isActive ? "nav-link active-link" : "nav-link"
//              } to="/about"> <i className="fa-regular fa-star"></i>About </NavLink > 
//               </div> 
//               </nav> 
      
//               </> 
//               ) 

//             }

// export default Navbar


export const Navbar = () =>{ 
  return (
     <>
      <nav className="navbar"> 
        <div class="nav-brand"> 
          <span class="nav-title">NeplaiLearn</span> 
          {/* <span class="nav-subtitle"> Cultural Flashcards</span> */} 
          </div> 
          <div className="nav-links"> <a class="nav-link active" aria-current="page" href="#"> 
            <i class="fa-regular fa-house-user"></i>Home</a>
             <a class="nav-link" href="/pages/About.jsx"> <i class="fa-regular fa-book-open"></i>Learn</a>
              <a class="nav-link" href="#"> <i class = "fa-heart fa-regular"></i>Favourites</a> 
              <a class="nav-link" href="#"> <i class="fa-regular fa-star"></i>About</a> 
              </div> </nav> </> ) }