import React, { useState, useEffect } from "react";
import About from "../pages/About";
import Favourites from "../pages/favourites";
import "../style/navbar.css"
import Learn from "../pages/learn";
import { Link } from 'react-router-dom'

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