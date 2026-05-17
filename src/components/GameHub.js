import { useNavigate } from "react-router-dom";
import "../css/Leaderboard.css";
import hyperloopBg from "../assets/img/HyperloopGameScreen.png";
import video from "../assets/videos/bg-video.mp4";
import musicFile from "../assets/sounds/gamehub.mp3"; 
import { useEffect, useRef } from "react";

export default function GameHub({ username, score, playedGames, saveToLeaderboard }) {
  const navigate = useNavigate();
  const audioRef = useRef(null); // Gebruik een ref in plaats van een globale variabele

  const games = [
    { id: 1, name: "Rem precies goed", route: "/games/uitleg/1" },
    { id: 2, name: "Magneet Switch", route: "/games/uitleg/2" },
    { id: 3, name: "Houdt de Hyperloop stabiel", route: "/games/uitleg/3" },
  ];

  const allGamesPlayed = playedGames.length >= games.length;

  useEffect(() => {
    // Initialiseer audio alleen binnen de component
    if (!audioRef.current) {
      audioRef.current = new Audio(musicFile);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.1;
    }

    const startMusic = () => {
      audioRef.current?.play().catch(() => {
        // Autoplay blokkade
      });
    };

    window.addEventListener("mousedown", startMusic);
    window.addEventListener("keydown", startMusic);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = ""; // Forceer de browser om de audio-stream los te laten
        audioRef.current.load();
        audioRef.current = null;
      }
      window.removeEventListener("mousedown", startMusic);
      window.removeEventListener("keydown", startMusic);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isPlayed = (id) => playedGames.includes(id);

      switch (e.key) {
        case "1": if (!isPlayed(1)) navigate("/games/uitleg/1"); break;
        case "2": if (!isPlayed(2)) navigate("/games/uitleg/2"); break;
        case "3": if (!isPlayed(3)) navigate("/games/uitleg/3"); break;
        case "Enter":
          if (allGamesPlayed) {
            saveToLeaderboard();
            navigate("/leaderboard");
          }
          break;
        default: break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, playedGames, allGamesPlayed, saveToLeaderboard]);

  return (
    <section className="game-hub">
      <div className="container">
        <img src={hyperloopBg} className="bg-image-game" alt="background" />
        
        <video 
          className="bg-video" 
          autoPlay 
          loop 
          muted 
          playsInline
          preload="none" // Voorkomt dat de browser de hele video al in het RAM pompt
        >
          <source src={video} type="video/mp4" />
        </video>

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
