import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Hompage from './pages/Hompage'
import ContinentPage from './pages/ContinentPage'
import WorldMap from './pages/WorldMap'
import FlagGuess from './games/FlagGuess'
import CountryInfoGuess from './games/CountryInfoGuess'
import GeoDuel from './games/GeoDuel'
import CountryCompare from './pages/CountryCompare'
import FindCountryOnMap from './games/FindCountryOnMap'
import GuessTheCapital from './games/GuessTheCapital'
import CountryComparePage from './pages/CountryComparePage'
import './App.css'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hompage />} />
        <Route path="/continent/:name" element={<ContinentPage />} />
        <Route path="/game/flag-guess" element={<FlagGuess />} />
        <Route path="/game/country-info-guess" element={<CountryInfoGuess />} />
        <Route path='/game/geo-duel' element={<GeoDuel />} />
        <Route path='/country-compare' element={<CountryCompare />} />
        <Route path='/game/find-country-on-map' element={<FindCountryOnMap />} />
        <Route path="/world-map" element={<WorldMap />} />
        <Route path='/game/guess-the-capital' element={<GuessTheCapital />} />
        <Route path='/compare' element={<CountryComparePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;