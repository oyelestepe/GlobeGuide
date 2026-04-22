import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { feature } from "topojson-client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const geoUrl = "/data/worldmap.geojson";
const ACCENT = '#a78bfa';

function FindCountryOnMap() {
  const [geoData, setGeoData] = useState(null);
  const [target, setTarget] = useState(null);
  const [position, setPosition] = useState({ coordinates: [0, 0], scale: 1 });
  const [loading, setLoading] = useState(true);
  const [tries, setTries] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [countryStatus, setCountryStatus] = useState({});
  const [askedCountries, setAskedCountries] = useState(new Set());
  const [status, setStatus] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetch(geoUrl)
      .then((res) => { if (!res.ok) throw new Error(`GeoJSON fetch error: ${res.status}`); return res.json(); })
      .then((data) => {
        const geoJsonData = feature(data, data.objects[Object.keys(data.objects)[0]]);
        setGeoData(geoJsonData);
        setLoading(false);
        selectNewTarget(geoJsonData, new Set());
      })
      .catch((err) => { console.error("Error fetching GeoJSON:", err); setLoading(false); });
  }, []);

  const selectNewTarget = (geoJsonData, askedSet) => {
    const remaining = geoJsonData.features.filter((f) => !askedSet.has(f.id || "UNKNOWN"));
    if (remaining.length === 0) { setFinished(true); return; }
    const randomFeature = remaining[Math.floor(Math.random() * remaining.length)];
    const newTarget = {
      name: { common: randomFeature.properties.name || "Unknown" },
      cca3: randomFeature.id || "UNKNOWN",
    };
    setTarget(newTarget);
    setAskedCountries((prev) => new Set(prev).add(newTarget.cca3));
    setTries(0);
    setRevealed(false);
    setStatus("");
  };

  const handleCountryClick = (geo) => {
    const clickedCode = geo.id || "UNKNOWN";
    if (revealed || countryStatus[clickedCode]) return;

    if (clickedCode.toUpperCase() === (target?.cca3 || "").toUpperCase()) {
      setCountryStatus((prev) => ({ ...prev, [clickedCode]: "correct" }));
      setRevealed(true);
      setStatus("correct");
      setScore((s) => s + 1);
      setTimeout(() => selectNewTarget(geoData, askedCountries), 2000);
    } else {
      const newTries = tries + 1;
      setTries(newTries);
      setCountryStatus((prev) => ({ ...prev, [clickedCode]: "incorrect-click" }));
      if (newTries >= 3) {
        setCountryStatus((prev) => ({ ...prev, [target?.cca3 || "UNKNOWN"]: "incorrect" }));
        setRevealed(true);
        setStatus("incorrect");
        setTimeout(() => {
          setCountryStatus((prev) => {
            const next = { ...prev };
            Object.keys(next).forEach((k) => { if (next[k] === "incorrect-click") delete next[k]; });
            return next;
          });
          selectNewTarget(geoData, askedCountries);
        }, 2500);
      } else {
        setTimeout(() => {
          setCountryStatus((prev) => {
            const next = { ...prev };
            if (next[clickedCode] === "incorrect-click") delete next[clickedCode];
            return next;
          });
        }, 600);
      }
    }
  };

  const handleZoomIn = () => setPosition((p) => ({ ...p, scale: Math.min(p.scale * 1.5, 8) }));
  const handleZoomOut = () => setPosition((p) => ({ ...p, scale: Math.max(p.scale / 1.5, 1) }));
  const handleMoveEnd = (newPos) => setPosition((p) => ({ ...p, coordinates: newPos.center }));

  const handleRestart = () => {
    setScore(0); setTries(0); setRevealed(false);
    setCountryStatus({}); setAskedCountries(new Set());
    setStatus(""); setFinished(false);
    if (geoData) selectNewTarget(geoData, new Set());
  };

  // ── LOADING ──
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-theme-primary text-theme-primary font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl animate-spin-slow mb-4">🗺️</div>
            <p className="text-theme-secondary">Loading world map…</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!geoData || !target) {
    return (
      <div className="min-h-screen flex flex-col bg-theme-primary text-theme-primary font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-red-400">Error loading map data.</p>
        </main>
        <Footer />
      </div>
    );
  }

  // ── FINISHED ──
  if (finished) {
    return (
      <div className="min-h-screen flex flex-col bg-navy-900 text-white font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md">
            <div className="card-bg rounded-3xl border border-white/10 p-10 text-center shadow-2xl">
              <div className="text-7xl mb-4">🎉</div>
              <h2 className="text-3xl font-black mb-2">All Done!</h2>
              <p className="text-slate-400 mb-6">You've gone through all countries on the map!</p>
              <div className="glass rounded-2xl p-6 mb-8 border border-purple-400/20">
                <p className="text-xs uppercase font-bold tracking-widest mb-1" style={{ color: ACCENT }}>Final Score</p>
                <p className="text-6xl font-black" style={{ color: ACCENT }}>{score}</p>
              </div>
              <button
                onClick={handleRestart}
                className="w-full py-4 rounded-2xl font-black text-white text-lg transition-all duration-200 hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${ACCENT}, #38bdf8)` }}
              >
                🔄 Play Again
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-theme-primary text-theme-primary font-sans">
      <Navbar />
      <main className="flex-1 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* HUD */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase font-bold tracking-widest text-theme-secondary mb-1">Find this country</p>
              <p className="text-3xl sm:text-4xl font-black" style={{ color: ACCENT }}>{target.name.common}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Tries */}
              <div className="glass rounded-xl px-4 py-2 border border-purple-400/20 text-center">
                <p className="text-xs text-theme-secondary font-bold uppercase tracking-widest">Tries</p>
                <div className="flex gap-1 justify-center mt-1">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className={`w-3 h-3 rounded-full transition-all ${i < tries ? 'bg-red-500' : 'border border-white/20'}`} />
                  ))}
                </div>
              </div>
              {/* Score */}
              <div className="glass rounded-xl px-4 py-2 border border-purple-400/20 text-theme-primary text-center">
                <p className="text-xs text-theme-secondary font-bold uppercase tracking-widest">Score</p>
                <p className="text-xl font-black" style={{ color: ACCENT }}>{score}</p>
              </div>
            </div>
          </div>

          {/* Map card */}
          <div className="card-bg rounded-2xl border border-theme-light overflow-hidden shadow-2xl relative">
            {/* Zoom controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <button
                onClick={handleZoomIn}
                className="w-9 h-9 rounded-xl glass border border-white/10 text-white font-bold hover:border-neon-purple/40 hover:text-neon-purple transition-all text-lg flex items-center justify-center"
              >+</button>
              <button
                onClick={handleZoomOut}
                className="w-9 h-9 rounded-xl glass border border-white/10 text-white font-bold hover:border-neon-purple/40 hover:text-neon-purple transition-all text-xl flex items-center justify-center"
              >−</button>
            </div>

            {/* Status badge */}
            {status && (
              <div className={`absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl text-xs font-black animate-fade-in border
                ${status === 'correct' ? 'border-neon-green/40 bg-neon-green/15 text-neon-green' : 'border-red-500/40 bg-red-500/15 text-red-400'}`}>
                {status === 'correct' ? '✅ Correct! Well done!' : '❌ The country was highlighted'}
              </div>
            )}

            <ComposableMap
              projection="geoEqualEarth"
              projectionConfig={{ scale: 200 }}
              width={800}
              height={400}
              style={{ width: "100%", height: "auto" }}
            >
              <ZoomableGroup center={position.coordinates} zoom={position.scale} onMoveEnd={handleMoveEnd}>
                <Geographies geography={geoData}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const geoCode = geo.id || "UNKNOWN";
                      const geoStatus = countryStatus[geoCode];
                      let fill = 'var(--map-country-fill)';
                      if (geoStatus === 'correct') fill = '#22d35e';
                      else if (geoStatus === 'incorrect') fill = '#ef4444';
                      else if (geoStatus === 'incorrect-click') fill = '#fb923c';
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onClick={() => handleCountryClick(geo)}
                          style={{
                            default: { fill, stroke: 'var(--map-country-stroke)', strokeWidth: 0.5, outline: 'none' },
                            hover: { fill: geoStatus ? fill : ACCENT, stroke: 'var(--map-country-stroke)', strokeWidth: 0.8, outline: 'none', cursor: 'pointer' },
                            pressed: { fill: '#38bdf8', outline: 'none' },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </div>

          {/* Bottom controls */}
          <div className="flex items-center justify-between mt-4">
            <Link to="/" className="text-xs text-theme-muted hover:text-theme-secondary transition-colors">
              ← Back to Home
            </Link>
            <button
              onClick={handleRestart}
              className="glass rounded-xl px-4 py-2 border border-theme-light text-theme-muted hover:text-theme-primary hover:border-purple-400/30 text-xs font-bold transition-all"
            >
              🔄 Restart
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default FindCountryOnMap;
