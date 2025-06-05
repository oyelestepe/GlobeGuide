import React, { useEffect, useState, useRef } from "react";
import "./gamesCss/CountryInfoGuess.css";
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getClues(country) {
  const clues = [];
  if (country.capital && country.capital[0]) clues.push(`Capital: ${country.capital[0]}`);
  if (country.region) clues.push(`Region: ${country.region}`);
  if (country.subregion) clues.push(`Subregion: ${country.subregion}`);
  if (country.population) clues.push(`Population: ${country.population.toLocaleString()}`);
  if (country.area) clues.push(`Area: ${country.area.toLocaleString()} km²`);
  if (country.languages) clues.push(`Languages: ${Object.values(country.languages).join(", ")}`);
  if (country.currencies) clues.push(`Currency: ${Object.values(country.currencies)[0].name}`);
  if (country.borders && country.borders.length) clues.push(`Borders: ${country.borders.length} countries`);
  if (country.demonyms && country.demonyms.eng && country.demonyms.eng.m) clues.push(`Demonym: ${country.demonyms.eng.m}`);
  return clues;
}

function normalize(str) {
  return str.trim().toLowerCase();
}

function CountryInfoGuess() {
  const [countries, setCountries] = useState([]);
  const [question, setQuestion] = useState(null);
  const [clues, setClues] = useState([]);
  const [shownClues, setShownClues] = useState([]);
  const [guess, setGuess] = useState("");
  const [wrongCount, setWrongCount] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then(res => res.json())
      .then(data => {
        setCountries(data);
        startNewQuestion(data);
      });
  }, []);

  const startNewQuestion = (data = countries) => {
    const correctCountry = data[getRandomInt(data.length)];
    const cluesArr = getClues(correctCountry);
    setQuestion(correctCountry);
    setClues(cluesArr);
    setShownClues(cluesArr.slice(0, 2)); // Show 2 clues at start
    setGuess("");
    setWrongCount(0);
    setRevealed(false);
  };

  const handleGuess = (e) => {
    e.preventDefault();
    if (!question || revealed || gameOver) return;
    if (!guess.trim()) return; // Prevent empty guesses

    if (
      normalize(guess) === normalize(question.name.common) ||
      (question.altSpellings && question.altSpellings.some(a => normalize(a) === normalize(guess))) ||
      normalize(question.name.common).includes(normalize(guess))
    ) {
      setScore(score + 1);
      setTimeout(() => startNewQuestion(), 1200);
    } else {
      const newWrong = wrongCount + 1;
      setWrongCount(newWrong);
      if (newWrong >= 5) {
        setRevealed(true);
        setTimeout(() => startNewQuestion(), 2500);
      } else if (newWrong === 4 && question.flags && question.flags.png) {
        setShownClues([
          ...clues.slice(0, newWrong + 1),
          <span key="flag"><b>Flag:</b> <img src={question.flags.png} alt="flag" style={{width: 60, verticalAlign: "middle"}} /></span>
        ]);
      } else {
        setShownClues(clues.slice(0, Math.min(clues.length, newWrong + 2)));
      }
    }
    setGuess("");
  };

  const handleRestart = () => {
    setScore(0);
    setGameOver(false);
    setRevealed(false);
    startNewQuestion();
  };

  if (!question) return <div>Loading...</div>;

  return (
    <div className="country-info-guess-container country-info-guess" style={{ maxWidth: 400, margin: "40px auto", textAlign: "center", background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: 32 }}>
      <h2>Country Info Guess</h2>
      <p>Score: {score}</p>
      <div style={{ margin: "20px 0", textAlign: "left" }}>
        {shownClues.map((clue, idx) => (
          <p key={idx}><b>Clue {idx + 1}:</b> {clue}</p>
        ))}
      </div>
      {!revealed ? (
        <form onSubmit={handleGuess}>
          <input
            type="text"
            value={guess}
            onChange={e => setGuess(e.target.value)}
            placeholder="Type your guess..."
            style={{
              width: "90%",
              padding: "10px",
              borderRadius: 8,
              border: "1.5px solid #bbb",
              fontSize: "1.1em",
              marginBottom: 10
            }}
            disabled={revealed}
            autoFocus
          />
          <br />
          <button
            type="submit"
            style={{
              padding: "10px 24px",
              borderRadius: 8,
              fontSize: "1.1em",
              background: "#b7e4c7",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer"
            }}
            disabled={revealed}
          >
            Guess
          </button>
        </form>
      ) : (
        <div style={{ marginTop: 16, fontWeight: "bold", color: "#e63946" }}>
          The answer was: {question.name.common}
        </div>
      )}
      <div style={{ marginTop: 16, color: "#e63946" }}>
        Wrong guesses: {wrongCount} / 5
      </div>
      {revealed && (
        <button
          onClick={startNewQuestion}
          style={{
            marginTop: 20,
            padding: "10px 24px",
            borderRadius: 8,
            fontSize: "1.1em",
            background: "#b7e4c7",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Next
        </button>
      )}
      <div style={{ marginTop: 24 }}>
        <button
          onClick={handleRestart}
          style={{
            padding: "6px 18px",
            borderRadius: 8,
            fontSize: "1em",
            background: "#eee",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Restart Game
        </button>
      </div>
    </div>
  );
}

export default CountryInfoGuess;