import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getClues(country) {
  const clues = [];
  if (country.capital?.[0]) clues.push({ label: 'Capital', value: country.capital[0], icon: '🏛️' });
  if (country.region) clues.push({ label: 'Region', value: country.region, icon: '🌍' });
  if (country.subregion) clues.push({ label: 'Subregion', value: country.subregion, icon: '📍' });
  if (country.population) clues.push({ label: 'Population', value: country.population.toLocaleString(), icon: '👥' });
  if (country.area) clues.push({ label: 'Area', value: `${country.area.toLocaleString()} km²`, icon: '📐' });
  if (country.languages) clues.push({ label: 'Languages', value: Object.values(country.languages).join(', '), icon: '🗣️' });
  if (country.currencies) clues.push({ label: 'Currency', value: Object.values(country.currencies)[0].name, icon: '💰' });
  if (country.borders?.length) clues.push({ label: 'Borders', value: `${country.borders.length} countries`, icon: '🗺️' });
  return clues;
}

function normalize(str) {
  return str.trim().toLowerCase();
}

const ACCENT = '#22d35e';

function CountryInfoGuess() {
  const [countries, setCountries] = useState([]);
  const [question, setQuestion] = useState(null);
  const [clues, setClues] = useState([]);
  const [shownClues, setShownClues] = useState([]);
  const [guess, setGuess] = useState("");
  const [wrongCount, setWrongCount] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'correct'|'wrong', msg: string }
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,region,subregion,population,area,languages,currencies,borders,capital,flags")
      .then((r) => r.json())
      .then((data) => {
        setCountries(data);
        startNewQuestion(data);
      })
      .catch(console.error);
  }, []);

  const startNewQuestion = (data = countries) => {
    const country = data[getRandomInt(data.length)];
    const cluesArr = getClues(country);
    setTransitioning(true);
    setTimeout(() => {
      setQuestion(country);
      setClues(cluesArr);
      setShownClues(cluesArr.slice(0, 2));
      setGuess("");
      setWrongCount(0);
      setRevealed(false);
      setFeedback(null);
      setTransitioning(false);
    }, 300);
  };

  const handleGuess = (e) => {
    e.preventDefault();
    if (!question || revealed || gameOver || !guess.trim()) return;

    const isCorrect =
      normalize(guess) === normalize(question.name.common) ||
      normalize(question.name.common).includes(normalize(guess));

    if (isCorrect) {
      setScore((s) => s + 1);
      setFeedback({ type: 'correct', msg: `✅ Correct! It was ${question.name.common}` });
      setTimeout(() => startNewQuestion(), 1500);
    } else {
      const newWrong = wrongCount + 1;
      setWrongCount(newWrong);
      if (newWrong >= 3) {
        setRevealed(true);
        setFeedback({ type: 'wrong', msg: `❌ The answer was: ${question.name.common}` });
        setTimeout(() => startNewQuestion(), 2500);
      } else {
        setFeedback({ type: 'wrong', msg: `❌ Wrong! ${3 - newWrong} guess${3 - newWrong === 1 ? '' : 'es'} left.` });
      }
    }
    setGuess("");
  };

  const handleHintRequest = () => {
    if (shownClues.length < clues.length) {
      setShownClues(clues.slice(0, shownClues.length + 1));
    }
  };

  const handleRestart = () => {
    setScore(0);
    setGameOver(false);
    startNewQuestion();
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-navy-900 text-white font-sans">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          {/* HUD */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className={`text-xl transition-all ${i < wrongCount ? 'opacity-30 grayscale' : ''}`}>❤️</span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="glass rounded-xl px-4 py-1.5 border border-neon-green/20">
                <span className="text-xs text-neon-green font-bold uppercase tracking-widest">Score </span>
                <span className="text-xl font-black gradient-text">{score}</span>
              </div>
              <button
                onClick={handleRestart}
                className="glass rounded-xl px-3 py-1.5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 text-xs font-bold transition-all"
              >
                🔄
              </button>
            </div>
          </div>

          {/* Card */}
          <div className={`card-bg rounded-3xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-300 ${transitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            {/* Header */}
            <div className="px-7 pt-7 pb-4 border-b border-white/5 flex items-center gap-3">
              <div className="p-2 rounded-xl" style={{ background: `${ACCENT}15` }}>
                <span className="text-lg">🌍</span>
              </div>
              <div>
                <p className="text-xs uppercase font-bold tracking-widest" style={{ color: ACCENT }}>Country Info Guess</p>
                <p className="text-xs text-slate-500">Use the clues to identify the mystery country</p>
              </div>
            </div>

            {/* Clues */}
            <div className="px-7 py-5 space-y-2">
              {shownClues.map((clue, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${idx === shownClues.length - 1 ? 'border-neon-green/30 bg-neon-green/5 animate-fade-in' : 'border-white/5 bg-white/3'}`}
                >
                  <span className="text-lg w-7 text-center flex-shrink-0">{clue.icon}</span>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{clue.label}</p>
                    <p className="text-sm font-bold text-white">{clue.value}</p>
                  </div>
                  {idx === shownClues.length - 1 && (
                    <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${ACCENT}20`, color: ACCENT }}>
                      Clue {idx + 1}
                    </span>
                  )}
                </div>
              ))}

              {shownClues.length < clues.length && (
                <button
                  onClick={handleHintRequest}
                  className="w-full py-2.5 rounded-xl text-xs font-bold border border-dashed border-white/15 text-slate-400 hover:border-neon-green/40 hover:text-neon-green transition-all duration-200"
                >
                  💡 Reveal Next Clue ({shownClues.length}/{clues.length})
                </button>
              )}
            </div>

            {/* Guess form */}
            <div className="px-7 pb-7">
              {!revealed ? (
                <form onSubmit={handleGuess} className="flex gap-2">
                  <input
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder="Type the country name…"
                    autoFocus
                    className="flex-1 bg-navy-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-green/50 transition-colors placeholder:text-slate-600"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl font-black text-navy-900 text-sm transition-all duration-200 hover:scale-105 flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${ACCENT}, #38bdf8)` }}
                  >
                    Guess
                  </button>
                </form>
              ) : (
                <div className="text-center py-3">
                  <p className="text-slate-400 text-sm">Loading next country…</p>
                </div>
              )}

              {feedback && (
                <div className={`mt-3 text-center text-sm font-bold py-2.5 rounded-xl ${feedback.type === 'correct' ? 'text-neon-green bg-neon-green/10 border border-neon-green/20' : 'text-red-400 bg-red-500/10 border border-red-500/20'}`}>
                  {feedback.msg}
                </div>
              )}
            </div>
          </div>

          <Link to="/" className="mt-4 block text-center text-xs text-slate-500 hover:text-slate-300 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CountryInfoGuess;