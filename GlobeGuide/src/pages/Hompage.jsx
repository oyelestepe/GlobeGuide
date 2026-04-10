import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RandomCountry from '../components/RandomCountry';

const games = [
  {
    id: 'flag-guess',
    title: 'Flag Guess',
    description: 'Can you match the flag to the country? Put your knowledge to the test!',
    emoji: '🏳️',
    path: '/game/flag-guess',
    img: '/flag-guess.png',
    color: 'from-blue-500/20 to-blue-600/10',
    accent: '#38bdf8',
    badge: 'Popular',
  },
  {
    id: 'geo-duel',
    title: 'Geo Duel',
    description: 'Challenge your friends in a head-to-head geography battle!',
    emoji: '⚔️',
    path: '/game/geo-duel',
    img: '/geo-duel.png',
    color: 'from-red-500/20 to-orange-500/10',
    accent: '#fb923c',
    badge: 'Multiplayer',
  },
  {
    id: 'country-info-guess',
    title: 'Country Info Guess',
    description: 'Guess the country from clues about its capital, region, and more.',
    emoji: '🌍',
    path: '/game/country-info-guess',
    img: '/country-info-guess.png',
    color: 'from-green-500/20 to-emerald-500/10',
    accent: '#22d35e',
    badge: 'Educational',
  },
  {
    id: 'find-country-on-map',
    title: 'Find on Map',
    description: 'Locate countries on the world map. How well do you know geography?',
    emoji: '🗺️',
    path: '/game/find-country-on-map',
    img: '/find-on-map.png',
    color: 'from-purple-500/20 to-violet-500/10',
    accent: '#a78bfa',
    badge: 'Visual',
  },
  {
    id: 'guess-the-capital',
    title: 'Guess the Capital',
    description: 'Given a capital city, can you pick the correct country? Try it now!',
    emoji: '🏛️',
    path: '/game/guess-the-capital',
    img: '/guess-the-capital.png',
    color: 'from-yellow-500/20 to-amber-500/10',
    accent: '#fbbf24',
    badge: 'Classic',
  },
  {
  id: 'country-compare',
  title: 'Country Compare',
  description: 'Which country is bigger? More populated? Compare nations side by side!',
  emoji: '📊',
  path: '/country-compare',
  img: '/country-compare.png',
  color: 'from-pink-500/20 to-rose-500/10',
  accent: '#f472b6',
  badge: 'Compare',
},
];

const features = [
  {
    emoji: '🎮',
    title: 'Learn by Playing',
    desc: 'Games make geography stick. Earn points, beat your high score, and have fun while learning.',
    color: 'text-neon-green',
  },
  {
    emoji: '🌐',
    title: '195+ Countries',
    desc: 'Every sovereign nation on Earth is covered from the biggest to the most remote.',
    color: 'text-neon-blue',
  },
  {
    emoji: '🔥',
    title: '100% Free Forever',
    desc: 'No paywalls, no sign-ups required. Just open the app and start playing instantly.',
    color: 'text-neon-coral',
  },
];

