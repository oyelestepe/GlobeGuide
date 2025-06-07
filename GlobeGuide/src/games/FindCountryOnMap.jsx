import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "/data/countries.geojson";

function FindCountryOnMap() {
  const [countries, setCountries] = useState([]);
  const [target, setTarget] = useState(null);
  const [tries, setTries] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

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

  const handleCountryClick = (geo) => {
    if (revealed || !target) return;

    // Use the correct property name from your GeoJSON
    const geoCode = (geo.properties['ISO3166-1-Alpha-3'] || "").toUpperCase();
    const targetCode = (target.cca3 || "").toUpperCase();

    console.log('Clicked country code:', geoCode);
    console.log('Target country code:', targetCode);

    if (geoCode === targetCode) {
      setMessage("Correct! 🎉");
      setScore(s => s + 1);
      setRevealed(true);
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

  if (loading) return <div>Loading...</div>;
  if (!target) return <div>Error loading game</div>;

  return (
    <div style={{
      maxWidth: 900,
      margin: "40px auto",
      textAlign: "center",
      background: "linear-gradient(135deg, #f8fafc 0%, #e0f7fa 100%)",
      borderRadius: 24,
      boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
      padding: "32px 16px 24px 16px",
      border: "1px solid #e0e0e0"
    }}>
      <h2 style={{ fontSize: 32, color: "#222", marginBottom: 8, letterSpacing: 1 }}>Find the Country</h2>
      <p style={{ fontSize: 20, margin: "8px 0 0 0" }}>
        Find: <b style={{ color: "#1976d2" }}>{target.name.common}</b>
      </p>
      <p style={{ fontSize: 16, color: "#555", margin: "4px 0 20px 0" }}>
        Score: <span style={{ color: "#43a047", fontWeight: 600 }}>{score}</span> |
        Tries left: <span style={{ color: "#e63946", fontWeight: 600 }}>{3 - tries}</span>
      </p>
      <div style={{
        margin: "0 auto",
        width: "100%",
        maxWidth: 820,
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        padding: 18,
        border: "1px solid #e0e0e0"
      }}>
        <ComposableMap projection="geoEqualEarth">
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => {
                const isTarget = revealed &&
                  geo.properties['ISO3166-1-Alpha-3']?.toUpperCase() === target.cca3?.toUpperCase();

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => !revealed && handleCountryClick(geo)}
                    style={{
                      default: {
                        fill: isTarget ? "#b7e4c7" : "#e0eafc",
                        stroke: "#1976d2",
                        strokeWidth: 0.6,
                        outline: "none",
                        cursor: revealed ? "not-allowed" : "pointer",
                        transition: "fill 0.2s"
                      },
                      hover: {
                        fill: "#90caf9",
                        stroke: "#1976d2",
                        strokeWidth: 1,
                        outline: "none",
                        cursor: revealed ? "not-allowed" : "pointer"
                      },
                      pressed: {
                        fill: "#e63946",
                        stroke: "#1976d2",
                        strokeWidth: 1,
                        outline: "none"
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
      <div style={{
        marginTop: 24,
        fontWeight: "bold",
        fontSize: 20,
        color: message.startsWith("Correct") ? "#43a047" : "#e63946",
        minHeight: 28
      }}>
        {message}
      </div>
    </div>
  );
}

export default FindCountryOnMap;