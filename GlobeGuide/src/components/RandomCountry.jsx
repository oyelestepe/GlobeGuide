import React, { useEffect, useState } from "react";
import "./componentsCss/RandomCountry.css";

function RandomCountry() {
  const [country, setCountry] = useState(null);
  const [neighbors, setNeighbors] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags,currencies,languages,timezones,borders,cca3"
        );
        const countries = await response.json();

        const today = new Date();
        const randomIndex = today.getDate() % countries.length;

        const selectedCountry = countries[randomIndex];
        setCountry(selectedCountry);

        if (selectedCountry.borders) {
          const neighborCodes = selectedCountry.borders.join(",");
          const neighborsResponse = await fetch(
            `https://restcountries.com/v3.1/alpha?codes=${neighborCodes}&fields=name,flags`
          );
          const neighborsData = await neighborsResponse.json();
          setNeighbors(neighborsData);
        } else {
          setNeighbors([]);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  if (!country) return <div className="loading">Loading...</div>;

  return (
    <div className="country-day-container">
      <h2 className="country-title">
        Country of the day: <span>{country.name.common}</span>
      </h2>

      <div className="flag-and-neighbors">
        <div className="main-flag">
          <img src={country.flags.png} alt={`${country.name.common} flag`} />
        </div>

        <div className="neighbor-flags">
          {(Array.isArray(neighbors) ? neighbors : []).map((neighbor) => (
            <div className="neighbor-flag" key={neighbor.name.common}>
              <img src={neighbor.flags.png} alt={neighbor.name.common} title={neighbor.name.common} />
            </div>
          ))}
        </div>
      </div>

      <div className="facts">
        <p><strong>Capital:</strong> {country.capital?.[0] || "N/A"}</p>
        <p><strong>Region:</strong> {country.region}</p>
        <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
        <p><strong>Currency:</strong> {country.currencies ? Object.values(country.currencies)[0].name : "N/A"}</p>
        <p><strong>Languages:</strong> {country.languages ? Object.values(country.languages).join(", ") : "N/A"}</p>
        <p><strong>Timezone:</strong> {country.timezones?.[0] || "N/A"}</p>
      </div>
    </div>
  );
}

export default RandomCountry;
