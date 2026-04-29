import React, { useEffect, useState } from "react";

function RandomCountry() {
  const [country, setCountry] = useState(null);
  const [neighbors, setNeighbors] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("/data/countries.json");
        const countries = await response.json();

        const today = new Date();
        const randomIndex = today.getDate() % countries.length;

        const selectedCountry = countries[randomIndex];
        setCountry(selectedCountry);

        if (selectedCountry.borders && selectedCountry.borders.length > 0) {
          const neighborData = countries.filter((c) =>
            selectedCountry.borders.includes(c.cca3)
          );
          setNeighbors(neighborData);
        } else {
          setNeighbors([]);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  if (!country) {
    return (
      <div className="flex items-center justify-center gap-3 py-12 text-theme-secondary">
        <div className="w-5 h-5 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Loading country data...</span>
      </div>
    );
  }

  const facts = [
    { label: 'Capital', value: country.capital?.[0] || 'N/A', emoji: '🏛️' },
    { label: 'Region', value: country.region, emoji: '🌍' },
    { label: 'Population', value: country.population.toLocaleString(), emoji: '👥' },
    { label: 'Currency', value: country.currencies ? Object.values(country.currencies)[0].name : 'N/A', emoji: '💰' },
    { label: 'Languages', value: country.languages ? Object.values(country.languages).join(', ') : 'N/A', emoji: '🗣️' },
    { label: 'Timezone', value: country.timezones?.[0] || 'N/A', emoji: '🕐' },
  ];

  return (
    <div className="card-bg rounded-2xl border border-theme-light overflow-hidden shadow-card">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b border-theme-subtle">
        <img
          src={country.flags.png}
          alt={`${country.name.common} flag`}
          className="w-20 h-14 object-cover rounded-lg shadow-md border border-theme-light"
        />
        <div>
          <p className="text-xs text-neon-green font-semibold uppercase tracking-wider mb-1">Country of the Day</p>
          <h3 className="text-2xl font-extrabold text-theme-primary">{country.name.common}</h3>
        </div>
      </div>

      {/* Facts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-0 divide-x divide-y divide-theme-subtle">
        {facts.map((fact) => (
          <div key={fact.label} className="p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-150">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{fact.emoji}</span>
              <span className="text-xs text-theme-muted font-semibold uppercase tracking-wide">{fact.label}</span>
            </div>
            <p className="text-sm text-theme-primary font-medium truncate" title={fact.value}>{fact.value}</p>
          </div>
        ))}
      </div>

      {/* Neighbors */}
      {neighbors.length > 0 && (
        <div className="p-5 border-t border-theme-subtle">
          <p className="text-xs text-theme-muted font-semibold uppercase tracking-wider mb-3">Neighboring Countries</p>
          <div className="flex flex-wrap gap-3">
            {(Array.isArray(neighbors) ? neighbors : []).map((neighbor) => (
              <div
                key={neighbor.name.common}
                className="flex items-center gap-2 px-3 py-1.5 glass-light rounded-lg border border-theme-subtle hover:border-neon-green/30 transition-all duration-150 group"
                title={neighbor.name.common}
              >
                <img
                  src={neighbor.flags.png}
                  alt={neighbor.name.common}
                  className="w-6 h-4 object-cover rounded"
                />
                <span className="text-xs text-theme-secondary group-hover:text-neon-green transition-colors">{neighbor.name.common}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RandomCountry;
