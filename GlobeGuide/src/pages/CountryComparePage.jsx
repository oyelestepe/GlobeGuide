import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import './pagesCss/CountryComparePage.css';
function CountryComparePage() {
  const { search } = useLocation();
  const [countries, setCountries] = useState([]);
  const [pair, setPair] = useState([]);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,flags,cca3,population,area,region,subregion,languages,currencies,borders")
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setCountries(data) : setCountries([]));
  }, []);

  useEffect(() => {
    if (!Array.isArray(countries)) return;
    const params = new URLSearchParams(search);
    const c1 = params.get("c1");
    const c2 = params.get("c2");
    if (c1 && c2) {
      const country1 = countries.find(country => country.cca3 === c1);
      const country2 = countries.find(country => country.cca3 === c2);
      if (country1 && country2) {
        setPair([country1, country2]);
      }
    }
  }, [search, countries]);

  if (pair.length < 2) return <div>Loading...</div>;

  return (
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
  );
}

export default CountryComparePage;