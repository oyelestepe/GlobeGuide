import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Footer() {
  const { isDark, toggleTheme } = useTheme();

  const games = [
    { label: 'Flag Guess', path: '/game/flag-guess' },
    { label: 'Geo Duel', path: '/game/geo-duel' },
    { label: 'Country Info Guess', path: '/game/country-info-guess' },
    { label: 'Find on Map', path: '/game/find-country-on-map' },
    { label: 'Guess the Capital', path: '/game/guess-the-capital' },
  ];

  return (
    <footer className="relative mt-auto border-t border-theme-subtle">
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-neon-green to-transparent opacity-40" />

      <div className="glass py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <img src="/GlobeGuide Logo.webp" alt="GlobeGuide Logo" className="w-8 h-8 rounded-full" />
              <span className="text-xl font-extrabold gradient-text">GlobeGuide</span>
            </Link>
            <p className="text-theme-secondary text-sm leading-relaxed">
              Make learning geography fun. Play games, discover countries, and conquer the globe all for free.
            </p>
          </div>

          {/* Games */}
          <div className="space-y-4">
            <h4 className="text-theme-primary font-bold text-sm uppercase tracking-wider">Games</h4>
            <ul className="space-y-2">
              {games.map((g) => (
                <li key={g.path}>
                  <Link
                    to={g.path}
                    className="text-theme-secondary hover:text-neon-green text-sm transition-colors duration-150"
                  >
                    {g.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="text-theme-primary font-bold text-sm uppercase tracking-wider">Connect</h4>
            <p className="text-theme-secondary text-sm">support@globeguide.com</p>
            <div className="flex gap-4">
              {[
                { href: 'https://facebook.com', label: 'Facebook', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                { href: 'https://twitter.com', label: 'Twitter', icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                { href: 'https://instagram.com', label: 'Instagram', icon: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01M7.8 2h8.4A5.8 5.8 0 0122 7.8v8.4A5.8 5.8 0 0116.2 22H7.8A5.8 5.8 0 012 16.2V7.8A5.8 5.8 0 017.8 2z' },
              ].map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg glass-light text-theme-secondary hover:text-neon-green hover:border-neon-green/30 border border-theme-subtle transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="space-y-4">
            <h4 className="text-theme-primary font-bold text-sm uppercase tracking-wider">Appearance</h4>
            <p className="text-theme-secondary text-xs leading-relaxed">
              Switch between dark and light mode to match your preference.
            </p>
            <button
              id="footer-theme-toggle"
              onClick={toggleTheme}
              className="flex items-center gap-3 px-4 py-3 rounded-xl glass-light border border-theme-light hover:border-neon-green/40 hover:text-neon-green transition-all duration-200 w-full group"
            >
              {isDark ? (
                <>
                  {/* Sun */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neon-yellow flex-shrink-0">
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
                  <span className="text-sm font-semibold text-theme-secondary group-hover:text-neon-green">Switch to Light Mode</span>
                </>
              ) : (
                <>
                  {/* Moon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neon-purple flex-shrink-0">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                  <span className="text-sm font-semibold text-theme-secondary group-hover:text-neon-green">Switch to Dark Mode</span>
                </>
              )}
            </button>
          </div>

        </div>

        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-theme-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-theme-muted text-xs">© 2025 GlobeGuide. All rights reserved.</p>
          <p className="text-theme-muted text-xs">Made with 🌍 for curious minds everywhere</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;