import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

const ACCENT = '#fbbf24';

function GuessTheCapital() {
  const [countries, setCountries] = useState([]);
  const [question, setQuestion] = useState(null);
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [askedCapitals, setAskedCapitals] = useState(new Set());
  const [timer, setTimer] = useState(10);
  const [showHint, setShowHint] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,capital,cca3,flags")
      .then((r) => r.json())
      .then((data) => {
        const filtered = data.filter((c) => c.capital && c.capital.length > 0);
        setCountries(filtered);
      })
      .catch(console.error);
  }, []);

  const generateQuestion = (countriesList = countries, asked = askedCapitals) => {
    const remaining = countriesList.filter((c) => !asked.has(c.capital[0]));
    if (remaining.length === 0) { setGameOver(true); return; }
    const correct = remaining[getRandomInt(remaining.length)];
    let options = [correct];
    while (options.length < 4) {
      const rand = countriesList[getRandomInt(countriesList.length)];
      if (!options.some((c) => c.cca3 === rand.cca3)) options.push(rand);
    }
    const newAsked = new Set(asked).add(correct.capital[0]);
    setAskedCapitals(newAsked);
    setTransitioning(true);
    setTimeout(() => {
      setQuestion(correct);
      setChoices(shuffle(options));
      setSelected(null);
      setTimer(10);
      setShowHint(false);
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
    setAskedCapitals(new Set()); setQuestion(null);
    setSelected(null); setTimer(10); setShowHint(false);
  };

  useEffect(() => {
    if (!question || gameOver) return;
    if (timer === 0) { handleGuess(null); return; }
    const countdown = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(countdown);
  }, [timer, question, gameOver]);

  const timerPct = (timer / 10) * 100;
  const timerColor = timer <= 3 ? '#fb923c' : ACCENT;

  // ── LOADING ──
  if (!countries.length) {
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

  // ── START SCREEN ──
  if (!question && !gameOver) {
    return (
      <div className="min-h-screen flex flex-col bg-navy-900 text-white font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md">
            <div className="card-bg rounded-3xl border border-white/10 p-10 text-center shadow-2xl">
              <div className="text-7xl mb-4 animate-float inline-block">🏛️</div>
              <h1 className="text-3xl font-black mb-2">Guess the Country</h1>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                A capital city is shown guess which country it belongs to! You can use a flag hint once per question.
              </p>
              <button
                onClick={() => generateQuestion()}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-navy-900 text-lg transition-all duration-200 hover:scale-105 hover:shadow-neon-green"
                style={{ background: `linear-gradient(135deg, ${ACCENT}, #fb923c)` }}
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
              <div className="glass rounded-2xl p-6 mb-8 border border-yellow-400/20">
                <p className="text-xs uppercase font-bold tracking-widest mb-1" style={{ color: ACCENT }}>Final Score</p>
                <p className="text-6xl font-black" style={{ background: `linear-gradient(135deg, ${ACCENT}, #fb923c)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{score}</p>
              </div>
              <button
                onClick={handleRestart}
                className="w-full py-4 rounded-2xl font-black text-navy-900 text-lg transition-all duration-200 hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${ACCENT}, #fb923c)` }}
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
                <span key={i} className={`text-xl transition-all ${i < wrongCount ? 'opacity-30 grayscale' : ''}`}>❤️</span>
              ))}
            </div>
            <div className="glass rounded-xl px-4 py-1.5 border border-yellow-400/20">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>Score </span>
              <span className="text-xl font-black" style={{ background: `linear-gradient(135deg, ${ACCENT}, #fb923c)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{score}</span>
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
          <div className={`card-bg rounded-3xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-300 ${transitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            {/* Capital display */}
            <div className="flex flex-col items-center justify-center p-8 min-h-[160px]" style={{ background: `radial-gradient(ellipse at 50% 50%, ${ACCENT}12, transparent 70%)` }}>
              <p className="text-xs uppercase font-bold tracking-widest mb-3 text-slate-400">Capital City</p>
              <p className="text-4xl sm:text-5xl font-black text-center" style={{ color: ACCENT }}>{question.capital[0]}</p>
              <div className="absolute top-3 right-4 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${timerColor}25`, color: timerColor }}>
                {timer}s
              </div>
              {showHint && (
                <img
                  src={question.flags.png}
                  alt="Flag hint"
                  className="mt-4 h-12 object-contain rounded border border-white/10 drop-shadow"
                />
              )}
            </div>

            {/* Controls */}
            <div className="px-8 py-5">
              <p className="text-center text-sm font-semibold text-slate-400 mb-4 uppercase tracking-widest">Which country has this capital?</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
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
                          'border-white/10 bg-white/5 text-white hover:bg-yellow-400/10 hover:border-yellow-400/40'}`}
                    >
                      {country.name.common}
                    </button>
                  );
                })}
              </div>
              {!showHint && !selected && (
                <button
                  onClick={() => setShowHint(true)}
                  className="w-full py-2 rounded-xl text-xs font-bold border border-white/10 text-slate-400 hover:border-yellow-400/30 hover:text-yellow-400 transition-all duration-200"
                >
                  💡 Show Flag Hint
                </button>
              )}
              {selected && (
                <div className={`mt-1 text-center text-sm font-bold py-2 rounded-xl ${selected.cca3 === question.cca3 ? 'text-neon-green bg-neon-green/10' : 'text-red-400 bg-red-500/10'}`}>
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

export default GuessTheCapital;