function Homepage() {
  return (
    <div className="min-h-screen flex flex-col bg-navy-900 text-white font-sans">
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden hero-bg min-h-[90vh] flex items-center">
        {/* Floating background blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-neon-green/5 rounded-full blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl animate-float-slow pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/3 rounded-full blur-3xl pointer-events-none" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full border border-neon-green/20 mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-neon-green tracking-wider uppercase">5 Free Games · No Sign-up Needed</span>
          </div>

          {/* Globe Emoji */}
          <div className="text-7xl sm:text-8xl mb-6 animate-float inline-block">🌍</div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6 animate-slide-up">
            Conquer the
            <span className="block gradient-text">Globe</span>
            One Game at a Time.
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in">
            The most fun way to learn geography. Play flag quizzes, find countries on maps, duel your friends
            all completely{' '}
            <span className="text-neon-green font-bold px-1.5 py-0.5 bg-neon-green/10 rounded">free</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Link
              to="/game/flag-guess"
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-neon-green to-neon-blue text-navy-900 font-black text-lg hover:scale-105 hover:shadow-neon-green transition-all duration-200 shadow-lg"
            >
              <span>🚀</span> Start Playing
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a
              href="#games"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl glass border border-white/10 text-white font-semibold text-lg hover:border-neon-green/30 hover:bg-white/5 transition-all duration-200"
            >
              Explore Games 🎮
            </a>
          </div>

          {/* Hero image */}
          <div className="mt-16 max-w-3xl mx-auto relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-green/30 via-neon-blue/30 to-neon-purple/30 rounded-3xl blur-lg opacity-60" />
            <img
              src="/hero.png"
              alt="GlobeGuide gameplay preview"
              className="relative w-full rounded-2xl border border-white/10 shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-y border-white/5 bg-navy-800/50">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: '5', label: 'Mini Games', emoji: '🎮' },
              { value: '195+', label: 'Countries', emoji: '🌍' },
              { value: '100%', label: 'Free', emoji: '🆓' },
              { value: '∞', label: 'Replayable', emoji: '🔄' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <span className="text-2xl">{stat.emoji}</span>
                <span className="text-2xl sm:text-3xl font-black gradient-text">{stat.value}</span>
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GAMES SECTION ── */}
      <section id="games" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-neon-green uppercase tracking-widest mb-3">🎲 Pick Your Game</p>
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              Play & Learn:{' '}
              <span className="gradient-text">GlobeGuide Games</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Challenge yourself with our fun and educational geography games choose your adventure!
            </p>
          </div>

          {/* Game Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <div
                key={game.id}
                className="group relative card-bg rounded-2xl border border-white/8 hover:border-white/20 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover flex flex-col"
                style={{ '--accent': game.accent }}
              >
                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                  style={{ boxShadow: `inset 0 0 60px ${game.accent}15` }}
                />

                {/* Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                    style={{ backgroundColor: `${game.accent}20`, color: game.accent, border: `1px solid ${game.accent}40` }}
                  >
                    {game.badge}
                  </span>
                </div>

                {/* Image area */}
                <div className={`relative bg-gradient-to-br ${game.color} p-8 flex items-center justify-center min-h-[160px]`}>
                  <img
                    src={game.img}
                    alt={game.title}
                    className="w-28 h-28 object-contain drop-shadow-2xl group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{game.emoji}</span>
                    <h3 className="text-lg font-bold text-white">{game.title}</h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed flex-1">{game.description}</p>

                  <Link
                    to={game.path}
                    className="mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      background: `linear-gradient(135deg, ${game.accent}30, ${game.accent}15)`,
                      color: game.accent,
                      border: `1px solid ${game.accent}30`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `linear-gradient(135deg, ${game.accent}50, ${game.accent}30)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `linear-gradient(135deg, ${game.accent}30, ${game.accent}15)`;
                    }}
                  >
                    Play Now
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COUNTRY OF THE DAY ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-navy-800/30 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-neon-yellow uppercase tracking-widest mb-3">🌟 Daily Discovery</p>
            <h2 className="text-3xl sm:text-4xl font-black mb-3">
              Country of the Day
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              A new country is featured every day. Discover its culture, geography, and neighbours!
            </p>
          </div>
          <RandomCountry />
        </div>
      </section>

      {/* ── FEATURES / WHY GLOBEGUIDE ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-neon-purple uppercase tracking-widest mb-3">✨ Why GlobeGuide?</p>
            <h2 className="text-4xl sm:text-5xl font-black">
              Play, Learn &{' '}
              <span className="gradient-text-warm">Conquer</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group card-bg rounded-2xl border border-white/8 p-8 text-center hover:border-white/15 hover:-translate-y-1 transition-all duration-300 hover:shadow-card"
              >
                <div className="text-5xl mb-4 inline-block group-hover:scale-110 group-hover:animate-bounce-light transition-transform duration-300">
                  {f.emoji}
                </div>
                <h3 className={`text-xl font-black mb-3 ${f.color}`}>{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORLD MAP CTA TEASER ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-navy-800/30 border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-5xl mb-4">🗺️</p>
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Explore the{' '}
            <span className="gradient-text">Interactive World Map</span>
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Click on any country to learn facts, see its flag, and explore its neighbours all on a beautiful interactive map.
          </p>
          <Link
            to="/world-map"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl glass border border-neon-blue/30 text-neon-blue font-bold hover:bg-neon-blue/10 hover:scale-105 transition-all duration-200"
          >
            Open World Map
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── FINAL CTA BANNER ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-green/5 via-transparent to-neon-blue/5 pointer-events-none" />
        <div className="absolute top-8 left-10 text-5xl animate-float opacity-30 pointer-events-none">🌏</div>
        <div className="absolute bottom-8 right-10 text-5xl animate-float-slow opacity-30 pointer-events-none">⭐</div>

        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black mb-5 leading-tight">
            Ready to Conquer
            <span className="block gradient-text">the Globe?</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of learners already exploring the world through games. No account needed just click and play!
          </p>
          <Link
            to="/game/flag-guess"
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-neon-green to-neon-blue text-navy-900 font-black text-xl hover:scale-105 hover:shadow-neon-green transition-all duration-200 shadow-lg animate-pulse-glow"
          >
            <span>🚀</span>
            Start Playing It's Free!
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Homepage;