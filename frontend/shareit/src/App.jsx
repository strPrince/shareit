import { useState } from 'react'
import { BrowserRouter as Router, Route, BrowserRouter, Routes } from 'react-router-dom'
import Home from '../pages/home'
import ShareIt from '../pages/shareit'
import './App.css'


function App() {
  const [count, setCount] = useState(0)

  return (
   
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/share" element={<ShareIt />} />
    </Routes>

    </BrowserRouter>



  )
}

export default App
