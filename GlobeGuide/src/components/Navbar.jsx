import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const games = [
  { label: 'Flag Guess', path: '/game/flag-guess', emoji: '🏳️' },
  { label: 'Country Info Guess', path: '/game/country-info-guess', emoji: '🌍' },
  { label: 'Geo Duel', path: '/game/geo-duel', emoji: '⚔️' },
  { label: 'Find Country on Map', path: '/game/find-country-on-map', emoji: '🗺️' },
  { label: 'Guess The Capital', path: '/game/guess-the-capital', emoji: '🏛️' },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/GlobeGuide Logo.webp"
              alt="GlobeGuide Logo"
              className="w-8 h-8 rounded-full group-hover:scale-110 transition-transform duration-200"
            />
            <span className="text-xl font-extrabold gradient-text tracking-tight">
              GlobeGuide
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 font-medium transition-all duration-200 text-sm"
            >
              Home
            </Link>

            {/* Games Dropdown */}
            <div className="relative" onMouseEnter={() => setGamesOpen(true)} onMouseLeave={() => setGamesOpen(false)}>
              <button className="flex items-center gap-1 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 font-medium transition-all duration-200 text-sm">
                Games
                <svg className={`w-4 h-4 transition-transform duration-200 ${gamesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {gamesOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 glass rounded-xl shadow-2xl py-2 border border-white/10 animate-fade-in">
                  {games.map((game) => (
                    <Link
                      key={game.path}
                      to={game.path}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-150"
                    >
                      <span className="text-base">{game.emoji}</span>
                      {game.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/world-map"
              className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 font-medium transition-all duration-200 text-sm"
            >
              World Map
            </Link>

            <Link
              to="/compare"
              className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 font-medium transition-all duration-200 text-sm"
            >
              Compare
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              to="/game/flag-guess"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-neon-green to-neon-blue text-navy-900 font-bold text-sm hover:scale-105 hover:shadow-neon-green transition-all duration-200"
            >
              Play Now 🚀
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-white/5 px-4 py-4 space-y-1 animate-fade-in">
          <Link to="/" className="block px-4 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 font-medium text-sm" onClick={() => setMenuOpen(false)}>Home</Link>
          <div className="px-4 py-2 text-xs text-slate-500 font-semibold uppercase tracking-wider">Games</div>
          {games.map((game) => (
            <Link
              key={game.path}
              to={game.path}
              className="flex items-center gap-2 px-6 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 text-sm"
              onClick={() => setMenuOpen(false)}
            >
              <span>{game.emoji}</span> {game.label}
            </Link>
          ))}
          <Link to="/world-map" className="block px-4 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 font-medium text-sm" onClick={() => setMenuOpen(false)}>World Map</Link>
          <Link to="/compare" className="block px-4 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 font-medium text-sm" onClick={() => setMenuOpen(false)}>Compare</Link>
          <Link to="/game/flag-guess" className="block mt-2 text-center px-4 py-3 rounded-xl bg-gradient-to-r from-neon-green to-neon-blue text-navy-900 font-bold text-sm" onClick={() => setMenuOpen(false)}>
            Play Now 🚀
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;