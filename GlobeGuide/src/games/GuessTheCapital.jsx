import React, { useEffect, useState } from "react";
import "./gamesCss/GuessTheCapital.css";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function GuessTheCapital() {
  const [countries, setCountries] = useState([]);
  const [question, setQuestion] = useState(null);
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [askedCapitals, setAskedCapitals] = useState(new Set());
  const [timer, setTimer] = useState(10);
  const [showHint, setShowHint] = useState(false);

  // Fetch country data
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,capital,cca3,flags"
        );
        const data = await response.json();
        const filteredData = data.filter(
          (country) => country.capital && country.capital.length > 0
        ); // Only include countries with capitals
        setCountries(filteredData);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  // Generate a new question
  const generateQuestion = () => {
    const remainingCountries = countries.filter(
      (country) => !askedCapitals.has(country.capital[0])
    );

    if (remainingCountries.length === 0) {
      setGameOver(true); // End the game if no capitals are left
      return;
    }

    const correctIndex = getRandomInt(remainingCountries.length);
    const correctCountry = remainingCountries[correctIndex];

    // Get 3 random wrong options
    let options = [correctCountry];
    while (options.length < 4) {
      const randomCountry = countries[getRandomInt(countries.length)];
      if (
        !options.some((c) => c.cca3 === randomCountry.cca3) &&
        !askedCapitals.has(randomCountry.capital[0])
      ) {
        options.push(randomCountry);
      }
    }

    setAskedCapitals((prev) => new Set(prev).add(correctCountry.capital[0])); // Mark the capital as asked
    setQuestion(correctCountry);
    setChoices(shuffle(options));
    setSelected(null);
    setTimer(10); // Reset timer for the new question
    setShowHint(false); // Reset hint visibility
  };

  const handleGuess = (country) => {
    if (selected || gameOver) return;
    setSelected(country || {});
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
    setAskedCapitals(new Set());
    generateQuestion();
  };

  useEffect(() => {
    if (!question || gameOver) return;
    if (timer === 0) {
      handleGuess(null); // Treat as wrong if time runs out
      return;
    }
    const countdown = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(countdown);
  }, [timer, question, gameOver]);

  if (!countries.length) {
    return <div className="loading">Loading...</div>;
  }

  if (gameOver) {
    return (
      <div className="guess-the-capital-container">
        <h2>Game Over</h2>
        <p>
          Your score: <b>{score}</b>
        </p>
        <button className="restart-button" onClick={handleRestart}>
          Restart
        </button>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="guess-the-capital-container">
        <button className="start-game-button" onClick={generateQuestion}>
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="guess-the-capital-container">
      <h2 className="guess-the-capital-title">Guess the Country</h2>
      <p className="score-info">
        Score: {score} &nbsp; | &nbsp; ❌ {wrongCount} / 3
      </p>
      <p className={`timer ${timer <= 3 ? "timer-warning" : ""}`}>
        Time Left: {timer}s
      </p>
      <div className="question-container">
        <p className="question">
          What country has the capital <b>{question.capital[0]}</b>?
        </p>
        {showHint && (
          <img
            className="flag-hint"
            src={question.flags.png}
            alt={`${question.name.common} flag`}
          />
        )}
      </div>
      <button
        className="hint-button"
        onClick={() => setShowHint(true)}
        disabled={showHint}
      >
        Show Hint
      </button>
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

export default GuessTheCapital;