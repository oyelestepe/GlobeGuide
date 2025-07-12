import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from "../components/Footer";
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const PROPERTIES = [
  { key: "population", label: "population" },
  { key: "area", label: "area" },
  { key: "borders", label: "number of neighbors", isCount: true }
];

function getRandomProperty() {
  return PROPERTIES[getRandomInt(PROPERTIES.length)];
}

function GeoDuel() {
  const [countries, setCountries] = useState([]);
  const [pair, setPair] = useState([]);
  const [propertyObj, setPropertyObj] = useState(PROPERTIES[0]);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(null);
  const { search } = useLocation();

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

  const startNewRound = () => {
    if (countries.length < 2) return;
    let idx1 = getRandomInt(countries.length);
    let idx2;
    do {
      idx2 = getRandomInt(countries.length);
    } while (idx2 === idx1);
    setPair([countries[idx1], countries[idx2]]);
    setResult(null);
    setPropertyObj(getRandomProperty());
  };

  useEffect(() => {
    if (countries.length > 1) startNewRound();
  }, [countries]);

  const handleGuess = (guessIdx) => {
    const [c1, c2] = pair;
    let v1, v2;
    if (propertyObj.isCount) {
      v1 = Array.isArray(c1.borders) ? c1.borders.length : 0;
      v2 = Array.isArray(c2.borders) ? c2.borders.length : 0;
    } else {
      v1 = c1[propertyObj.key] || 0;
      v2 = c2[propertyObj.key] || 0;
    }
    const correct = (v1 === v2) ? null : (v1 > v2 ? 0 : 1);
    if (guessIdx === correct) {
      setScore(score + 1);
      setResult(
        <span style={{ color: "#38b000" }}>
          Correct!<br />
          {c1.name.common}: <b>{v1.toLocaleString()}</b> vs {c2.name.common}: <b>{v2.toLocaleString()}</b>
          <br />
          <b>
            {v1 === v2
              ? "Both are equal!"
              : `${(v1 > v2 ? c1.name.common : c2.name.common)} has the higher ${propertyObj.label}.`}
          </b>
        </span>
      );
      setTimeout(startNewRound, 1800);
    } else {
      setResult(
        <span style={{ color: "#e63946" }}>
          Wrong!<br />
          {c1.name.common}: <b>{v1.toLocaleString()}</b> vs {c2.name.common}: <b>{v2.toLocaleString()}</b>
          <br />
          <b>
            {v1 === v2
              ? "Both are equal!"
              : `${(v1 > v2 ? c1.name.common : c2.name.common)} has the higher ${propertyObj.label}.`}
          </b>
        </span>
      );
      setTimeout(startNewRound, 2500);
    }
  };

  if (pair.length < 2) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="country-info-guess-container country-info-guess">
      <h2>Geo Duel</h2>
      <div className="country-info-guess-score">Score: {score}</div>
      <div style={{ margin: "24px 0", fontWeight: "bold" }}>
        Which country has a higher{" "}
        <span style={{ color: "#5e60ce" }}>{propertyObj.label}</span>?
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        {pair.map((country, idx) => (
          <button
            key={country.cca3}
            onClick={() => handleGuess(idx)}
            className="country-bluff-btn"
            style={{
              flex: 1,
              padding: 18,
              borderRadius: 12,
              border: "2px solid #eee",
              background: "#fff",
              fontWeight: "bold",
              fontSize: "1.1em",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              transition: "background 0.2s"
            }}
            disabled={!!result}
          >
            <img src={country.flags.png} alt="flag" style={{ width: 60, marginBottom: 8, borderRadius: 6 }} /><br />
            {country.name.common}
          </button>
        ))}
      </div>
      {result && (
        <div style={{ marginTop: 24, fontWeight: "bold", color: result === "Correct!" ? "#38b000" : "#e63946" }}>
          {result}
        </div>
      )}
    </div>
    <Footer />
    </>
  );
}

export default GeoDuel;