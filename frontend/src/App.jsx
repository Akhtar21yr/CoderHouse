import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './pages/Home/Home'
import Navigation from './components/shared/Navigation/Navigation'



const App = () => {
  return (
    <BrowserRouter>
    <Navigation/>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
