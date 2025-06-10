import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { debounce } from "lodash";
import "./gamesCss/FindCountryOnMap.css";

const geoUrl = "/data/countries.geojson";

function FindCountryOnMap() {
  const [countries, setCountries] = useState([]);
  const [target, setTarget] = useState(null);
  const [tries, setTries] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [correctGuesses, setCorrectGuesses] = useState(new Set());
  const [position, setPosition] = useState({ 
    coordinates: [0, 0],
    scale: 100,
    center: [0, 0]
  });
  const [tooltip, setTooltip] = useState({ show: false, content: "", x: 0, y: 0 });
  const [geoData, setGeoData] = useState(null);

  const pickNewCountry = (data = countries) => {
    console.log("Picking new country from", data?.length, "countries");
    if (!data || !data.length) {
      console.error("No data available for picking country");
      setMessage("Error: No countries available");
      return;
    }
    const idx = Math.floor(Math.random() * data.length);
    const newTarget = data[idx];
    console.log("Selected country:", newTarget?.name?.common);
    setTarget(newTarget);
    setTries(0);
    setRevealed(false);
    setMessage("");
  };

  useEffect(() => {
    Promise.all([
      fetch("https://restcountries.com/v3.1/all?fields=name,cca3,cioc,altSpellings")
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        }),
      fetch(geoUrl)
        .then(res => {
          if (!res.ok) throw new Error(`GeoJSON fetch failed! status: ${res.status}`);
          return res.json();
        })
    ]).then(([apiCountries, geoData]) => {
      console.log("API Countries count:", apiCountries?.length);
      console.log("GeoJSON features count:", geoData?.features?.length);
      
      // Debug the first feature to see its structure
      console.log("Sample GeoJSON feature:", geoData.features[0].properties);

      if (!Array.isArray(apiCountries) || !geoData?.features) {
        console.error("Invalid data structure:", { apiCountries, geoData });
        setMessage("Error loading data: Invalid data structure");
        setLoading(false);
        return;
      }

      // Modified: Collect all possible country codes using the correct property names
      const geoCodesSet = new Set();
      geoData.features.forEach(feature => {
        const props = feature.properties;
        // Use the correct property name from your GeoJSON
        if (props['ISO3166-1-Alpha-3']) geoCodesSet.add(props['ISO3166-1-Alpha-3'].toUpperCase());
        if (props['ISO3166-1-Alpha-2']) geoCodesSet.add(props['ISO3166-1-Alpha-2'].toUpperCase());
      });

      console.log("GeoJSON codes count:", geoCodesSet.size);
      console.log("Sample codes:", Array.from(geoCodesSet).slice(0, 5));

      // Filter countries that exist in both datasets
      const filtered = apiCountries.filter(country => {
        const codes = [
          country.cca3,
          country.cioc,
          ...(country.altSpellings || [])
        ].filter(Boolean).map(code => code.toUpperCase());

        return codes.some(code => geoCodesSet.has(code));
      });

      console.log("Filtered countries count:", filtered.length);

      if (!filtered.length) {
        setMessage("No matching countries found between datasets");
        setLoading(false);
        return;
      }

      setCountries(filtered);
      pickNewCountry(filtered);
      setLoading(false);
    }).catch(error => {
      console.error("Error loading data:", error);
      setMessage(`Failed to load data: ${error.message}`);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    fetch(geoUrl)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch GeoJSON: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log("GeoJSON data loaded:", data);
        setGeoData(data);
      })
      .catch(err => {
        console.error("Error loading GeoJSON:", err);
      });
  }, []);

  useEffect(() => {
    if (!geoData) {
      console.error("geoData is not defined yet");
      return;
    }

    // Use geoData safely here
  }, [geoData]);

  const handleCountryClick = (geo) => {
    if (revealed || !target) return;

    const geoCode = (geo.properties['ISO3166-1-Alpha-3'] || "").toUpperCase();
    const targetCode = (target.cca3 || "").toUpperCase();

    console.log('Clicked country code:', geoCode);
    console.log('Target country code:', targetCode);

    if (geoCode === targetCode) {
      setMessage("Correct! 🎉");
      setScore(s => s + 1);
      setRevealed(true);
      setCorrectGuesses(prev => new Set([...prev, geoCode])); // Add to correct guesses
      setTimeout(() => pickNewCountry(), 1500);
    } else {
      if (tries + 1 >= 3) {
        setRevealed(true);
        setMessage(`Wrong! The answer was ${target.name.common}`);
        setTimeout(() => pickNewCountry(), 2000);
      } else {
        setTries(tries + 1);
        setMessage(`Wrong! Tries left: ${2 - tries}`);
      }
    }
  };

  const handleZoom = (delta) => {
    setPosition(pos => ({
      ...pos,
      scale: Math.max(100, Math.min(400, pos.scale + (delta * 50))),
      // Adjust center based on scale to keep map centered
      center: [pos.center[0], pos.center[1]]
    }));
  };

  // Add handleMoveEnd function to handle map panning
  const handleMoveEnd = (position) => {
    setPosition(pos => ({
      ...pos,
      coordinates: position.coordinates,
      center: position.coordinates
    }));
  };

  const handleMouseMove = debounce((event) => {
    setTooltip(t => ({ ...t, x: event.clientX, y: event.clientY }));
  }, 50);

  const geographyStyle = {
    default: { fill: "#e0eafc", stroke: "#1976d2", strokeWidth: 0.6 },
    hover: { fill: "#F8ED8C", stroke: "#1976d2", strokeWidth: 0.6 },
    pressed: { fill: "#F8ED8C", stroke: "#1976d2", strokeWidth: 0.6 }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!target) return <div className="error">Error loading game</div>;
  if (!geoData) return <div className="loading">Loading map data...</div>;

  return (
    <div className="find-country-container">
      <h2 className="game-title">Find the Country</h2>
      <p className="target-country">
        Find: <b className="target-country-name">{target.name.common}</b>
      </p>
      <p className="game-stats">
        Score: <span className="score">{score}</span> |
        Tries left: <span className="tries">{3 - tries}</span>
      </p>
      <div className="map-container">
        <div className="zoom-controls">
          <button
            className="zoom-button"
            onClick={() => handleZoom(1)}
          >
            +
          </button>
          <button
            className="zoom-button"
            onClick={() => handleZoom(-1)}
          >
            -
          </button>
        </div>
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{
            scale: position.scale,
            center: position.center
          }}
          width={800}
          height={400}
          style={{
            width: "100%",
            height: "auto"
          }}
        >
          <ZoomableGroup
            center={position.coordinates}
            zoom={Math.min(Math.max(position.scale / 100, 1), 5)}
            onMoveEnd={handleMoveEnd}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const geoCode = (geo.properties['ISO3166-1-Alpha-3'] || "").toUpperCase();
                  const isTarget = revealed && geoCode === target.cca3?.toUpperCase();
                  const isCorrectlyGuessed = correctGuesses.has(geoCode);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => !revealed && !isCorrectlyGuessed && handleCountryClick(geo)}
                      style={geographyStyle}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        {tooltip.show && (
          <div 
            className="country-tooltip"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y + 10
            }}
          >
            {tooltip.content}
          </div>
        )}
      </div>
      <div className={`message ${message.startsWith("Correct") ? "message-correct" : "message-wrong"}`}>
        {message}
      </div>
    </div>
  );
}

export default FindCountryOnMap;