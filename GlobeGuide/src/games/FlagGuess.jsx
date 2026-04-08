import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from "../components/Footer";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

const ACCENT = '#38bdf8';

function FlagGuess() {
  const [countries, setCountries] = useState([]);
  const [question, setQuestion] = useState(null);
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const [wrongCount, setWrongCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [region, setRegion] = useState("all");
  const [askedCountries, setAskedCountries] = useState(new Set());
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef();

  useEffect(() => {
    if (!region) return;
    const fetchCountries = async () => {
      try {
        const endpoint =
          region === "all"
            ? "https://restcountries.com/v3.1/all?fields=name,flags,cca3,region"
            : `https://restcountries.com/v3.1/region/${region}?fields=name,flags,cca3,region`;
        const response = await fetch(endpoint);
        const data = await response.json();
        setCountries(data);
        setAskedCountries(new Set());
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, [region]);

  useEffect(() => {
    if (!gameStarted || gameOver || !question) return;
    if (timer === 0) { handleGuess(null); return; }
    timerRef.current = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timer, question, gameOver, gameStarted]);

  const generateQuestion = (data = countries) => {
    const remaining = data.filter((c) => !askedCountries.has(c.cca3));
    if (remaining.length === 0) { setGameOver(true); return; }
    const correct = remaining[getRandomInt(remaining.length)];
    let options = [correct];
    while (options.length < 4) {
      const rand = data[getRandomInt(data.length)];
      if (!options.some((c) => c.cca3 === rand.cca3)) options.push(rand);
    }
    setTransitioning(true);
    setTimeout(() => {
      setAskedCountries((prev) => new Set(prev).add(correct.cca3));
      setTimer(10);
      setSelected(null);
      setQuestion(correct);
      setChoices(shuffle(options));
      setTransitioning(false);
    }, 350);
  };

  const handleGuess = (country) => {
    if (selected || gameOver) return;
    setSelected(country || {});
    const isCorrect = country && country.cca3 === question.cca3;
    if (isCorrect) {
      setScore((s) => s + 1);
      setTimeout(() => generateQuestion(), 1000);
    } else {
      const newWrong = wrongCount + 1;
      setWrongCount(newWrong);
      if (newWrong >= 3) setTimeout(() => setGameOver(true), 1000);
      else setTimeout(() => generateQuestion(), 1000);
    }
  };

  const handleRestart = () => {
    setScore(0); setWrongCount(0); setGameOver(false);
    setTimer(10); setSelected(null); setGameStarted(false);
    setQuestion(null); setAskedCountries(new Set());
  };

  const timerPct = (timer / 10) * 100;
  const timerColor = timer <= 3 ? '#fb923c' : ACCENT;

  // ── START SCREEN ──
  if (!gameStarted) {
    return (
      <div className="min-h-screen flex flex-col bg-navy-900 text-white font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md">
            <div className="card-bg rounded-3xl border border-white/10 p-10 text-center shadow-2xl">
              <div className="text-7xl mb-4 animate-float inline-block">🏳️</div>
              <h1 className="text-3xl font-black mb-2">Flag Guess</h1>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                A flag appears you have 10 seconds to pick the right country. 3 wrong answers and it's game over!
              </p>

              <div className="mb-6 text-left">
                <label className="block text-xs font-bold text-neon-blue uppercase tracking-widest mb-2">
                  Select Region
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-navy-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-blue/50 transition-colors"
                >
                  <option value="all">🌍 All Continents</option>
                  <option value="africa">🌍 Africa</option>
                  <option value="americas">🌎 Americas</option>
                  <option value="asia">🌏 Asia</option>
                  <option value="europe">🇪🇺 Europe</option>
                  <option value="oceania">🏝️ Oceania</option>
                </select>
              </div>

              <button
                onClick={() => { setGameStarted(true); generateQuestion(); }}
                disabled={countries.length === 0}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-navy-900 text-lg transition-all duration-200 hover:scale-105 hover:shadow-neon-blue disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: `linear-gradient(135deg, ${ACCENT}, #818cf8)` }}
              >
                🚀 Start Game
              </button>

              <Link to="/" className="mt-4 block text-xs text-slate-500 hover:text-slate-300 transition-colors">
                ← Back to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── LOADING ──
  if (!question) {
    return (
      <div className="min-h-screen flex flex-col bg-navy-900 text-white font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl animate-spin-slow mb-4">🌍</div>
            <p className="text-slate-400">Loading countries…</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── GAME OVER ──
  if (gameOver) {
    return (
      <div className="min-h-screen flex flex-col bg-navy-900 text-white font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md">
            <div className="card-bg rounded-3xl border border-white/10 p-10 text-center shadow-2xl">
              <div className="text-7xl mb-4">😵</div>
              <h2 className="text-3xl font-black mb-2">Game Over!</h2>
              <p className="text-slate-400 mb-6">You've used all your lives.</p>
              <div className="glass rounded-2xl p-6 mb-8 border border-neon-blue/20">
                <p className="text-xs text-neon-blue uppercase font-bold tracking-widest mb-1">Final Score</p>
                <p className="text-6xl font-black gradient-text">{score}</p>
              </div>
              <button
                onClick={handleRestart}
                className="w-full py-4 rounded-2xl font-black text-navy-900 text-lg transition-all duration-200 hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${ACCENT}, #818cf8)` }}
              >
                🔄 Play Again
              </button>
              <Link to="/" className="mt-4 block text-xs text-slate-500 hover:text-slate-300 transition-colors">
                ← Back to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── GAME ──
  return (
    <div className="min-h-screen flex flex-col bg-navy-900 text-white font-sans">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          {/* HUD */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className={`text-xl transition-all ${i < wrongCount ? 'opacity-30 grayscale' : ''}`}>
                  ❤️
                </span>
              ))}
            </div>
            <div className="glass rounded-xl px-4 py-1.5 border border-neon-blue/20">
              <span className="text-xs text-neon-blue font-bold uppercase tracking-widest">Score </span>
              <span className="text-xl font-black gradient-text">{score}</span>
            </div>
          </div>

          {/* Timer bar */}
          <div className="relative h-2 bg-white/5 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${timerPct}%`, background: timerColor, boxShadow: `0 0 10px ${timerColor}80` }}
            />
          </div>

          {/* Card */}
          <div
            className={`card-bg rounded-3xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-300 ${transitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
          >
            {/* Flag area */}
            <div className="flex items-center justify-center bg-white/5 p-8 min-h-[200px] relative">
              <div className="absolute top-3 right-4 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${ACCENT}20`, color: ACCENT, border: `1px solid ${ACCENT}40` }}>
                {timer}s
              </div>
              <img
                src={question.flags.png}
                alt="Flag"
                className="max-h-40 max-w-xs w-auto object-contain drop-shadow-2xl rounded-lg"
              />
            </div>

            {/* Question */}
            <div className="px-8 py-5">
              <p className="text-center text-sm font-semibold text-slate-400 mb-4 uppercase tracking-widest">Which country does this flag belong to?</p>
              <div className="grid grid-cols-2 gap-3">
                {choices.map((country) => {
                  const isCorrect = selected && country.cca3 === question.cca3;
                  const isWrong = selected && country.cca3 === (selected.cca3 || "") && country.cca3 !== question.cca3;
                  return (
                    <button
                      key={country.cca3}
                      onClick={() => handleGuess(country)}
                      disabled={!!selected}
                      className={`py-3 px-4 rounded-xl font-semibold text-sm border transition-all duration-200 hover:scale-[1.02] disabled:cursor-not-allowed
                        ${isCorrect ? 'border-neon-green/60 bg-neon-green/15 text-neon-green' :
                          isWrong ? 'border-red-500/60 bg-red-500/15 text-red-400' :
                          'border-white/10 bg-white/5 text-white hover:border-neon-blue/40 hover:bg-neon-blue/10'}`}
                    >
                      {country.name.common}
                    </button>
                  );
                })}
              </div>
              {selected && (
                <div className={`mt-4 text-center text-sm font-bold py-2 rounded-xl ${selected.cca3 === question.cca3 ? 'text-neon-green bg-neon-green/10' : 'text-red-400 bg-red-500/10'}`}>
                  {selected.cca3 === question.cca3 ? '✅ Correct!' : `❌ It was ${question.name.common}`}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default FlagGuess;