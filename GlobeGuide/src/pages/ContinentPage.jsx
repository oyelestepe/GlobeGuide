import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './pagesCss/ContinentPage.css';
const continentToApiRegion = {
  "africa": "africa",
  "asia": "asia",
  "europe": "europe",
  "north-america": "americas",
  "south-america": "americas",
  "australia": "oceania",
  "antarctica": "antarctic"
};

function ContinentPage() {
  const [countries, setCountries] = useState([]);
  const { name } = useParams();

  useEffect(() => {
    const region = continentToApiRegion[name] || name;
    fetch(`https://restcountries.com/v3.1/region/${region}`)
      .then(res => res.json())
      .then(data => {
        // Filter for North/South America if needed
        if (name === "north-america") {
          setCountries(data.filter(c => c.subregion === "Northern America" || c.subregion === "Central America" || c.subregion === "Caribbean"));
        } else if (name === "south-america") {
          setCountries(data.filter(c => c.subregion === "South America"));
        } else {
          setCountries(data);
        }
      })
      .catch(err => console.log("API error:", err));
  }, [name]);

  return (
    <div className='continent-page-root'>
      <Link to="/" className="back-to-map-btn">← Back to Map</Link>
      <h1>{name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ')}</h1>
      <div className="countries-grid">
        {countries.map(country => (
          <div key={country.cca3} className="country-card">
            <img src={country.flags.png} alt={`${country.name.common} flag`} />
            <h3>{country.name.common}</h3>
            <p><strong>Capital:</strong> {country.capital}</p>
            <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
            <p><strong>Area:</strong> {country.area.toLocaleString()} km²</p>
            <p><strong>Region:</strong> {country.region}</p>
            <p><strong>Subregion:</strong> {country.subregion}</p>
            <p><strong>Languages:</strong> {Object.values(country.languages || {}).join(', ')}</p>
            <p><strong>Currencies:</strong> {Object.values(country.currencies || {}).map(c => c.name).join(', ')}</p>
            <p><strong>Borders:</strong> {country.borders ? country.borders.join(', ') : 'None'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContinentPage;