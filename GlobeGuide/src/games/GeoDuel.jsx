import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from "../components/Footer";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const PROPERTIES = [
  { key: "population", label: "population", icon: "👥", format: (v) => v.toLocaleString() },
  { key: "area", label: "area (km²)", icon: "📐", format: (v) => v.toLocaleString() },
  { key: "borders", label: "number of neighbors", icon: "🗺️", isCount: true, format: (v) => v.toLocaleString() },
];

function getRandomProperty() {
  return PROPERTIES[getRandomInt(PROPERTIES.length)];
}

const ACCENT = '#fb923c';

function GeoDuel() {
  const [countries, setCountries] = useState([]);
  const [pair, setPair] = useState([]);
  const [propertyObj, setPropertyObj] = useState(PROPERTIES[0]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [result, setResult] = useState(null); // { correct: bool, label: string, v1, v2, winner }
  const [animIdx, setAnimIdx] = useState(null);
  const { search } = useLocation();

  useEffect(() => {
    fetch("/data/countries.json")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) ? setCountries(data) : setCountries([]))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!Array.isArray(countries) || countries.length < 2) return;
    const params = new URLSearchParams(search);
    const c1 = params.get("c1");
    const c2 = params.get("c2");
    if (c1 && c2) {
      const country1 = countries.find((c) => c.cca3 === c1);
      const country2 = countries.find((c) => c.cca3 === c2);
      if (country1 && country2) { setPair([country1, country2]); return; }
    }
    startNewRound(countries);
  }, [search, countries]);

  const startNewRound = (list = countries) => {
    if (list.length < 2) return;
    let idx1 = getRandomInt(list.length);
    let idx2;
    do { idx2 = getRandomInt(list.length); } while (idx2 === idx1);
    setPair([list[idx1], list[idx2]]);
    setResult(null);
    setAnimIdx(null);
    setPropertyObj(getRandomProperty());
  };

  const getVal = (country, prop) => {
    if (prop.isCount) return Array.isArray(country.borders) ? country.borders.length : 0;
    return country[prop.key] || 0;
  };

  const handleGuess = (guessIdx) => {
    if (result) return;
    const [c1, c2] = pair;
    const v1 = getVal(c1, propertyObj);
    const v2 = getVal(c2, propertyObj);
    const correct = v1 === v2 ? null : (v1 > v2 ? 0 : 1);
    const isCorrect = guessIdx === correct;
    setAnimIdx(guessIdx);
    if (isCorrect) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
    setResult({
      correct: isCorrect,
      v1, v2,
      winner: v1 === v2 ? 'tie' : (v1 > v2 ? c1.name.common : c2.name.common),
    });
    setTimeout(() => startNewRound(), 2000);
  };

  if (pair.length < 2) {
    return (
      <div className="min-h-screen flex flex-col bg-theme-primary text-theme-primary font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl animate-spin-slow mb-4">⚔️</div>
            <p className="text-theme-secondary">Loading countries…</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const [c1, c2] = pair;

  return (
    <div className="min-h-screen flex flex-col bg-theme-primary text-theme-primary font-sans">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          {/* HUD */}
          <div className="flex items-center justify-between mb-8">
            <div className="glass rounded-xl px-4 py-2 border border-orange-400/20 text-theme-primary">
              <p className="text-xs text-theme-secondary font-bold uppercase tracking-widest">Score</p>
              <p className="text-2xl font-black" style={{ color: ACCENT }}>{score}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-1">⚔️</div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Geo Duel</p>
            </div>
            <div className="glass rounded-xl px-4 py-2 border border-orange-400/20 text-right text-theme-primary">
              <p className="text-xs text-theme-secondary font-bold uppercase tracking-widest">Streak</p>
              <p className="text-2xl font-black" style={{ color: streak > 0 ? ACCENT : '#475569' }}>
                {streak > 0 ? `🔥 ${streak}` : '—'}
              </p>
            </div>
          </div>

          {/* Question prompt */}
          <div className="text-center mb-6">
            <p className="text-theme-secondary text-sm uppercase tracking-widest font-semibold mb-1">Which country has a higher</p>
            <p className="text-2xl font-black flex items-center justify-center gap-2" style={{ color: ACCENT }}>
              <span>{propertyObj.icon}</span>
              {propertyObj.label}?
            </p>
          </div>

          {/* Country cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[c1, c2].map((country, idx) => {
              const isSelected = animIdx === idx;
              const isWinner = result && (getVal(country, propertyObj) > getVal(pair[idx === 0 ? 1 : 0], propertyObj));
              const borderColor = result
                ? (isWinner ? '#22d35e' : (getVal(c1, propertyObj) === getVal(c2, propertyObj) ? '#fbbf24' : '#ef4444'))
                : ACCENT;
              return (
                <button
                  key={country.cca3}
                  onClick={() => handleGuess(idx)}
                  disabled={!!result}
                  className={`group card-bg rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed text-left p-0 text-theme-primary
                    ${result ? '' : 'hover:border-orange-400/50'}`}
                  style={{ borderColor: result ? borderColor : 'rgba(255,255,255,0.1)' }}
                >
                  {/* Flag */}
                  <div
                    className="w-full h-36 flex items-center justify-center relative overflow-hidden"
                    style={{ background: `radial-gradient(ellipse at 50% 50%, ${ACCENT}15, transparent 70%)` }}
                  >
                    <img
                      src={country.flags.png}
                      alt={`${country.name.common} flag`}
                      className="h-20 object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  {/* Name */}
                  <div className="p-4">
                    <p className="font-black text-center text-sm sm:text-base text-theme-primary">{country.name.common}</p>
                    {result && (
                      <div className="mt-2 text-center">
                        <p className="text-xs font-bold px-3 py-1 rounded-full inline-block" style={{ background: `${borderColor}20`, color: borderColor }}>
                          {propertyObj.format(getVal(country, propertyObj))}
                        </p>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Result banner */}
          {result && (
            <div className={`rounded-2xl p-4 text-center animate-fade-in border ${result.correct ? 'border-neon-green/30 bg-neon-green/8 text-neon-green' : 'border-red-500/30 bg-red-500/8 text-red-400'}`}>
              <p className="font-black text-lg">
                {result.v1 === result.v2 ? "🤝 It's a tie!" : result.correct ? '✅ Correct!' : '❌ Wrong!'}
              </p>
              {result.v1 !== result.v2 && (
                <p className="text-sm mt-1 text-theme-secondary">
                  <span className="font-bold text-theme-primary">{result.winner}</span> has the higher {propertyObj.label}.
                </p>
              )}
            </div>
          )}

          <div className="text-center mt-6">
            <Link to="/" className="text-xs text-theme-muted hover:text-theme-secondary transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default GeoDuel;