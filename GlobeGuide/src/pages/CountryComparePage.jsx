import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Neon colors per slot — mirrors CountryCompare.jsx
const SLOT_COLORS = [
  "#22d35e",
  "#38bdf8",
  "#f59e0b",
  "#a78bfa",
  "#fb7185",
];

/* ─── Custom Tooltip ─────────────────────────────────── */
const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        background: 'var(--tooltip-bg)',
        border: '1px solid var(--border-light)',
        borderRadius: 12,
        padding: '10px 16px',
        backdropFilter: 'blur(16px)',
      }}
    >
      {label && <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 6 }}>{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color, fontSize: 13, fontWeight: 600 }}>
          {entry.name}: {formatter ? formatter(entry.value) : entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

/* ─── Section card wrapper ───────────────────────────── */
const ChartCard = ({ title, subtitle, children }) => (
  <div className="card-bg rounded-2xl p-6 border border-theme-light shadow-lg">
    <h3 className="text-xl font-bold text-theme-primary mb-1">{title}</h3>
    {subtitle && <p className="text-theme-muted text-sm mb-6">{subtitle}</p>}
    {children}
  </div>
);

/* ─── Axis tick (dark-friendly) ──────────────────────── */
const axisTick = { fill: "#64748b", fontSize: 12 };

/* ─── Normalize value 0–100 across an array ─────────── */
const normalize = (values) => {
  const max = Math.max(...values, 1);
  return values.map(v => Math.round((v / max) * 100));
};

/* ─── Main Component ─────────────────────────────────── */
function CountryComparePage() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [allCountries, setAllCountries] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /* Fetch all country data once */
  useEffect(() => {
    fetch(
      "https://restcountries.com/v3.1/all?fields=name,flags,cca3,population,area,region,subregion,languages,currencies,borders"
    )
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setAllCountries(Array.isArray(data) ? data : []))
      .catch(() => setError(true));
  }, []);

  /* Match URL params → country objects */
  useEffect(() => {
    if (!allCountries.length) return;
    const params = new URLSearchParams(search);
    const codes = [];
    for (let i = 1; i <= 5; i++) {
      const v = params.get(`c${i}`);
      if (v) codes.push(v);
    }
    if (codes.length < 2) {
      setError(true);
      setLoading(false);
      return;
    }

    const findCountry = (code) => {
      const c = code.toUpperCase();
      return allCountries.find(
        country =>
          (country.cca3 && country.cca3.toUpperCase() === c) ||
          (country.name?.common?.toUpperCase() === c)
      );
    };

    const found = codes.map(findCountry).filter(Boolean);
    if (found.length < 2) {
      setError(true);
    } else {
      setCountries(found);
    }
    setLoading(false);
  }, [search, allCountries]);

  /* ── Error state ── */
  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen hero-bg flex flex-col items-center justify-center gap-6 px-4">
          <div className="text-6xl">🌍</div>
          <h2 className="text-3xl font-bold text-theme-primary">Couldn't load country data</h2>
          <p className="text-theme-secondary text-center max-w-md">
            We couldn't find details for one or more of the selected countries.
            Please go back and try different selections.
          </p>
          <button
            onClick={() => navigate("/country-compare")}
            className="px-8 py-3 rounded-xl font-bold transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #22d35e, #38bdf8)",
              color: "#0f172a",
            }}
          >
            ← Back to selection
          </button>
        </div>
        <Footer />
      </>
    );
  }

  /* ── Loading state ── */
  if (loading || countries.length < 2) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen hero-bg flex flex-col items-center justify-center gap-4">
          <div
            className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: "#22d35e", borderTopColor: "transparent" }}
          />
          <p className="text-theme-secondary text-lg font-medium">Loading country data…</p>
        </div>
        <Footer />
      </>
    );
  }

  /* ─── Derived chart data ─── */
  const populationData = [
    {
      name: "Population",
      ...Object.fromEntries(countries.map(c => [c.name.common, c.population])),
    },
  ];

  const areaData = [
    {
      name: "Area (km²)",
      ...Object.fromEntries(countries.map(c => [c.name.common, c.area || 0])),
    },
  ];

  const bordersData = [
    {
      name: "Borders",
      ...Object.fromEntries(countries.map(c => [c.name.common, c.borders?.length || 0])),
    },
  ];

  const languagesData = [
    {
      name: "Languages",
      ...Object.fromEntries(
        countries.map(c => [c.name.common, c.languages ? Object.keys(c.languages).length : 0])
      ),
    },
  ];

  // Radar: normalize each metric across selected countries
  const metrics = ["Population", "Area", "Borders", "Languages", "Currencies"];
  const rawValues = {
    Population: countries.map(c => c.population || 0),
    Area: countries.map(c => c.area || 0),
    Borders: countries.map(c => c.borders?.length || 0),
    Languages: countries.map(c => c.languages ? Object.keys(c.languages).length : 0),
    Currencies: countries.map(c => c.currencies ? Object.keys(c.currencies).length : 0),
  };
  const normalizedValues = {};
  metrics.forEach(m => {
    normalizedValues[m] = normalize(rawValues[m]);
  });

  const radarData = metrics.map(metric => ({
    metric,
    ...Object.fromEntries(
      countries.map((c, i) => [c.name.common, normalizedValues[metric][i]])
    ),
  }));

  // Combined bar — one entry per country, all numeric metrics included
  const combinedBarData = countries.map((c, i) => ({
    name: c.name.common,
    Population: c.population,
    "Area (km²)": c.area || 0,
    Borders: c.borders?.length || 0,
    Languages: c.languages ? Object.keys(c.languages).length : 0,
    color: SLOT_COLORS[i],
  }));

  return (
    <>
      <Navbar />
      <div className="min-h-screen hero-bg py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* ── Page header ── */}
          <div className="text-center">
            <button
              onClick={() => navigate("/country-compare")}
              className="text-theme-muted hover:text-theme-primary text-sm mb-4 inline-flex items-center gap-1 transition-colors"
            >
              ← Change selection
            </button>
            <h1 className="text-4xl font-extrabold gradient-text">
              Country Comparison
            </h1>
            <p className="text-theme-secondary mt-2">
              Comparing {countries.length} countries across key metrics
            </p>
          </div>

          {/* ── Country header cards ── */}
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${countries.length}, minmax(0, 1fr))` }}
          >
            {countries.map((country, i) => (
              <div
                key={country.cca3}
                className="rounded-2xl p-5 flex flex-col items-center text-center border transition-transform hover:-translate-y-1 duration-300"
                style={{
                  background: `linear-gradient(135deg, ${SLOT_COLORS[i]}18, rgba(15,23,42,0.9))`,
                  borderColor: SLOT_COLORS[i] + "55",
                }}
              >
                <img
                  src={country.flags?.png}
                  alt={`${country.name.common} flag`}
                  className="w-20 h-14 object-cover rounded-lg shadow-lg mb-3"
                  style={{ border: `2px solid ${SLOT_COLORS[i]}55` }}
                />
                <h2 className="text-theme-primary font-bold text-lg leading-tight mb-1">
                  {country.name.common}
                </h2>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: SLOT_COLORS[i] + "22",
                    color: SLOT_COLORS[i],
                    border: `1px solid ${SLOT_COLORS[i]}44`,
                  }}
                >
                  {country.region}
                </span>

              </div>
            ))}
          </div>

          {/* ── Population Bar Chart ── */}
          <ChartCard
            title="Population"
            subtitle="Total population per country"
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={combinedBarData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis
                  tick={axisTick}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v =>
                    v >= 1e9
                      ? `${(v / 1e9).toFixed(1)}B`
                      : v >= 1e6
                      ? `${(v / 1e6).toFixed(0)}M`
                      : v >= 1e3
                      ? `${(v / 1e3).toFixed(0)}K`
                      : v
                  }
                />
                <Tooltip
                  content={
                    <CustomTooltip
                      formatter={v =>
                        v >= 1e9
                          ? `${(v / 1e9).toFixed(2)}B`
                          : v >= 1e6
                          ? `${(v / 1e6).toFixed(2)}M`
                          : v.toLocaleString()
                      }
                    />
                  }
                />
                <Bar dataKey="Population" radius={[6, 6, 0, 0]} maxBarSize={64}>
                  {combinedBarData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* ── Area Bar Chart ── */}
          <ChartCard
            title="Land Area"
            subtitle="Total area in km² per country"
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={combinedBarData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis
                  tick={axisTick}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v =>
                    v >= 1e6
                      ? `${(v / 1e6).toFixed(1)}M`
                      : v >= 1e3
                      ? `${(v / 1e3).toFixed(0)}K`
                      : v
                  }
                />
                <Tooltip
                  content={
                    <CustomTooltip
                      formatter={v => `${v.toLocaleString()} km²`}
                    />
                  }
                />
                <Bar dataKey="Area (km²)" radius={[6, 6, 0, 0]} maxBarSize={64}>
                  {combinedBarData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* ── Borders + Languages Bar Charts (side by side) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Border Countries" subtitle="Number of neighbouring countries">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={combinedBarData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" tick={{ ...axisTick, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="Borders"
                    name="Borders"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={52}
                  >
                    {combinedBarData.map((entry, i) => (
                      <Cell key={i} fill={SLOT_COLORS[i]} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Official Languages" subtitle="Number of official languages">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={combinedBarData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" tick={{ ...axisTick, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="Languages"
                    name="Languages"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={52}
                  >
                    {combinedBarData.map((entry, i) => (
                      <Cell key={i} fill={SLOT_COLORS[i]} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* ── Radar Chart ── */}
          <ChartCard
            title="Country Profile"
            subtitle="Normalized metrics (0–100) — higher = relatively larger value among selected countries"
          >
            <ResponsiveContainer width="100%" height={360}>
              <RadarChart data={radarData} margin={{ top: 10, right: 40, bottom: 10, left: 40 }}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: "#94a3b8", fontSize: 13, fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: "#475569", fontSize: 10 }}
                  tickCount={5}
                />
                {countries.map((country, i) => (
                  <Radar
                    key={country.cca3}
                    name={country.name.common}
                    dataKey={country.name.common}
                    stroke={SLOT_COLORS[i]}
                    fill={SLOT_COLORS[i]}
                    fillOpacity={0.15}
                    strokeWidth={2}
                    dot={{ fill: SLOT_COLORS[i], r: 4, strokeWidth: 0 }}
                  />
                ))}
                <Legend
                  wrapperStyle={{ color: "#94a3b8", fontSize: 13, paddingTop: 16 }}
                />
                <Tooltip content={<CustomTooltip formatter={v => `${v}/100`} />} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* ── Info Table ── */}
          <ChartCard title="Detailed Info" subtitle="Key facts at a glance">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-theme-subtle">
                    <th className="py-3 pr-6 text-theme-muted font-semibold uppercase text-xs tracking-wider">
                      Metric
                    </th>
                    {countries.map((c, i) => (
                      <th
                        key={c.cca3}
                        className="py-3 pr-6 font-bold"
                        style={{ color: SLOT_COLORS[i] }}
                      >
                        {c.name.common}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: "Region",
                      fn: c => c.region,
                    },
                    {
                      label: "Subregion",
                      fn: c => c.subregion || "—",
                    },

                    {
                      label: "Population",
                      fn: c => c.population.toLocaleString(),
                    },
                    {
                      label: "Area",
                      fn: c => c.area ? `${c.area.toLocaleString()} km²` : "—",
                    },
                    {
                      label: "Languages",
                      fn: c =>
                        c.languages ? Object.values(c.languages).join(", ") : "—",
                    },
                    {
                      label: "Currencies",
                      fn: c =>
                        c.currencies
                          ? Object.values(c.currencies)
                              .map(cur => `${cur.name} (${cur.symbol || "?"})`)
                              .join(", ")
                          : "—",
                    },
                    {
                      label: "Borders",
                      fn: c =>
                        c.borders && c.borders.length > 0
                          ? c.borders.join(", ")
                          : "None",
                    },
                  ].map((row, ri) => (
                    <tr
                      key={row.label}
                      className="border-b border-theme-subtle hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      style={{ background: ri % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent" }}
                    >
                      <td className="py-3 pr-6 text-theme-muted font-medium">
                        {row.label}
                      </td>
                      {countries.map((c, i) => (
                        <td key={c.cca3} className="py-3 pr-6 text-theme-secondary">
                          {row.fn(c)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>

          {/* ── Back button ── */}
          <div className="flex justify-center pb-4">
            <button
              onClick={() => navigate("/country-compare")}
              className="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #22d35e, #38bdf8)",
                color: "#0f172a",
                boxShadow: "0 0 24px rgba(34,211,94,0.25)",
              }}
            >
              ← Compare Different Countries
            </button>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}

export default CountryComparePage;