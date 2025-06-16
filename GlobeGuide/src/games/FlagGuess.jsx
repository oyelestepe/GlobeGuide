import React, { useEffect, useState, useRef } from "react";
import "./gamesCss/FlagGuess.css";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function FlagGuess() {
  const [countries, setCountries] = useState([]);
  const [question, setQuestion] = useState(null);
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const [wrongCount, setWrongCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false); // New state for game start
  const timerRef = useRef();

  // Fetch country data
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,flags,cca3")
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);
      });
  }, []);

  // Timer effect
  useEffect(() => {
    if (!gameStarted || gameOver || !question) return;
    if (timer === 0) {
      handleGuess(null); // treat as wrong
      return;
    }
    timerRef.current = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timer, question, gameOver, gameStarted]);

  // Generate a new question
  const generateQuestion = (data = countries) => {
    if (!data.length) return;
    const correctIndex = getRandomInt(data.length);
    const correctCountry = data[correctIndex];

    // Get 3 random wrong options
    let options = [correctCountry];
    while (options.length < 4) {
      const randomCountry = data[getRandomInt(data.length)];
      if (!options.some((c) => c.cca3 === randomCountry.cca3)) {
        options.push(randomCountry);
      }
    }
    setTimer(10);
    setSelected(null);
    setQuestion(correctCountry);
    setChoices(shuffle(options));
  };

  const handleGuess = (country) => {
    if (selected || gameOver) return;
    setSelected(country || {}); // if null, treat as wrong
    let isCorrect = country && country.cca3 === question.cca3;
    if (isCorrect) {
      setScore(score + 1);
      setTimeout(() => generateQuestion(), 1000);
    } else {
      setWrongCount(wrongCount + 1);
      if (wrongCount + 1 >= 3) {
        setTimeout(() => setGameOver(true), 1000);
      } else {
        setTimeout(() => generateQuestion(), 1000);
      }
    }
  };

  const handleRestart = () => {
    setScore(0);
    setWrongCount(0);
    setGameOver(false);
    setTimer(10);
    setSelected(null);
    setGameStarted(false); // Reset game start
    setQuestion(null);
  };

  const handleStartGame = () => {
    setGameStarted(true);
    generateQuestion();
  };

  if (!gameStarted) {
    return (
      <div className="flag-guess-container">
        <h2 className="flag-guess-title">Flag Guess Game</h2>
        <button className="start-game-button" onClick={handleStartGame}>
          Start Game
        </button>
      </div>
    );
  }

  if (!question) return <div className="loading">Loading...</div>;

  if (gameOver) {
    return (
      <div className="flag-guess-container">
        <h2>Game Over</h2>
        <p>Your score: <b>{score}</b></p>
        <button className="restart-button" onClick={handleRestart}>
          Restart
        </button>
      </div>
    );
  }

  return (
    <div className="flag-guess-container">
      <h2 className="flag-guess-title">Flag Guess Game</h2>
      <p className="score-info">Score: {score} &nbsp; | &nbsp; ❌ {wrongCount} / 3</p>
      <p className={`timer ${timer <= 3 ? "timer-warning" : ""}`}>Time: {timer}s</p>
      <img className="flag-image" src={question.flags.png} alt="Flag" />
      <div className="choices-container">
        {choices.map((country) => (
          <button
            key={country.cca3}
            onClick={() => handleGuess(country)}
            disabled={!!selected}
            className={`choice-button ${
              selected
                ? country.cca3 === question.cca3
                  ? "correct-choice"
                  : country.cca3 === (selected.cca3 || "")
                  ? "wrong-choice"
                  : ""
                : ""
            }`}
          >
            {country.name.common}
          </button>
        ))}
      </div>
      {selected && (
        <div className="result-message">
          {selected.cca3 === question.cca3
            ? "Correct! 🎉"
            : `Wrong! The answer was ${question.name.common}.`}
        </div>
      )}
    </div>
  );
}

export default FlagGuess;