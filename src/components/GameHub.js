import { useNavigate } from "react-router-dom";
import "../css/Leaderboard.css";
import hyperloopBg from "../assets/img/HyperloopGameScreen.png";
import video from "../assets/videos/bg-video.mp4";
import musicFile from "../assets/sounds/gamehub.mp3"; 
import { useEffect, useRef } from "react";

export default function GameHub({ username, score, playedGames, saveToLeaderboard }) {
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const games = [
    { id: 1, name: "Rem precies goed", route: "/games/uitleg/1", color: "blauwe" },
    { id: 2, name: "Magneet Switch", route: "/games/uitleg/2", color: "zwarte" },
    { id: 3, name: "Houdt de Hyperloop stabiel", route: "/games/uitleg/3", color: "groene" },
  ];

  const allGamesPlayed = playedGames.length >= games.length;

  useEffect(() => {
    
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
        audioRef.current.src = "";
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
        case " ": if (!isPlayed(1)) navigate("/games/uitleg/1"); break;
        case "ArrowDown": if (!isPlayed(2)) navigate("/games/uitleg/2"); break;
        case "ArrowUp": if (!isPlayed(3)) navigate("/games/uitleg/3"); break;
        case "ArrowRight":
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

  function getColor(name) {
    const colors = {
      blauwe: "#003DAD",
      zwarte: "#000000",
      groene: "#114922",
    };
    return colors[name] ?? "inherit";
  }

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
          preload="none"
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
                className={`game-card ${game.color} ${isPlayed ? "disabled" : ""}`}
                onClick={() => !isPlayed && navigate(game.route)}
              >
                <h2>{game.name}</h2>

                {isPlayed ? (
                  <p>✅ Minigame voltooid</p>
                ) : (
                  <p>
                    Druk op de{" "}
                    <strong>
                      <span style={{ color: getColor(game.color) }}>
                        {game.color}
                      </span>{" "}
                    </strong>
                    knop om te starten
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {allGamesPlayed && (
          <button 
            className="col-8 leaderboard-overlay btn btn-orange" 
            style={{ fontSize: "2.5rem" }}
            onClick={() => {
              saveToLeaderboard();
              navigate("/leaderboard");
            }}
          >
            Bekijk je score, en die van andere! 🏆
          </button>
        )}
      </div>
    </section>
  );
}
