import React, { useEffect, useState } from "react";
import "./componentsCss/RandomCountry.css";

function RandomCountry() {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // Specify the fields to fetch
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags,currencies,languages,timezones,borders" // Removed 'independent' field
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const countries = await response.json();

        // Generate a random index based on the current day
        const today = new Date();
        const randomIndex = today.getDate() % countries.length;

        setCountry(countries[randomIndex]);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  if (!country) {
    return <div className="country-card-loading">Loading...</div>;
  }

  return (
    <div className="country-card">
      <img
        className="country-card-flag"
        src={country.flags.png}
        alt={`${country.name.common} flag`}
      />
      <h3 className="country-card-name">{country.name.common}</h3>
      <p className="country-card-info">
        <strong>Capital:</strong> {country.capital ? country.capital[0] : "N/A"}
      </p>
      <p className="country-card-info">
        <strong>Region:</strong> {country.region}
      </p>
      <p className="country-card-info">
        <strong>Population:</strong> {country.population.toLocaleString()}
      </p>
      <p className="country-card-info">
        <strong>Currency:</strong> {country.currencies ? Object.values(country.currencies)[0].name : "N/A"}
      </p>
        <p className="country-card-info">
            <strong>Languages:</strong> {country.languages ? Object.values(country.languages).join(", ") : "N/A"}    
        </p>
        <p className="country-card-info">
            <strong>Timezone:</strong> {country.timezones ? country.timezones[0] : "N/A"}
        </p>
        <p className="country-card-info">
            <strong>Neighbours:</strong> {country.borders ? country.borders.join(", ") : "None"}    
        </p>
    </div>
  );
}

export default RandomCountry;