import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useNavigate } from 'react-router-dom';
import './pagesCss/WorldMap.css';

const geoUrl = "/data/continents.geojson";

const continentColors = {
  "North America": "#FFA07A",
  "South America": "#98FB98",
  "Europe": "#87CEEB",
  "Africa": "#F4A460",
  "Asia": "#DDA0DD",
  "Australia": "#FFB6C1",
  "Antarctica": "#E0FFFF"
};

// Debounce utility (can be moved to a utils file)
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
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: "" });

  // Fetch country data and group stats by continent
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,region,area,population');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('API response is not an array');
        }

        const stats = {};
        data.forEach(country => {
          let continent = country.region;
          if (continent === "Oceania") continent = "Australia";
          if (!stats[continent]) {
            stats[continent] = { count: 0, population: 0, area: 0 };
          }
          stats[continent].count += 1;
          stats[continent].population += country.population || 0;
          stats[continent].area += country.area || 0;
        });

        setContinentStats(stats);
      } catch (err) {
        // Use error reporting tools or logging libraries for error handling if needed.

        // Fallback data in case of API failure
        const fallbackStats = {
          "North America": { count: 23, population: 579024000, area: 24709000 },
          "South America": { count: 12, population: 423581078, area: 17840000 },
          "Europe": { count: 44, population: 748000000, area: 10180000 },
          "Africa": { count: 54, population: 1340598147, area: 30370000 },
          "Asia": { count: 49, population: 4641054775, area: 44579000 },
          "Australia": { count: 14, population: 42677813, area: 8600000 },
          "Antarctica": { count: 0, population: 0, area: 14000000 }
        };

        setContinentStats(fallbackStats);

        setTooltip({
          visible: true,
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          content: `Error loading data: ${err.message}`
        });
      }
    };

    fetchCountries();
  }, []);

  const getDisplayContinent = (continent) => {
    if (!continent) return "Unknown"; // Handle missing continent property
    switch (continent) {
      case "Oceania":
        return "Australia";
      case "Antarctic":
        return "Antarctica";
      case "Americas":
        return "North America"; // Default to North America for Americas
      case "South America":
        return "South America";
      case "Europe":
        return "Europe";
      case "Asia":
        return "Asia";
      case "Africa":
        return "Africa";
      default:
        return continent; // Return the original continent name for other cases
    }
  };

  const handleContinentClick = (continent) => {
    const displayContinent = getDisplayContinent(continent);
    navigate(`/continent/${displayContinent.toLowerCase().replace(/\s/g, '-')}`);
  };

  const handleMouseEnter = (event, continent) => {
    const displayContinent = getDisplayContinent(continent);
    setHoveredContinent(displayContinent);
    const stats = continentStats[displayContinent];
    if (stats) {
      setTooltip({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        content: `${displayContinent}
🌍 Countries: ${stats.count}
👥 Population: ${stats.population.toLocaleString()}
📏 Area: ${stats.area.toLocaleString()} km²`
      });
    }
  };

  const handleMouseMove = useCallback(
    debounce((event) => {
      setTooltip(t => ({ ...t, x: event.clientX, y: event.clientY }));
    }, 16), // ~60fps
    []
  );

  const handleMouseLeave = () => {
    setHoveredContinent(null);
    setTooltip({ visible: false, x: 0, y: 0, content: "" });
  };

  return (
    <div className="world-map-container">
      <ComposableMap projection="geoEqualEarth">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => {
              const continent = getDisplayContinent(
                geo.properties.CONTINENT || geo.properties.continent || geo.properties.name
              );
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => handleContinentClick(continent)}
                  onMouseEnter={e => handleMouseEnter(e, continent)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className={`geography-shape${hoveredContinent === continent ? ' hovered' : ''}`}
                  data-continent={continent}
                  style={{
                    default: {
                      fill: hoveredContinent === continent
                        ? "#F53"
                        : continentColors[continent] || "#EAEAEC"
                    }
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      {tooltip.visible && (
        <div
          className="world-map-tooltip"
          style={{ left: tooltip.x + 15, top: tooltip.y + 15 }}
        >
          <div className="tooltip-title">
            {tooltip.content.split('\n')[0]}
          </div>
          <div className="tooltip-content">
            {tooltip.content.split('\n').slice(1).map((line, index) => (
              <div key={index} className="continent-statistics">
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WorldMap;