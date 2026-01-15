import React from 'react' 
import Home from "./pages/home"
import Quiz from './pages/Quiz'
import Flashcard from "./components/flashcard"
import Favourites from "./pages/favourites"
import "./App.css"
import Learn from './pages/learn';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Leaderboard from './pages/Leaderboard'
import Login from './Auth/Login'
import Signup from './Auth/Register'
import RolePlay from './pages/Roleplay'

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token")
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
    return (
    <Router>
      <div className='app-container'>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          {/* Legacy /landing route - redirect to dashboard */}
          <Route path="/landing" element={
            <Navigate to="/dashboard" replace />
          } />
          <Route path="/flashcard" element={
            <ProtectedRoute><Flashcard /></ProtectedRoute>
          } />
          <Route path="/quiz" element={
            <ProtectedRoute><Quiz /></ProtectedRoute>
          } />
          <Route path="/favourites" element={
            <ProtectedRoute><Favourites /></ProtectedRoute>
          } />
          <Route path="/learn" element={
            <ProtectedRoute><Learn /></ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute><Leaderboard /></ProtectedRoute>
          } />
          <Route path="/roleplay" element={
            <ProtectedRoute><RolePlay /></ProtectedRoute>
          } />
          
          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
