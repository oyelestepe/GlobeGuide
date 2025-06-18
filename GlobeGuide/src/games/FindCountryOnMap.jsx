import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { feature } from "topojson-client";
import "./gamesCss/FindCountryOnMap.css";

const geoUrl = "/data/worldmap.geojson";

function FindCountryOnMap() {
  const [geoData, setGeoData] = useState(null);
  const [target, setTarget] = useState(null);
  const [position, setPosition] = useState({
    coordinates: [0, 0],
    scale: 1,
  });
  const [loading, setLoading] = useState(true);
  const [tries, setTries] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [countryStatus, setCountryStatus] = useState({}); // Track the status of each country
  const [askedCountries, setAskedCountries] = useState(new Set()); // Track countries that have been asked
  const [status, setStatus] = useState(""); // Track the status message

  useEffect(() => {
    fetch(geoUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`GeoJSON fetch error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const geoJsonData = feature(data, data.objects[Object.keys(data.objects)[0]]);
        setGeoData(geoJsonData);
        setLoading(false);

        // Start the first round
        selectNewTarget(geoJsonData, new Set());
      })
      .catch((error) => {
        console.error("Error fetching GeoJSON:", error);
        setLoading(false);
      });
  }, []);

  const selectNewTarget = (geoJsonData, askedCountriesSet) => {
    const remainingCountries = geoJsonData.features.filter(
      (feature) => !askedCountriesSet.has(feature.id || "UNKNOWN")
    );

    if (remainingCountries.length === 0) {
      alert("All countries have been asked!");
      return;
    }

    const randomFeature = remainingCountries[Math.floor(Math.random() * remainingCountries.length)];
    const newTarget = {
      name: { common: randomFeature.properties.name || "Unknown" },
      cca3: randomFeature.id || "UNKNOWN",
    };

    setTarget(newTarget);
    setAskedCountries((prev) => new Set(prev).add(newTarget.cca3));
    setTries(0);
    setRevealed(false);
    setStatus(""); // Reset status message
  };

  const handleCountryClick = (geo) => {
    const clickedCountryCode = geo.id || "UNKNOWN";

    if (revealed || countryStatus[clickedCountryCode]) return; // Do nothing if revealed or already marked

    if (clickedCountryCode.toUpperCase() === (target?.cca3 || "").toUpperCase()) {
      setCountryStatus((prev) => ({
        ...prev,
        [clickedCountryCode]: "correct", // Mark the country as correct
      }));
      setRevealed(true);
      setStatus("correct"); // Set status message to correct

      // Start a new round after a short delay
      setTimeout(() => {
        selectNewTarget(geoData, askedCountries);
      }, 2000);
    } else {
      setTries((prev) => prev + 1);

      if (tries + 1 >= 3) {
        setCountryStatus((prev) => ({
          ...prev,
          [target?.cca3 || "UNKNOWN"]: "incorrect", // Mark the target country as incorrect
        }));
        setRevealed(true);
        setStatus("incorrect"); // Set status message to incorrect

        // Start a new round after a short delay
        setTimeout(() => {
          selectNewTarget(geoData, askedCountries);
        }, 2000);
      }
    }
  };

  const handleZoomIn = () => {
    setPosition((prev) => ({
      ...prev,
      scale: Math.min(prev.scale * 1.5, 8),
    }));
  };

  const handleZoomOut = () => {
    setPosition((prev) => ({
      ...prev,
      scale: Math.max(prev.scale / 1.5, 1),
    }));
  };

  const handleMoveEnd = (newPosition) => {
    setPosition((prev) => ({
      ...prev,
      coordinates: newPosition.center,
    }));
  };

  if (loading) return <div className="loading">Loading map data...</div>;
  if (!geoData) return <div className="error">Error loading map data</div>;
  if (!target) return <div className="error">Error loading game</div>;

  return (
    <div className="find-country-container">
      <h2 className="game-title">Find the Country</h2>
      <p className="target-country">
        Find: <b className="target-country-name">{target.name.common}</b>
      </p>
      <p className="game-stats">Tries: {tries} / 3</p>
      <div className="map-container">
        <div className="zoom-controls">
          <button className="zoom-button" onClick={handleZoomIn}>
            +
          </button>
          <button className="zoom-button" onClick={handleZoomOut}>
            -
          </button>
        </div>

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
                  const status = countryStatus[geoCode]; // Get the status of the country

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => handleCountryClick(geo)}
                      style={{
                        default: {
                          fill: status === "correct"
                            ? "#43a047" // correct guesses
                            : status === "incorrect"
                            ? "#e63946" // incorrect guesses
                            : "#D6D6DA", // Default color
                          stroke: "#888", // Add borders
                          strokeWidth: 0.5, // Border thickness
                          outline: "none",
                        },
                        hover: {
                          fill: status ? "#D6D6DA" : "#90caf9", // Highlight on hover if not already marked
                          stroke: "#555", // Darker border on hover
                          strokeWidth: 1, // Thicker border on hover
                          outline: "none",
                        },
                        pressed: {
                          fill: "#E42", // Highlight on click
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>

      <p className={`feedback-message ${status}`}>
        {status === "correct" && "Correct! Well done!"}
        {status === "incorrect" && "Incorrect! The correct country was highlighted."}
      </p>

      <button className="restart-button" onClick={() => window.location.reload()}>
        Restart Game
      </button>
    </div>
  );
}

export default FindCountryOnMap;
