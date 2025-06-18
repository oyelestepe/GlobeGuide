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

        // Select a random target country
        const randomFeature =
          geoJsonData.features[Math.floor(Math.random() * geoJsonData.features.length)];

        const targetCountry = {
          name: { common: randomFeature.properties.name || "Unknown" },
          cca3: randomFeature.id || "UNKNOWN",
        };
        setTarget(targetCountry);
      })
      .catch((error) => {
        console.error("Error fetching GeoJSON:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (revealed && geoData) {
      const timeout = setTimeout(() => {
        const randomFeature =
          geoData.features[Math.floor(Math.random() * geoData.features.length)];

        const newTarget = {
          name: { common: randomFeature.properties.name || "Unknown" },
          cca3: randomFeature.id || "UNKNOWN",
        };

        setTarget(newTarget);
        setTries(0);
        setRevealed(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [revealed, geoData]);

  const handleCountryClick = (geo) => {
    const clickedCountryCode = geo.id || "UNKNOWN";

    if (revealed) return;

    if (clickedCountryCode.toUpperCase() === (target?.cca3 || "").toUpperCase()) {
      setCountryStatus((prev) => ({
        ...prev,
        [clickedCountryCode]: "correct", // Mark the country as correct
      }));
      setRevealed(true);
    } else {
      setTries((prev) => prev + 1);

      if (tries + 1 >= 3) {
        setCountryStatus((prev) => ({
          ...prev,
          [target?.cca3 || "UNKNOWN"]: "incorrect", // Mark the target country as incorrect
        }));
        setRevealed(true);
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
                            ? "#43a047" // Green for correct guesses
                            : status === "incorrect"
                            ? "#e63946" // Red for incorrect guesses
                            : "#D6D6DA", // Default color
                          outline: "none",
                        },
                        hover: {
                          fill: "#F53",
                          outline: "none",
                        },
                        pressed: {
                          fill: "#E42",
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
    </div>
  );
}

export default FindCountryOnMap;
