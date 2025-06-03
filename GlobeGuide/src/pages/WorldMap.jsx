import React, { useState } from 'react';
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

  const getDisplayContinent = (continent) =>
    continent === "Oceania" ? "Australia" : continent;

  const handleContinentClick = (continent) => {
    const displayContinent = getDisplayContinent(continent);
    navigate(`/continent/${displayContinent.toLowerCase().replace(/\s/g, '-')}`);
  };

  return (
    <div className="world-map-container" style={{ width: "80%", height: "400px", margin: "0 auto" }}>
      <ComposableMap projection="geoEqualEarth">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => {
              const continent = geo.properties.CONTINENT || geo.properties.continent || geo.properties.name;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => handleContinentClick(continent)}
                  onMouseEnter={() => setHoveredContinent(continent)}
                  onMouseLeave={() => setHoveredContinent(null)}
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
    </div>
  );
}

export default WorldMap;