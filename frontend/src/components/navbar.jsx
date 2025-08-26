import React, { useState }  from "react";
import "../style/navbar.css"
import { NavLink } from 'react-router-dom'


 const Navbar = () =>{ 
  const [isopen , setIsopen] = useState(false)

  return (
     <>
     <nav className="navbar"> 
        <div className="nav-brand"> 
          <span className="nav-title">NepaliLearn</span> 
<button className="menu" 
onClick={() => setIsopen(!isopen)}
aria-label = "Toggle menu"
>
☰
</button>
          </div> 
          <div className={`nav-links ${isopen ? "open" :""}`}> 
            <NavLink className={({isActive}) =>

  isActive ? "nav-link active-link" : "nav-link"
             }
             to="/" onClick={() => setIsopen(false)}> 
            <i className="fa-regular fa-house-user"></i>
            Home
            </NavLink >
             <NavLink className={({isActive}) =>

  isActive ? "nav-link active-link" : "nav-link"
             } to="/login" onClick={() => setIsopen(false)}> 
             <i className="fa-regular fa-user"></i>Login</NavLink >
              <NavLink className={({isActive}) =>

  isActive ? "nav-link active-link" : "nav-link"
             } to="/signup" onClick={() => setIsopen(false)}> <i class="fa-solid fa-user-plus"></i> Signup </NavLink > 
           
              </div> 
              </nav> 
      
              </> 
              ) 

            }

export default Navbar
