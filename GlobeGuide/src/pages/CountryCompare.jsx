import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const geoUrl = "/data/worldmap.geojson";

const MAX_COUNTRIES = 5;
const MIN_COUNTRIES = 2;

// Neon accent colors per selection slot
const SLOT_COLORS = [
  "#22d35e", // green
  "#38bdf8", // sky blue
  "#f59e0b", // amber
  "#a78bfa", // violet
  "#fb7185", // rose
];

function CountryCompare() {
  const [selected, setSelected] = useState([]); // [{code, name}]
  const [hoveredGeo, setHoveredGeo] = useState(null);
  const navigate = useNavigate();

  const getCountryCode = (geo) => {
    let code = geo.properties.ISO_A3 || geo.properties.cca3 || geo.id;
    if ((code === "-99" || !code) && geo.properties.name) {
      code = geo.properties.name;
    }
    return code;
  };

  const handleCountryClick = (geo) => {
    const code = getCountryCode(geo);
    const name = geo.properties.name || code;
    const alreadyIdx = selected.findIndex(s => s.code === code);

    if (alreadyIdx !== -1) {
      // Deselect
      setSelected(prev => prev.filter((_, i) => i !== alreadyIdx));
    } else if (selected.length < MAX_COUNTRIES) {
      setSelected(prev => [...prev, { code, name }]);
    }
  };

  const removeCountry = (code) => {
    setSelected(prev => prev.filter(s => s.code !== code));
  };

  const handleCompare = () => {
    if (selected.length < MIN_COUNTRIES) return;
    const params = selected
      .map((s, i) => `c${i + 1}=${encodeURIComponent(s.code)}`)
      .join("&");
    navigate(`/compare?${params}`);
  };

  const getCountryColor = (code) => {
    const idx = selected.findIndex(s => s.code === code);
    if (idx !== -1) return SLOT_COLORS[idx];
    return null;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen hero-bg py-8 px-4">
        {/* Header */}
        <div className="max-w-5xl mx-auto text-center mb-8">
          <h1 className="text-4xl font-extrabold gradient-text mb-3">
            Country Compare
          </h1>
          <p className="text-slate-400 text-lg">
            Select <span className="text-white font-semibold">2 to 5 countries</span> on the map, then hit Compare.
          </p>
          {/* Slot indicators */}
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            {Array.from({ length: MAX_COUNTRIES }).map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300"
                style={{
                  borderColor: SLOT_COLORS[i],
                  background: i < selected.length ? SLOT_COLORS[i] + "33" : "transparent",
                  color: i < selected.length ? SLOT_COLORS[i] : "#475569",
                }}
              >
                {i < selected.length ? "✓" : i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div
          className="max-w-5xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          style={{ background: "rgba(15,23,42,0.85)" }}
        >
          <ComposableMap
            projection="geoEqualEarth"
            style={{ width: "100%", height: "auto" }}
            projectionConfig={{ scale: 155 }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const code = getCountryCode(geo);
                  const selectedColor = getCountryColor(code);
                  const isSelected = !!selectedColor;
                  const isHovered = hoveredGeo === code;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => handleCountryClick(geo)}
                      onMouseEnter={() => setHoveredGeo(code)}
                      onMouseLeave={() => setHoveredGeo(null)}
                      style={{
                        default: {
                          fill: isSelected
                            ? selectedColor + "bb"
                            : "rgba(51,65,85,0.8)",
                          stroke: isSelected ? selectedColor : "#1e293b",
                          strokeWidth: isSelected ? 1.5 : 0.5,
                          outline: "none",
                          cursor: "pointer",
                          transition: "fill 0.2s",
                        },
                        hover: {
                          fill: isSelected
                            ? selectedColor
                            : selected.length >= MAX_COUNTRIES
                            ? "#334155"
                            : "#38bdf855",
                          stroke: isSelected ? selectedColor : "#38bdf8",
                          strokeWidth: 1.5,
                          outline: "none",
                          cursor: selected.length >= MAX_COUNTRIES && !isSelected ? "not-allowed" : "pointer",
                        },
                        pressed: {
                          fill: isSelected ? selectedColor + "99" : "#22d35e55",
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>

        {/* Selection Tray */}
        <div className="max-w-5xl mx-auto mt-6">
          <div
            className="rounded-2xl p-5 border border-white/10"
            style={{ background: "rgba(15,23,42,0.9)" }}
          >
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <div className="flex flex-wrap gap-2 items-center">
                {selected.length === 0 ? (
                  <span className="text-slate-500 text-sm italic">
                    Click countries on the map to select them…
                  </span>
                ) : (
                  selected.map((s, i) => (
                    <div
                      key={s.code}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
                      style={{
                        background: SLOT_COLORS[i] + "22",
                        border: `1.5px solid ${SLOT_COLORS[i]}`,
                        color: SLOT_COLORS[i],
                      }}
                    >
                      <span>{s.name}</span>
                      <button
                        onClick={() => removeCountry(s.code)}
                        className="ml-1 hover:opacity-70 transition-opacity font-bold"
                        aria-label={`Remove ${s.name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-500 text-sm">
                  {selected.length}/{MAX_COUNTRIES} selected
                </span>
                <button
                  onClick={handleCompare}
                  disabled={selected.length < MIN_COUNTRIES}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300"
                  style={{
                    background:
                      selected.length >= MIN_COUNTRIES
                        ? "linear-gradient(135deg, #22d35e, #38bdf8)"
                        : "rgba(51,65,85,0.5)",
                    color: selected.length >= MIN_COUNTRIES ? "#0f172a" : "#475569",
                    cursor: selected.length >= MIN_COUNTRIES ? "pointer" : "not-allowed",
                    boxShadow:
                      selected.length >= MIN_COUNTRIES
                        ? "0 0 20px rgba(34,211,94,0.3)"
                        : "none",
                  }}
                >
                  Compare →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CountryCompare;