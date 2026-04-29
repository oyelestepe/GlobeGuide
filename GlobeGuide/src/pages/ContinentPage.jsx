import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const continentToApiRegion = {
  "africa":       "africa",
  "asia":         "asia",
  "europe":       "europe",
  "north-america":"americas",
  "south-america":"americas",
  "australia":    "oceania",
  "antarctica":   "antarctic",
};

const continentMeta = {
  "africa":        { emoji: '🌍', accent: '#fbbf24', label: 'Africa' },
  "asia":          { emoji: '🏯', accent: '#fb923c', label: 'Asia' },
  "europe":        { emoji: '🏰', accent: '#a78bfa', label: 'Europe' },
  "north-america": { emoji: '🌎', accent: '#38bdf8', label: 'North America' },
  "south-america": { emoji: '🌿', accent: '#22d35e', label: 'South America' },
  "australia":     { emoji: '🦘', accent: '#f472b6', label: 'Oceania' },
  "antarctica":    { emoji: '🧊', accent: '#94a3b8', label: 'Antarctica' },
};

function ContinentPage() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { name } = useParams();

  const meta = continentMeta[name] || { emoji: '🌍', accent: '#38bdf8', label: name };
  const displayName = meta.label;

  useEffect(() => {
    setLoading(true);
    fetch('/data/countries.json')
      .then(res => res.json())
      .then(data => {
        const region = continentToApiRegion[name] || name;
        let filtered = data.filter(
          c => c.region?.toLowerCase() === region.toLowerCase()
        );
        if (name === "north-america") {
          filtered = data.filter(c =>
            c.subregion === "Northern America" ||
            c.subregion === "Central America" ||
            c.subregion === "Caribbean"
          );
        } else if (name === "south-america") {
          filtered = data.filter(c => c.subregion === "South America");
        } else if (name === "australia") {
          filtered = data.filter(c => c.region?.toLowerCase() === "oceania");
        } else if (name === "antarctica") {
          filtered = data.filter(c => c.region?.toLowerCase() === "antarctic");
        }
        filtered.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error("Data error:", err);
        setLoading(false);
      });
  }, [name]);

  const filtered = countries.filter(c =>
    c.name.common.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-theme-primary text-theme-primary font-sans">
      <Navbar />

      {/* ── HERO HEADER ── */}
      <section className="relative overflow-hidden py-14 px-4 sm:px-6 lg:px-8 border-b border-theme-subtle">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 30% 50%, ${meta.accent}12 0%, transparent 60%),
                         radial-gradient(ellipse at 70% 50%, ${meta.accent}08 0%, transparent 60%)`,
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          <Link
            to="/world-map"
            className="inline-flex items-center gap-2 text-xs font-bold text-theme-muted hover:text-theme-primary transition-colors mb-6 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to World Map
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: meta.accent }}>
                {meta.emoji} Interactive Atlas
              </p>
              <h1 className="text-4xl sm:text-5xl font-black leading-tight">
                {displayName}
              </h1>
              {!loading && (
                <p className="text-theme-secondary mt-2 text-sm">
                  {filtered.length} {filtered.length === 1 ? 'country' : 'countries'} found
                </p>
              )}
            </div>

            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search countries…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-64 border border-theme-light text-theme-primary rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none transition-colors placeholder:text-theme-muted" style={{ backgroundColor: 'var(--input-bg)', '--tw-ring-color': meta.accent }}
                onFocus={e => e.target.style.borderColor = `${meta.accent}60`}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── COUNTRY GRID ── */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <div className="text-5xl animate-spin-slow mb-4">{meta.emoji}</div>
                <p className="text-theme-secondary">Loading countries…</p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-theme-secondary text-lg">No countries found for "{search}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(country => (
                <div
                  key={country.cca3}
                  className="group card-bg rounded-2xl border border-theme-light hover:border-white/20 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col"
                >
                  {/* Flag */}
                  <div
                    className="relative overflow-hidden flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${meta.accent}12, ${meta.accent}06)`,
                      minHeight: '130px',
                    }}
                  >
                    <img
                      src={country.flags?.png}
                      alt={`${country.name.common} flag`}
                      className="w-32 h-20 object-cover rounded-lg shadow-lg border border-white/10 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-5 flex flex-col flex-1 gap-2">
                    <h3 className="font-black text-base text-theme-primary mb-1">{country.name.common}</h3>

                    {[
                      { icon: '🏛️', label: 'Capital', value: country.capital?.[0] || '—' },
                      { icon: '👥', label: 'Population', value: country.population?.toLocaleString() || '—' },
                      { icon: '📐', label: 'Area', value: country.area ? `${country.area.toLocaleString()} km²` : '—' },
                      { icon: '📍', label: 'Subregion', value: country.subregion || '—' },
                      {
                        icon: '🗣️',
                        label: 'Languages',
                        value: Object.values(country.languages || {}).slice(0, 2).join(', ') || '—',
                      },
                      {
                        icon: '💰',
                        label: 'Currency',
                        value: Object.values(country.currencies || {}).map(c => c.name)[0] || '—',
                      },
                    ].map(({ icon, label, value }) => (
                      <div key={label} className="flex items-start gap-2">
                        <span className="text-sm flex-shrink-0 mt-0.5">{icon}</span>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">{label}</span>
                          <span className="text-xs text-slate-300 leading-tight line-clamp-1">{value}</span>
                        </div>
                      </div>
                    ))}

                    {country.borders?.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-white/5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Borders</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {country.borders.slice(0, 5).map(b => (
                            <span
                              key={b}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{ background: `${meta.accent}15`, color: meta.accent }}
                            >
                              {b}
                            </span>
                          ))}
                          {country.borders.length > 5 && (
                            <span className="text-[10px] text-theme-muted">+{country.borders.length - 5}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ContinentPage;