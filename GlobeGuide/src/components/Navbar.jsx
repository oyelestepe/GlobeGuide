import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const games = [
  { label: 'Flag Guess', path: '/game/flag-guess', emoji: '🏳️' },
  { label: 'Country Info Guess', path: '/game/country-info-guess', emoji: '🌍' },
  { label: 'Geo Duel', path: '/game/geo-duel', emoji: '⚔️' },
  { label: 'Find Country on Map', path: '/game/find-country-on-map', emoji: '🗺️' },
  { label: 'Guess The Capital', path: '/game/guess-the-capital', emoji: '🏛️' },
];

function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      id="navbar-theme-toggle"
      onClick={toggleTheme}
      className={`theme-toggle ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      {isDark ? (
        /* Sun icon */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        /* Moon icon */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-theme-subtle">
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
              className="px-4 py-2 rounded-lg text-theme-secondary hover:text-theme-primary hover:bg-black/5 dark:hover:bg-white/5 font-medium transition-all duration-200 text-sm"
            >
              Home
            </Link>

            {/* Games Dropdown */}
            <div className="relative" onMouseEnter={() => setGamesOpen(true)} onMouseLeave={() => setGamesOpen(false)}>
              <button className="flex items-center gap-1 px-4 py-2 rounded-lg text-theme-secondary hover:text-theme-primary hover:bg-black/5 dark:hover:bg-white/5 font-medium transition-all duration-200 text-sm">
                Games
                <svg className={`w-4 h-4 transition-transform duration-200 ${gamesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {gamesOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 glass rounded-xl shadow-2xl py-2 border border-theme-light animate-fade-in">
                  {games.map((game) => (
                    <Link
                      key={game.path}
                      to={game.path}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-theme-secondary hover:text-theme-primary hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-150"
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
              className="px-4 py-2 rounded-lg text-theme-secondary hover:text-theme-primary hover:bg-black/5 dark:hover:bg-white/5 font-medium transition-all duration-200 text-sm"
            >
              World Map
            </Link>

            <Link
              to="/country-compare"
              className="px-4 py-2 rounded-lg text-theme-secondary hover:text-theme-primary hover:bg-black/5 dark:hover:bg-white/5 font-medium transition-all duration-200 text-sm"
            >
              Compare
            </Link>
          </div>

          {/* Right side: CTA + Theme Toggle */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/game/flag-guess"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-neon-green to-neon-blue text-navy-900 font-bold text-sm hover:scale-105 hover:shadow-neon-green transition-all duration-200"
            >
              Play Now 🚀
            </Link>
          </div>

          {/* Mobile: Theme Toggle + Hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 rounded-lg text-theme-secondary hover:text-theme-primary hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle mobile menu"
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
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-theme-subtle px-4 py-4 space-y-1 animate-fade-in">
          <Link to="/" className="block px-4 py-2.5 rounded-lg text-theme-secondary hover:text-theme-primary hover:bg-black/5 dark:hover:bg-white/5 font-medium text-sm" onClick={() => setMenuOpen(false)}>Home</Link>
          <div className="px-4 py-2 text-xs text-theme-muted font-semibold uppercase tracking-wider">Games</div>
          {games.map((game) => (
            <Link
              key={game.path}
              to={game.path}
              className="flex items-center gap-2 px-6 py-2 rounded-lg text-theme-secondary hover:text-theme-primary hover:bg-black/5 dark:hover:bg-white/5 text-sm"
              onClick={() => setMenuOpen(false)}
            >
              <span>{game.emoji}</span> {game.label}
            </Link>
          ))}
          <Link to="/world-map" className="block px-4 py-2.5 rounded-lg text-theme-secondary hover:text-theme-primary hover:bg-black/5 dark:hover:bg-white/5 font-medium text-sm" onClick={() => setMenuOpen(false)}>World Map</Link>
          <Link to="/country-compare" className="block px-4 py-2.5 rounded-lg text-theme-secondary hover:text-theme-primary hover:bg-black/5 dark:hover:bg-white/5 font-medium text-sm" onClick={() => setMenuOpen(false)}>Compare</Link>
          <Link to="/game/flag-guess" className="block mt-2 text-center px-4 py-3 rounded-xl bg-gradient-to-r from-neon-green to-neon-blue text-navy-900 font-bold text-sm" onClick={() => setMenuOpen(false)}>
            Play Now 🚀
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;