import React from 'react'
import Navbar from '../components/Navbar'
import WorldMap from './WorldMap'
import './pagesCss/Hompage.css'
import Footer from '../components/Footer'
function Hompage() {
  return (
    <>
      <Navbar />
      <WorldMap />
      <div className='homepage-container'>
        <h3 className='homepage-title'>Welcome to GlobeGuide</h3>
        <p className='homepage-description'>
          Explore the world through interactive maps and engaging games. Test your knowledge of countries, flags, and geography while having fun!
        </p>
        <div className='games-section'>
          <div className='games-wrapper'>
            <img className='games-img' src='https://picsum.photos/200/300'></img>
            <p className='games-p'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in ex ut elit aliquet auctor vitae eu sem. Morbi et.</p>
          </div>

          <div className='games-wrapper'>
            <img className='games-img' src='https://picsum.photos/200/300'></img>
            <p className='games-p'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in ex ut elit aliquet auctor vitae eu sem. Morbi et.</p>
          </div>

          <div className='games-wrapper'>
            <img className='games-img' src='https://picsum.photos/200/300'></img>
            <p className='games-p'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in ex ut elit aliquet auctor vitae eu sem. Morbi et.</p>
          </div>

          <div className='games-wrapper'>
            <img className='games-img' src='https://picsum.photos/200/300'></img>
            <p className='games-p'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in ex ut elit aliquet auctor vitae eu sem. Morbi et.</p>
          </div>
        </div>
      </div>
      <div className='secondary-container'>
      <img className='secondary-img' src='https://picsum.photos/200/300' alt='GlobeGuide Logo' />
        <h3 className='secondary-title'>About GlobeGuide</h3>
        <p className='secondary-description'>
          GlobeGuide is your go-to platform for exploring the world. Whether you're a geography enthusiast or just looking to have some fun, we have something for everyone. Join us on this journey and discover the beauty of our planet!
        </p>
      </div>
      <Footer />
    </>
  )
}

export default Hompage