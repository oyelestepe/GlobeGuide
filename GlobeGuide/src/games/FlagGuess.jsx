import React, { useEffect, useState, useRef } from "react";

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
  const timerRef = useRef();

  // Fetch country data
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then(res => res.json())
      .then(data => {
        setCountries(data);
        generateQuestion(data);
      });
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameOver || !question) return;
    if (timer === 0) {
      handleGuess(null); // treat as wrong
      return;
    }
    timerRef.current = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timer, question, gameOver]);

  // Generate a new question
  const generateQuestion = (data = countries) => {
    if (!data.length) return;
    const correctIndex = getRandomInt(data.length);
    const correctCountry = data[correctIndex];

    // Get 3 random wrong options
    let options = [correctCountry];
    while (options.length < 4) {
      const randomCountry = data[getRandomInt(data.length)];
      if (!options.some(c => c.cca3 === randomCountry.cca3)) {
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
    generateQuestion();
  };

  if (!question) return <div>Loading...</div>;

  if (gameOver) {
    return (
      <div style={{ maxWidth: 400, margin: "40px auto", textAlign: "center", background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: 32 }}>
        <h2>Game Over</h2>
        <p>Your score: <b>{score}</b></p>
        <button onClick={handleRestart} style={{ marginTop: 20, padding: "10px 24px", borderRadius: 8, fontSize: "1.1em", background: "#b7e4c7", border: "none", fontWeight: "bold", cursor: "pointer" }}>
          Restart
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", textAlign: "center", background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: 32 }}>
      <h2>Flag Guess Game</h2>
      <p>Score: {score} &nbsp; | &nbsp; ❌ {wrongCount} / 3</p>
      <p style={{ fontWeight: "bold", color: timer <= 3 ? "#e63946" : "#222" }}>Time: {timer}s</p>
      <img src={question.flags.png} alt="Flag" style={{ width: 200, height: 120, objectFit: "contain", borderRadius: 8, margin: "20px 0" }} />
      <div>
        {choices.map(country => (
          <button
            key={country.cca3}
            onClick={() => handleGuess(country)}
            disabled={!!selected}
            style={{
              display: "block",
              width: "100%",
              margin: "10px 0",
              padding: "12px",
              borderRadius: 8,
              border: "2px solid #eee",
              background: selected
                ? country.cca3 === question.cca3
                  ? "#b7e4c7"
                  : country.cca3 === (selected.cca3 || "")
                  ? "#ffb4a2"
                  : "#fff"
                : "#fff",
              color: "#333",
              fontWeight: "bold",
              cursor: selected ? "not-allowed" : "pointer",
              fontSize: "1.1em",
              transition: "background 0.2s, border 0.2s"
            }}
          >
            {country.name.common}
          </button>
        ))}
      </div>
      {selected && (
        <div style={{ marginTop: 16, fontWeight: "bold" }}>
          {selected.cca3 === question.cca3
            ? "Correct! 🎉"
            : `Wrong! The answer was ${question.name.common}.`}
        </div>
      )}
    </div>
  );
}

export default FlagGuess;