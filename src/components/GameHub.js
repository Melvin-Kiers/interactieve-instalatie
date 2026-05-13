import { useNavigate } from "react-router-dom";
import "../css/Leaderboard.css";
import hyperloopBg from "../assets/img/HyperloopGameScreen.png";
import video from "../assets/videos/bg-video.mp4";
import { useEffect } from "react";

export default function GameHub({ username, score, playedGames, saveToLeaderboard }) {
  const navigate = useNavigate();

  const games = [
    { id: 1, name: "Versnel de Hyperloop", route: "/games/uitleg/1" },
    { id: 2, name: "Magnet Switch", route: "/games/uitleg/2" },
    { id: 3, name: "Obstakels ontwijken", route: "/games/uitleg/3" },
  ];

  const allGamesPlayed = playedGames.length >= games.length;
  const hyperloopImg = localStorage.getItem("hyperloopImage");

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isPlayed = (id) => playedGames.includes(id);

      switch (e.key) {
        case "1":
          if (!isPlayed(1)) navigate("/games/uitleg/1");
          break;
        case "2":
          if (!isPlayed(2)) navigate("/games/uitleg/2");
          break;
        case "3":
          if (!isPlayed(3)) navigate("/games/uitleg/3");
          break;
        case "4":
          if (allGamesPlayed) {
            saveToLeaderboard();
            navigate("/leaderboard");
          }
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, playedGames]);


  return (
    <section className="game-hub">
      <div className="container">
        <img src={hyperloopBg} className="bg-image-game" />
        <video className="bg-video" src={video} autoPlay loop muted playsInline/>

        <div className="welcome-grid">
          <h1>Welkom in je Hyperloop, {username}</h1>
          <h2>Score: {score} ⭐</h2>
        </div>

        <div className="game-grid">
          {games.map((game) => {
            const isPlayed = playedGames.includes(game.id);
            return (
              <div
                key={game.id}
                className={`game-card ${isPlayed ? "disabled" : ""}`}
                onClick={() => !isPlayed && navigate(game.route)}
              >
                <h2>{game.name}</h2>
                {isPlayed ? <p>✅ Al gespeeld</p> : <p>Klik om te spelen</p>}
              </div>
            );
          })}
        </div>

        {/* Hieronder gebruik je de variabelen weer */}
        {allGamesPlayed && (
          <button 
            className="col-6 leaderboard-overlay btn btn-warning" 
            onClick={() => {
              saveToLeaderboard();
              navigate("/leaderboard");
            }}
          >
            Bekijk Klassement 🏆
          </button>
        )}
      </div>
    </section>
  );
}