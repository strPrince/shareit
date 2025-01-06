import { useState } from 'react'
import { BrowserRouter as Router, Route, BrowserRouter, Routes } from 'react-router-dom'

import ShareIt from '../pages/shareit'
import './App.css'


function App() {
  const [count, setCount] = useState(0)

  return (
   
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<ShareIt />} />
      
    </Routes>

    </BrowserRouter>



  )
}

export default App
