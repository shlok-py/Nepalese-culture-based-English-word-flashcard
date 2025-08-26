import React from 'react' 
import Home from "./pages/home"
import Quiz from './pages/Quiz'
import Menu from "./components/menu"
import Navbar from "./components/navbar"
import Flashcard from "./components/flashcard"
import Favourites from "./pages/favourites"
import "./App.css"
// import Landing from './pages/Landing'
import Learn from './pages/learn';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
function App() {



    return (
      
    <Router>
      <div className='app-container' >
       
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flashcard" element={<Flashcard />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/landing" element={<Landing />} />
       
        </Routes>
      </div>
    </Router>
  );

}

export default App
