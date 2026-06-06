import { useNavigate } from "react-router-dom";
import "../css/Leaderboard.css";
import hyperloopBg from "../assets/img/HyperloopGameScreen.png";
import video from "../assets/videos/bg-video.mp4";
import musicFile from "../assets/sounds/gamehub.mp3";
import { useState, useEffect, useRef } from "react";
import welcomeVoice from "../assets/sounds/introVO.mp3";

export default function GameHub({
  username,
  score,
  playedGames,
  saveToLeaderboard,
}) {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  const introKey = `gamehub-intro-${username}`;

  const [showIntro, setShowIntro] = useState(false);
  const [isButtonsVisible, setIsButtonsVisible] = useState(true); 
  const voiceRef = useRef(null);

  const games = [
    {
      id: 1,
      minigame: "Minigame 1",
      name: "Rem precies goed",
      route: "/games/uitleg/1",
      color: "blauwe",
    },
    {
      id: 2,
      minigame: "Minigame 2",
      name: "Magneet Switch",
      route: "/games/uitleg/2",
      color: "zwarte",
    },
    {
      id: 3,
      minigame: "Minigame 3",
      name: "Centreer de Hyperloop",
      route: "/games/uitleg/3",
      color: "groene",
    },
  ];

  const allGamesPlayed = playedGames.length >= games.length;

  useEffect(() => {
    if (!username) return;

    const hasSeenIntro = localStorage.getItem(introKey);

    if (!hasSeenIntro) {
      setShowIntro(true);
      setIsButtonsVisible(false);
    }
  }, [introKey, username]);

  const startIntro = () => {
    localStorage.setItem(introKey, "true");
    setShowIntro(false);

    if (!voiceRef.current) {
      voiceRef.current = new Audio(welcomeVoice);
      voiceRef.current.volume = 1;
    }

    voiceRef.current.play().catch(() => {});

    setTimeout(() => {
      setIsButtonsVisible(true);
    }, 20000);
  };

  useEffect(() => {
  if (!showIntro) return;

  const handleKeyDown = (e) => {
    if (
      e.key === "ArrowUp" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowDown" ||
      e.code === "Space"
    ) {
      e.preventDefault();
      startIntro();
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [showIntro]);

  // MUSIC
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(musicFile);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.1;
    }

    const startMusic = () => {
      audioRef.current?.play().catch(() => {});
    };

    window.addEventListener("mousedown", startMusic);
    window.addEventListener("keydown", startMusic);

    return () => {
      window.removeEventListener("mousedown", startMusic);
      window.removeEventListener("keydown", startMusic);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  const speed = score < 100 ? 100 : score;
  const [displaySpeed, setDisplaySpeed] = useState(100);

  useEffect(() => {
    let start = 100;
    const end = speed;

    const duration = 3000; // ms
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);

      const value = Math.floor(start + (end - start) * progress);
      setDisplaySpeed(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [speed]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const target = displaySpeed / 100;

    const start = video.playbackRate;
    const duration = 400;
    const startTime = performance.now();

    const animate = (t) => {
      const p = Math.min((t - startTime) / duration, 1);

      video.playbackRate = start + (target - start) * p;

      if (p < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [displaySpeed]);

  // KEY CONTROLS
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Blokkeer ook de toetsenbordbesturing tijdens de intro-periode!
      if (!isButtonsVisible) return;

      const isPlayed = (id) => playedGames.includes(id);

      switch (e.key) {
        case " ":
          if (!isPlayed(1)) navigate("/games/uitleg/1");
          break;
        case "ArrowDown":
          if (!isPlayed(2)) navigate("/games/uitleg/2");
          break;
        case "ArrowUp":
          if (!isPlayed(3)) navigate("/games/uitleg/3");
          break;
        case "ArrowRight":
          if (allGamesPlayed) {
            saveToLeaderboard();
            navigate("/leaderboard");
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, playedGames, allGamesPlayed, saveToLeaderboard, isButtonsVisible]);

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
      {/* INTRO POPUP */}
      {showIntro && (
        <div className="intro-overlay">
          <div className="intro-modal">
            <h1>Hallo, {username}</h1>
            <p>Maak je klaar voor de korte introductie!</p>

            <button onClick={startIntro}>Klik op een knop om te starten</button>
          </div>
        </div>
      )}

      <div className="container">
        <img src={hyperloopBg} className="bg-image-game" alt="background" />

        <video
          ref={videoRef}
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

          <h2>
            Score: {score}
            <span className="logo">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_653_6235)">
                  <path d="M24.0004 0C37.253 0.000191021 48 10.7503 48 24C48 37.2497 37.253 47.9998 24.0004 48C10.7476 48 0 37.2498 0 24C1.406e-05 10.7502 10.7476 0 24.0004 0ZM24.0004 2.28251C12.0231 2.28251 2.28006 12.0181 2.28004 24C2.28004 35.9819 12.0231 45.7175 24.0004 45.7175C28.7173 45.7174 33.0865 44.2048 36.6516 41.6412C34.2031 42.7577 31.4817 43.3815 28.6139 43.3815C17.903 43.3815 9.22695 34.7049 9.22695 24C9.22695 13.2951 17.9121 4.61923 28.6139 4.61923C31.4817 4.61928 34.2032 5.24161 36.6516 6.35802C33.0866 3.79454 28.7171 2.28258 24.0004 2.28251ZM28.6139 6.90096C19.1877 6.90096 11.507 14.5721 11.507 24C11.507 33.4279 19.1786 41.099 28.6139 41.099C32.8981 41.0989 36.8184 39.5169 39.8222 36.9074C37.9632 37.7885 35.884 38.2821 33.6885 38.2821C25.782 38.2821 19.3769 31.8883 19.3769 24C19.3769 16.1118 25.7911 9.71794 33.6885 9.71786C35.8841 9.71786 37.9639 10.2113 39.8229 11.0926C36.8191 8.48283 32.8983 6.90104 28.6139 6.90096ZM33.6885 12.0004C27.0485 12.0004 21.657 17.3797 21.6569 24C21.6569 30.6203 27.0485 36.0004 33.6885 36.0004C40.3284 36.0004 45.72 30.6204 45.72 24C45.7199 17.3797 40.3193 12.0004 33.6885 12.0004Z" fill="#F6653A"/>
                </g>
                <defs>
                  <clipPath id="clip0_653_6235">
                    <rect width="48" height="48" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
            <span className="speed">
              {displaySpeed} km/u
            </span>
          </h2>
        </div>

        {/* De grid krijgt dynamic classes op basis van de timer */}
        <div className={`game-grid ${isButtonsVisible ? "fade-in visible" : "fade-in-hidden"}`}>
          {games.map((game) => {
            const isPlayed = playedGames.includes(game.id);

            return (
              <div key={game.id} className="game-wrapper">
                <h3 className="minigame-title">{game.minigame}</h3>

                <div
                  className={`game-card ${game.color} ${
                    isPlayed ? "disabled" : ""
                  }`}
                  onClick={() => isButtonsVisible && !isPlayed && navigate(game.route)}
                >
                  <h2>{game.name}</h2>

                  {isPlayed ? (
                    <p>Je hebt deze Minigame voltooid!</p>
                  ) : (
                    <p>
                      Druk op de{" "}
                      <strong style={{ color: getColor(game.color) }}>
                        {game.color}
                      </strong>{" "}
                      knop om {game.minigame} te starten
                    </p>
                  )}
                </div>
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
            Bekijk je score, en die van andere!
          </button>
        )}
      </div>
    </section>
  );
}