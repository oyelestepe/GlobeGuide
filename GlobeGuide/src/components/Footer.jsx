import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const games = [
    { label: 'Flag Guess', path: '/game/flag-guess' },
    { label: 'Geo Duel', path: '/game/geo-duel' },
    { label: 'Country Info Guess', path: '/game/country-info-guess' },
    { label: 'Find on Map', path: '/game/find-country-on-map' },
    { label: 'Guess the Capital', path: '/game/guess-the-capital' },
  ];

  return (
    <footer className="relative mt-auto border-t border-white/5">
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-neon-green to-transparent opacity-40" />

      <div className="glass py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <img src="/GlobeGuide Logo.webp" alt="GlobeGuide Logo" className="w-8 h-8 rounded-full" />
              <span className="text-xl font-extrabold gradient-text">GlobeGuide</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Make learning geography fun. Play games, discover countries, and conquer the globe all for free.
            </p>
          </div>

          {/* Games */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Games</h4>
            <ul className="space-y-2">
              {games.map((g) => (
                <li key={g.path}>
                  <Link
                    to={g.path}
                    className="text-slate-400 hover:text-neon-green text-sm transition-colors duration-150"
                  >
                    {g.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Connect</h4>
            <p className="text-slate-400 text-sm">support@globeguide.com</p>
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
                  className="w-9 h-9 flex items-center justify-center rounded-lg glass-light text-slate-400 hover:text-neon-green hover:border-neon-green/30 border border-white/5 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

        </div>

        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">© 2025 GlobeGuide. All rights reserved.</p>
          <p className="text-slate-500 text-xs">Made with 🌍 for curious minds everywhere</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;