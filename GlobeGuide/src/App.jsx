import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ContinentPage from './pages/ContinentPage'
import WorldMap from './pages/WorldMap'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div>
            <h1>Ülkeler Rehberi</h1>
            <WorldMap />
          </div>
        } />
        <Route path="/continent/:name" element={<ContinentPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;