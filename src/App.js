import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import NameInput from "./components/NameInput";
import HyperloopDesigner from "./components/HyperloopDesigner";
import GameHub from "./components/GameHub";

import MiniGame1 from "./components/MiniGame1";

import "./css/App.css";

export default function App() {
  const [username, setUsername] = useState(
    () => localStorage.getItem("username") || ""
  );

  const [score, setScore] = useState(() => Number(localStorage.getItem("score")) || 0);

  const [playedGames, setPlayedGames] = useState(() => {
    return JSON.parse(localStorage.getItem("playedGames")) || [];
  });

  const updateScore = (points) => {
    const newScore = score + points;
    setScore(newScore);
    localStorage.setItem("score", newScore);
  };

  const markGameAsPlayed = (gameId) => {
    const updated = [...playedGames, gameId];
    setPlayedGames(updated);
    localStorage.setItem("playedGames", JSON.stringify(updated));
  };

  const handleReset = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("score");
    localStorage.removeItem("playedGames");

    setUsername("");
    setScore(0);
    setPlayedGames([]);
  };

  return (
    <Router>
      <div className="background-map"></div>

      <Routes>
        <Route
          path="/"
          element={
            !username ? (
              <NameInput setUsername={setUsername} />
            ) : (
              <Navigate to="/designer" />
            )
          }
        />

        <Route
          path="/designer"
          element={
            username ? (
              <HyperloopDesigner username={username} onReset={handleReset} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/games"
          element={
            username ? (
              <GameHub 
                username={username}
                score={score}
                playedGames={playedGames}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/game/1"
          element={
            username ? (
              <MiniGame1 
                updateScore={updateScore}
                markGameAsPlayed={markGameAsPlayed}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}