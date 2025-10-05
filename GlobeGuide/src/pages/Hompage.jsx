import Navbar from '../components/Navbar'
import './pagesCss/Hompage.css'
import Footer from '../components/Footer'
import RandomCountry from '../components/RandomCountry'
function Hompage() {
  return (
    <>
      <Navbar />
      <div className="hero-section">
        <div className="hero-content">
          <h1 className='hero-title'>Expand your knowledge with GlobeGuide</h1>
          <p className='hero-text'>Take your geography knowledge to the next level with fun games. Sign up now for <span style={{backgroundColor:"#cc1b1bff", padding:'5px', borderRadius:'10px'}}>free</span> and get started.</p>
        </div>
        <div className="hero-img-div">
          <img className="hero-img" src="/hero.webp" alt="Hero Image" />
          </div>
      </div>

      <div className='homepage-container'>
        <div className='games-intro-section'>
          <h2 className='games-intro-title'>Play & Learn: GlobeGuide Games</h2>
          <p className='games-intro-desc'>
            Challenge yourself with our fun and educational geography games!
          </p>
          <div className='games-cards-container'>
            <div className='game-card'>
              <img className='game-card-icon' src='/Flag.webp' alt='Flag Guess' />
              <h3>Flag Guess</h3>
              <p>Can you match the flag to the country? Test your flag knowledge!</p>
              <a href="/game/flag-guess" className="play-game-btn">Play</a>
            </div>
             <div className='game-card'>
              <img className='game-card-icon' src='/geo-duel.webp' alt='Geo Duel' />
              <h3>Geo Duel</h3>
              <p>Challenge your friends in a head-to-head geography battle!</p>
              <a href="/game/geo-duel" className="play-game-btn">Play</a>
            </div>
            <div className='game-card'>
              <img className='game-card-icon' src='/infoGuess.webp' alt='Country Info Guess' />
              <h3>Country Info Guess</h3>
              <p>Guess the country from clues about its capital, region, and more.</p>
              <a href="/game/country-info-guess" className="play-game-btn">Play</a>
            </div>
            <div className='game-card'>
              <img className='game-card-icon' src='/findOnMap.webp' alt='Find Country on Map' />
              <h3>Find Country on Map</h3>
              <p>Locate countries on the world map. How well do you know geography?</p>
              <a href="/game/find-country-on-map" className="play-game-btn">Play</a>
            </div>
            <div className='game-card'>
              <img className='game-card-icon' src='guessTheCapital.webp' alt='Guess the Capital' />
              <h3>Guess the Capital</h3>
              <p>Given a capital, can you pick the correct country? Try it now!</p>
              <a href="/game/guess-the-capital" className="play-game-btn">Play</a>
            </div>
          </div>
        </div>

      </div>
      <div className='random-country'>
        <h3 className='random-country-title'>Random Country</h3>
        <p className='random-country-description'>Discover a random country and learn about its culture, geography, and more!</p>
        <RandomCountry />
      </div>
      <div className='secondary-container'>
        <h3 className='secondary-title'>Play, Learn, and Conquer the Globe</h3>
        <p className='secondary-description'>
          Unlock a new level of knowledge with the ultimate interactive geography game. From pinpointing capital cities to identifying the most obscure flags, our modern, flat-design interface makes learning addictive. Track your progress with score pop-ups, timers, and progress bars, and challenge friends or family in a fun, competitive atmosphere. Turn curiosity into expertise and make the world your playground.
        </p>
          <img className='secondary-img' src='/con-1.png' alt='GlobeGuide Logo' />

      </div>
      <Footer />
    </>
  )
}

export default Hompage