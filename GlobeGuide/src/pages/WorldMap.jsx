import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useNavigate } from 'react-router-dom';

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

function WorldMap() {
  const navigate = useNavigate();
  const [hoveredContinent, setHoveredContinent] = useState(null);
  const [continentStats, setContinentStats] = useState({});
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: "" });

  // Fetch country data and group stats by continent
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(res => res.json())
      .then(data => {
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
      });
  }, []);

  const getDisplayContinent = (continent) =>
    continent === "Oceania" ? "Australia" : continent;

  const handleContinentClick = (continent) => {
    const displayContinent = getDisplayContinent(continent);
    navigate(`/continent/${displayContinent.toLowerCase().replace(/\s/g, '-')}`);
  };

  const handleMouseEnter = (event, continent) => {
    setHoveredContinent(continent);
    const stats = continentStats[continent];
    if (stats) {
      setTooltip({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        content: `${continent}
          Ülke sayısı: ${stats.count}
          Toplam nüfus: ${stats.population.toLocaleString()}
          Toplam alan: ${stats.area.toLocaleString()} km²`
      });
    }
  };

  const handleMouseMove = (event) => {
    setTooltip(t => ({ ...t, x: event.clientX, y: event.clientY }));
  };

  const handleMouseLeave = () => {
    setHoveredContinent(null);
    setTooltip({ visible: false, x: 0, y: 0, content: "" });
  };

  return (
    <div className="world-map-container" style={{ width: "80%", height: "60%", margin: "0 auto", position: "relative" }}>
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
                  style={{
                    default: {
                      fill: hoveredContinent === continent
                        ? "#F53"
                        : continentColors[continent] || "#EAEAEC",
                      stroke: "#FFFFFF",
                      strokeWidth: 1.5,
                      outline: "none",
                      transition: "all 250ms",
                    },
                    hover: {
                      fill: "#F53",
                      stroke: "#FFFFFF",
                      strokeWidth: 2,
                      outline: "none",
                    },
                    pressed: {
                      fill: "#E42",
                      stroke: "#FFFFFF",
                      strokeWidth: 2,
                      outline: "none",
                    },
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
          style={{
            left: tooltip.x + 15,
            top: tooltip.y + 15,
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}

export default WorldMap;