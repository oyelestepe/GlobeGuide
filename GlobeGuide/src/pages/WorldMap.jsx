import React, { useState, useEffect, useCallback } from 'react';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const geoUrl = "/data/continents.geojson";

// Neon accent colours per continent — matches the overall design system
const continentAccents = {
  "North America": { fill: '#38bdf8', glow: '#38bdf820', label: '🌎', desc: 'Americas' },
  "South America": { fill: '#22d35e', glow: '#22d35e20', label: '🌿', desc: 'South America' },
  "Europe":        { fill: '#a78bfa', glow: '#a78bfa20', label: '🏰', desc: 'Europe' },
  "Africa":        { fill: '#fbbf24', glow: '#fbbf2420', label: '🌍', desc: 'Africa' },
  "Asia":          { fill: '#fb923c', glow: '#fb923c20', label: '🏯', desc: 'Asia' },
  "Australia":     { fill: '#f472b6', glow: '#f472b620', label: '🦘', desc: 'Oceania' },
  "Antarctica":    { fill: '#94a3b8', glow: '#94a3b820', label: '🧊', desc: 'Antarctica' },
};

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function WorldMap() {
  const navigate = useNavigate();
  const [hoveredContinent, setHoveredContinent] = useState(null);
  const [continentStats, setContinentStats] = useState({});
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, continent: null });

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,region,continents,area,population')
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        const stats = {};
        data.forEach(country => {
          let continent = country.region;
          if (country.continents && country.continents.length > 0) {
            continent = country.continents[0];
          }
          if (continent === "Oceania") continent = "Australia";
          if (continent === "Antarctic") continent = "Antarctica";
          if (!stats[continent]) stats[continent] = { count: 0, population: 0, area: 0 };
          stats[continent].count += 1;
          stats[continent].population += country.population || 0;
          stats[continent].area += country.area || 0;
        });
        setContinentStats(stats);
      })
      .catch(() => {
        setContinentStats({
          "North America": { count: 23, population: 579024000, area: 24709000 },
          "South America": { count: 12, population: 423581078, area: 17840000 },
          "Europe":        { count: 44, population: 748000000, area: 10180000 },
          "Africa":        { count: 54, population: 1340598147, area: 30370000 },
          "Asia":          { count: 49, population: 4641054775, area: 44579000 },
          "Australia":     { count: 14, population: 42677813, area: 8600000 },
          "Antarctica":    { count: 0,  population: 0, area: 14000000 },
        });
      });
  }, []);

  const getDisplayContinent = (continent) => {
    if (!continent) return "Unknown";
    if (continent === "Oceania") return "Australia";
    if (continent === "Antarctic") return "Antarctica";
    if (continent === "Americas") return "North America";
    return continent;
  };

  const handleContinentClick = (continent) => {
    const c = getDisplayContinent(continent);
    if (c === "Antarctica") return; // nothing to show
    navigate(`/continent/${c.toLowerCase().replace(/\s/g, '-')}`);
  };

  const handleMouseEnter = (event, continent) => {
    const c = getDisplayContinent(continent);
    setHoveredContinent(c);
    setTooltip({ visible: true, x: event.clientX, y: event.clientY, continent: c });
  };

  const handleMouseMove = useCallback(
    debounce((event) => {
      setTooltip(t => ({ ...t, x: event.clientX, y: event.clientY }));
    }, 16),
    []
  );

  const handleMouseLeave = () => {
    setHoveredContinent(null);
    setTooltip({ visible: false, x: 0, y: 0, continent: null });
  };

  const stats = tooltip.continent ? continentStats[tooltip.continent] : null;
  const accent = tooltip.continent ? continentAccents[tooltip.continent] : null;

  return (
    <div className="min-h-screen flex flex-col bg-theme-primary text-theme-primary font-sans">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
        {/* Background blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-neon-blue/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-neon-blue uppercase tracking-widest mb-3">🗺️ Interactive Atlas</p>
            <h1 className="text-4xl sm:text-5xl font-black mb-4">
              Explore the{' '}
              <span className="gradient-text">World Map</span>
            </h1>
            <p className="text-theme-secondary max-w-xl mx-auto text-base leading-relaxed">
              Click on any continent to discover its countries, capitals, populations, and more.
            </p>
          </div>

          {/* Map card */}
          <div className="relative rounded-3xl overflow-hidden border border-theme-light shadow-2xl" style={{ background: 'var(--map-card-bg)' }}>
            {/* Subtle grid overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />

            <div className="relative p-4 sm:p-6">
              <ComposableMap
                projection="geoEqualEarth"
                projectionConfig={{ scale: 175 }}
                style={{ width: '100%', height: 'auto' }}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map(geo => {
                      const continent = getDisplayContinent(
                        geo.properties.CONTINENT || geo.properties.continent || geo.properties.name
                      );
                      const accentData = continentAccents[continent];
                      const isHovered = hoveredContinent === continent;
                      const fill = accentData
                        ? isHovered
                          ? accentData.fill
                          : `${accentData.fill}99`
                        : '#334155';
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onClick={() => handleContinentClick(continent)}
                          onMouseEnter={e => handleMouseEnter(e, continent)}
                          onMouseMove={handleMouseMove}
                          onMouseLeave={handleMouseLeave}
                          style={{
                            default: {
                              fill,
                              stroke: 'var(--bg-primary)',
                              strokeWidth: 0.8,
                              outline: 'none',
                              transition: 'fill 0.2s ease',
                              cursor: continent === 'Antarctica' ? 'default' : 'pointer',
                              filter: isHovered ? `drop-shadow(0 0 8px ${accentData?.fill || 'transparent'})` : 'none',
                            },
                            hover: {
                              fill: accentData ? accentData.fill : '#475569',
                              stroke: '#0f172a',
                              strokeWidth: 0.8,
                              outline: 'none',
                            },
                            pressed: {
                              fill: accentData ? accentData.fill : '#475569',
                              outline: 'none',
                            },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
            </div>

            {/* Hint label */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-theme-muted font-medium pointer-events-none">
              Click a continent to explore its countries
            </div>
          </div>

          {/* Continent legend grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-8">
            {Object.entries(continentAccents).map(([name, data]) => {
              const s = continentStats[name];
              const isDisabled = name === 'Antarctica';
              return (
                <button
                  key={name}
                  onClick={() => !isDisabled && navigate(`/continent/${name.toLowerCase().replace(/\s/g, '-')}`)}
                  disabled={isDisabled}
                  className={`group card-bg rounded-2xl border p-4 text-center transition-all duration-200 ${isDisabled ? 'opacity-40 cursor-not-allowed border-theme-subtle' : 'border-theme-light hover:border-white/20 hover:-translate-y-1 hover:shadow-lg cursor-pointer'}`}
                  style={!isDisabled ? { '--accent': data.fill } : {}}
                >
                  <div className="text-2xl mb-1">{data.label}</div>
                  <p className="text-xs font-bold text-theme-primary leading-tight mb-1">{name}</p>
                  {s && (
                    <p className="text-[10px] font-semibold" style={{ color: data.fill }}>
                      {s.count} countries
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />

      {/* Floating tooltip */}
      {tooltip.visible && tooltip.continent && stats && accent && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: tooltip.x + 16, top: tooltip.y + 16 }}
        >
          <div
            className="rounded-2xl border shadow-2xl px-5 py-4 min-w-[200px]"
            style={{
              background: 'var(--tooltip-bg)',
              backdropFilter: 'blur(16px)',
              borderColor: `${accent.fill}40`,
            }}
          >
            <p className="font-black text-base mb-3 pb-2 border-b" style={{ color: accent.fill, borderColor: `${accent.fill}30` }}>
              {accent.label} {tooltip.continent}
            </p>
            <div className="space-y-1.5">
              <p className="text-xs text-slate-400 flex justify-between gap-4">
                <span>🌍 Countries</span>
                <span className="text-white font-bold">{stats.count}</span>
              </p>
              <p className="text-xs text-slate-400 flex justify-between gap-4">
                <span>👥 Population</span>
                <span className="text-white font-bold">{stats.population.toLocaleString()}</span>
              </p>
              <p className="text-xs text-slate-400 flex justify-between gap-4">
                <span>📏 Area</span>
                <span className="text-white font-bold">{stats.area.toLocaleString()} km²</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorldMap;