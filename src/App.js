// import { useState } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";

// import NameInput from "./components/NameInput";
// import HyperloopDesigner from "./components/HyperloopDesigner";
// import GameHub from "./components/GameHub";

// import MiniGame1 from "./components/MiniGame1";
// import MiniGame2 from "./components/MiniGame2";
// import MiniGame3 from "./components/MiniGame3";
// import MiniGameIntro from "./components/MiniGameIntro";
// import Leaderboard from "./components/Leaderboard";

// import "./css/App.css";


// // 🔁 Dynamische game router
// const MiniGameRouter = ({ updateScore, markGameAsPlayed, playedGames }) => {
//   const { id } = useParams();
//   const gameId = parseInt(id);

//   if (playedGames.includes(gameId)) {
//     return <Navigate to="/games" />;
//   }

//   if (id === "1") return <MiniGame1 updateScore={updateScore} markGameAsPlayed={markGameAsPlayed} />;
//   if (id === "2") return <MiniGame2 updateScore={updateScore} markGameAsPlayed={markGameAsPlayed} />;
//   if (id === "3") return <MiniGame3 updateScore={updateScore} markGameAsPlayed={markGameAsPlayed} />;

//   return <div>Game niet gevonden</div>;
// };


// export default function App() {
//   const [username, setUsername] = useState(
//     () => localStorage.getItem("username") || ""
//   );

//   const [score, setScore] = useState(
//     () => Number(localStorage.getItem("score")) || 0
//   );

//   const [playedGames, setPlayedGames] = useState(() => {
//     return JSON.parse(localStorage.getItem("playedGames")) || [];
//   });

//   const updateScore = (points) => {
//     const newScore = score + points;
//     setScore(newScore);
//     localStorage.setItem("score", newScore);
//   };

//   const markGameAsPlayed = (gameId) => {
//     const updated = [...playedGames, gameId];
//     setPlayedGames(updated);
//     localStorage.setItem("playedGames", JSON.stringify(updated));
//   };

//   const saveFinalScoreToLeaderboard = () => {
//     const existingScores = JSON.parse(localStorage.getItem("globalLeaderboard")) || [];
    
//     const newEntry = {
//       name: username,
//       score: score,
//       pod: localStorage.getItem("hyperloopImage"),
//       date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
//     };

//     const updatedLeaderboard = [...existingScores, newEntry];
//     localStorage.setItem("globalLeaderboard", JSON.stringify(updatedLeaderboard));
//   };

//   const handleReset = () => {
//     // Wis alle speler-specifieke data uit localStorage
//     localStorage.removeItem("username");
//     localStorage.removeItem("score");
//     localStorage.removeItem("playedGames");
//     localStorage.removeItem("hyperloopImage"); // Ook het design wissen voor de volgende

//     // Reset de state naar de beginwaarden
//     setUsername("");
//     setScore(0);
//     setPlayedGames([]);
//   };

//   return (
//     <Router>
//       <div className="background-map"></div>

//       <Routes>
//         <Route
//           path="/"
//           element={
//             !username ? (
//               <NameInput setUsername={setUsername} />
//             ) : (
//               <Navigate to="/designer" />
//             )
//           }
//         />

//         <Route
//           path="/designer"
//           element={
//             username ? (
//               <HyperloopDesigner username={username} onReset={handleReset} />
//             ) : (
//               <Navigate to="/" />
//             )
//           }
//         />

//         <Route
//           path="/games"
//           element={
//             username ? (
//               <GameHub 
//                 username={username}
//                 score={score}
//                   setScore={setScore}

//                 playedGames={playedGames}
//                 saveToLeaderboard={saveFinalScoreToLeaderboard}
//               />
//             ) : (
//               <Navigate to="/" />
//             )
//           }
//         />

//         <Route
//           path="/games/uitleg/:id"
//           element={username ? <MiniGameIntro /> : <Navigate to="/" />}
//         />

//         <Route
//           path="/game/:id"
//           element={
//             username ? (
//               <MiniGameRouter 
//                 updateScore={updateScore}
//                 markGameAsPlayed={markGameAsPlayed}
//                 playedGames={playedGames}
//               />
//             ) : (
//               <Navigate to="/" />
//             )
//           }
//         />

//         {/* ✅ Geef handleReset door aan het Leaderboard */}
//         <Route path="/leaderboard" element={<Leaderboard onReset={handleReset} />} />

//       </Routes>
//     </Router>
//   );
// }

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";

import NameInput from "./components/NameInput";
import HyperloopDesigner from "./components/HyperloopDesigner";
import GameHub from "./components/GameHub";
import GameReview from "./components/GameReview";

import MiniGame1 from "./components/MiniGame1";
import MiniGame2 from "./components/MiniGame2";
import MiniGame3 from "./components/MiniGame3";
import MiniGameIntro from "./components/MiniGameIntro";
import Leaderboard from "./components/Leaderboard";

import "./css/App.css";
import IdleTracker from "./components/IdleTracker";


// 🔁 MiniGame Router
const MiniGameRouter = ({ updateScore, markGameAsPlayed, saveGameResult, playedGames }) => {
  const { id } = useParams();
  const gameId = parseInt(id);

  if (playedGames.includes(gameId)) {
    return <Navigate to="/games" />;
  }

  const commonProps = {
    updateScore,
    markGameAsPlayed,
    saveGameResult,
  };

  if (id === "1") return <MiniGame1 {...commonProps} />;
  if (id === "2") return <MiniGame2 {...commonProps} />;
  if (id === "3") return <MiniGame3 {...commonProps} />;

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

  // 📊 per-minigame resultaten
  const [gameResults, setGameResults] = useState(() => {
    return JSON.parse(localStorage.getItem("gameResults")) || [];
  });

  // ➕ totale score
  const updateScore = (points) => {
    const newScore = score + points;
    setScore(newScore);
    localStorage.setItem("score", newScore);
  };

  // 🎮 minigame gespeeld
  const markGameAsPlayed = (gameId) => {
    const updated = [...playedGames, gameId];
    setPlayedGames(updated);
    localStorage.setItem("playedGames", JSON.stringify(updated));
  };

  // 📦 per game score opslaan
  const saveGameResult = (gameId, gameScore) => {
    const updated = [
      ...gameResults.filter(g => g.id !== gameId),
      { id: gameId, score: gameScore }
    ];

    setGameResults(updated);
    localStorage.setItem("gameResults", JSON.stringify(updated));
  };

  // 🏁 leaderboard save
  const saveFinalScoreToLeaderboard = () => {
    const existingScores = JSON.parse(localStorage.getItem("globalLeaderboard")) || [];

    const newEntry = {
      name: username,
      score: score,
      pod: localStorage.getItem("hyperloopImage"),
      date:
        new Date().toLocaleDateString() +
        " " +
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
    };

    const updatedLeaderboard = [...existingScores, newEntry];
    localStorage.setItem("globalLeaderboard", JSON.stringify(updatedLeaderboard));
  };

  // 🔄 reset game
  const handleReset = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("score");
    localStorage.removeItem("playedGames");
    localStorage.removeItem("gameResults");
    localStorage.removeItem("hyperloopImage");

    setUsername("");
    setScore(0);
    setPlayedGames([]);
    setGameResults([]);
  };

  return (
    <Router>
      <IdleTracker timeout={75000}/>

      <div className="background-map"></div>

      <Routes>
        {/* HOME */}
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
                setScore={setScore}
                playedGames={playedGames}
                saveToLeaderboard={saveFinalScoreToLeaderboard}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* INTRO */}
        <Route
          path="/games/uitleg/:id"
          element={username ? <MiniGameIntro /> : <Navigate to="/" />}
        />

        {/* MINIGAMES */}
        <Route
          path="/game/:id"
          element={
            username ? (
              <MiniGameRouter
                updateScore={updateScore}
                markGameAsPlayed={markGameAsPlayed}
                saveGameResult={saveGameResult}
                playedGames={playedGames}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* LEADERBOARD */}
        <Route
          path="/leaderboard"
          element={<Leaderboard onReset={handleReset} />}
        />

        {/* REVIEW PAGINA */}
        <Route
          path="/game-review"
          element={
            username ? <GameReview /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
}