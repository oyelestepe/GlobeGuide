import React from 'react';
import { Link } from 'react-router-dom';
import './componentsCss/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div >
        <Link className="navbar-logo" to="/">GlobeGuide</Link>
      </div>
      <ul className="navbar-ul">
        <li className='navbar-li'>
          <Link to="/">Home</Link>
        </li>
        <li className="dropdown">
          <span>Games</span>
          <ul className="dropdown-menu">
            <li className='navbar-li'>
              <Link to="/game/flag-guess">Flag Guess</Link>
            </li>
            <li className='navbar-li'>
              <Link to="/game/country-info-guess">Country Info Guess</Link>
            </li>
            <li className='navbar-li'>
              <Link to="/game/country-bluff">Country Bluff</Link>
            </li>
            <li className='navbar-li'>
              <Link to="/game/find-country-on-map">Find Country on Map</Link>
            </li>
          </ul>
        </li>
        <li className='navbar-li'>
          <Link to="/world-map">World Map</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;