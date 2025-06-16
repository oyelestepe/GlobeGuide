import React, { useEffect, useState } from "react";
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
  const [feedback, setFeedback] = useState(""); // Feedback for wrong guesses

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,region,subregion,population,area,languages,currencies,borders,demonym,flags")
      .then((res) => res.json())
      .then((data) => {
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
    setFeedback(""); // Reset feedback
  };

  const handleGuess = (e) => {
    e.preventDefault();
    if (!question || revealed || gameOver) return;
    if (!guess.trim()) return; // Prevent empty guesses

    if (
      normalize(guess) === normalize(question.name.common) ||
      (question.altSpellings && question.altSpellings.some((a) => normalize(a) === normalize(guess))) ||
      normalize(question.name.common).includes(normalize(guess))
    ) {
      setScore(score + 1);
      setFeedback("Correct! 🎉");
      setTimeout(() => startNewQuestion(), 1200);
    } else {
      const newWrong = wrongCount + 1;
      setWrongCount(newWrong);
      setFeedback("Wrong guess! Try again.");
      if (newWrong >= 3) { // Reduced guesses to 3
        setRevealed(true);
        setTimeout(() => startNewQuestion(), 2500);
      }
    }
    setGuess("");
  };

  const handleHintRequest = () => {
    if (shownClues.length < clues.length) {
      setShownClues(clues.slice(0, shownClues.length + 1)); // Show one more clue
    }
  };

  const handleRestart = () => {
    setScore(0);
    setGameOver(false);
    setRevealed(false);
    startNewQuestion();
  };

  if (!question) return <div className="loading">Loading...</div>;

  return (
    <div className="country-info-guess-container">
      <h2 className="country-info-guess-title">Country Info Guess</h2>
      <p className="country-info-guess-score">Score: {score}</p>
      <div className="country-info-guess-clues">
        {shownClues.map((clue, idx) => (
          <p key={idx} className={idx === shownClues.length - 1 ? "new-clue" : ""}>
            <b>Clue {idx + 1}:</b> {clue}
          </p>
        ))}
      </div>
      {!revealed ? (
        <form onSubmit={handleGuess}>
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Type your guess..."
            className="country-info-guess-input"
            autoFocus
          />
          <button type="submit" className="country-info-guess-btn">
            Guess
          </button>
        </form>
      ) : (
        <div className="answer-reveal">The answer was: {question.name.common}</div>
      )}
      <button onClick={handleHintRequest} className="hint-btn">
        Request Hint
      </button>
      <div className="wrong-count">Wrong guesses: {wrongCount} / 3</div>
      {feedback && <div className="feedback">{feedback}</div>}
      {revealed && (
        <button onClick={startNewQuestion} className="next-btn">
          Next
        </button>
      )}
      <button onClick={handleRestart} className="restart-btn">
        Restart Game
      </button>
    </div>
  );
}

export default CountryInfoGuess;