import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";

import NameInput from "./components/NameInput";
import HyperloopDesigner from "./components/HyperloopDesigner";
import GameHub from "./components/GameHub";

import MiniGame1 from "./components/MiniGame1";
import MiniGame2 from "./components/MiniGame2";
import MiniGameIntro from "./components/MiniGameIntro";

import "./css/App.css";


// 🔁 Dynamische game router
const MiniGameRouter = ({ updateScore, markGameAsPlayed }) => {
  const { id } = useParams();

  if (id === "1") {
    return <MiniGame1 updateScore={updateScore} markGameAsPlayed={markGameAsPlayed} />;
  }

  if (id === "2") {
    return <MiniGame2 updateScore={updateScore} markGameAsPlayed={markGameAsPlayed} />;
  }

  return <div>Game niet gevonden</div>;
};


export default function App() {
  const [username, setUsername] = useState(
    () => localStorage.getItem("username") || ""
  );

  const [score, setScore] = useState(
    () => Number(localStorage.getItem("score")) || 0
  );

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

        {/* START */}
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

        {/* DESIGNER */}
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

        {/* GAME HUB */}
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

        {/* 🔥 NIEUWE STAP: INTRO PER GAME */}
        <Route
          path="/games/uitleg/:id"
          element={
            username ? (
              <MiniGameIntro />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* 🔥 DYNAMISCHE GAME ROUTE */}
        <Route
          path="/game/:id"
          element={
            username ? (
              <MiniGameRouter 
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