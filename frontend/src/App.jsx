import { useState } from 'react'
import Flashcard from './components/flashcard'
import './App.css'
import Homepage from './pages/home'
import { Navbar } from './components/navbar'
import Learn from './pages/learn'
import Favourites from './pages/favourites'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
<Homepage />
{/* <Learn/> */}
{/* <Favourites /> */}
    </>
  )
}

export default App
