import React from 'react' 
import Home from "./pages/home"
import Quiz from './pages/Quiz'
// import Menu from "./components/menu"
// import Navbar from "./components/navbar"
import Flashcard from "./components/flashcard"
import Favourites from "./pages/favourites"
import "./App.css"
// import Landing from './pages/Landing'
import Learn from './pages/learn';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import CreateStory from './pages/Createstory'
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
       <Route path="/createstory" element={<CreateStory />} />
        </Routes>
      </div>
    </Router>
  );

}

export default App
