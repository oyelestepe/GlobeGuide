import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function CountryComparePage() {
  const { search } = useLocation();
  const [countries, setCountries] = useState([]);
  const [pair, setPair] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,flags,cca3,population,area,region,subregion,languages,currencies,borders")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => Array.isArray(data) ? setCountries(data) : setCountries([]))
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(true);
      });
  }, []);

  useEffect(() => {
    if (!Array.isArray(countries) || countries.length === 0) return;
    const params = new URLSearchParams(search);
    const c1 = params.get("c1");
    const c2 = params.get("c2");
    if (c1 && c2) {
      const findCountry = (code) => {
        if (!code) return undefined;
        let c = String(code).toUpperCase();
        return countries.find(country => 
          (country.cca3 && country.cca3.toUpperCase() === c) ||
          (country.name && country.name.common && country.name.common.toUpperCase() === c)
        );
      };
      const country1 = findCountry(c1);
      const country2 = findCountry(c2);
      if (country1 && country2) {
        setPair([country1, country2]);
      } else {
        setError(true);
      }
    }
  }, [search, countries]);

  if (error) {
    return (
      <div className="country-compare-container" style={{ textAlign: "center", paddingTop: "50px", color: "white" }}>
        <h2>Error loading country data</h2>
        <p>We couldn't find details for one or both of the selected countries.</p>
        <button onClick={() => window.history.back()} style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer", borderRadius: "8px", border: "1px solid #ccc", background: "transparent", color: "white" }}>Go Back</button>
      </div>
    );
  }

  if (pair.length < 2) return <div style={{ textAlign: "center", paddingTop: "50px", fontSize: "1.2rem", color: "white" }}>Loading...</div>;

  return (
    <>
    <Navbar />
    <div className="country-compare-container">
      <h2>Country Comparison</h2>
      <div className="compare-cards">
        {pair.map((country, idx) => (
          <div key={country.cca3} className="compare-card">
            <img src={country.flags.png} alt="flag" style={{ width: 80, marginBottom: 8, borderRadius: 8 }} />
            <h3>{country.name.common}</h3>
            <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
            <p><strong>Area:</strong> {country.area.toLocaleString()} km²</p>
            <p><strong>Region:</strong> {country.region}</p>
            <p><strong>Subregion:</strong> {country.subregion}</p>
            <p><strong>Languages:</strong> {country.languages ? Object.values(country.languages).join(", ") : "N/A"}</p>
            <p><strong>Currencies:</strong> {country.currencies ? Object.values(country.currencies).map(c => c.name).join(", ") : "N/A"}</p>
            <p><strong>Borders:</strong> {country.borders ? country.borders.join(", ") : "None"}</p>
          </div>
        ))}
      </div>
    </div>
    <Footer />
    </>
    
  );
}

export default CountryComparePage;