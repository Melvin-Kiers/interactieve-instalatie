import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Countdown from "./Countdown";
// import video from "../assets/videos/bg-video.mp4";
import uitlegVideoMiniGame2 from "..//assets/videos/UitlegVideoMiniGame2NEW.mp4";
import backgroundMusic from "../assets/sounds/minigame2.mp3";
import "../css/Gamehud.css";

export default function MiniGame2({ updateScore, markGameAsPlayed, saveGameResult }) {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [isBottom, setIsBottom] = useState(false);

  // WAVE
  const [waveX, setWaveX] = useState(-1000);
  const [waveLane, setWaveLane] = useState(0);

  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [hasScored, setHasScored] = useState(false);
  const [isHit, setIsHit] = useState(false);
  const [waveHit, setWaveHit] = useState(false);

  const [magnetTopActive, setMagnetTopActive] = useState(false);

  const runningRef = useRef(false);
  const bgX = useRef(0);
  const roundLock = useRef(false);

  const count = 60;
  const maxRounds = 25;

  const [videoFinished, setVideoFinished] = useState(false);

  useEffect(() => {
    if (gameOver) {
      setVideoFinished(false);
    }
  }, [gameOver]);
  
  useEffect(() => {
    const storedImage = localStorage.getItem("hyperloopImage");
    if (storedImage) setImage(storedImage);
  }, []);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  // Snelheid berekeningen
  const baseSpeed = 2;
  const steps = Math.floor((round - 1) / 2);
  const speedMultiplier = 1 + steps * 0.25;
  const speed = baseSpeed * speedMultiplier;

  const speedKmH = 100 + (steps * 50);

  const waveIsBottom = waveLane === 0;

  const startRound = () => {
    setWaveLane(Math.floor(Math.random() * 2));
    setWaveX(window.innerWidth + 200);
    setHasScored(false);
    setWaveHit(false);

  };

  const finishGame = () => {
    setRunning(false);
    setGameOver(true);
  };

  // WAVE MOVEMENT + ROUND CONTROL
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setWaveX((x) => {
        const newX = x - speed * 6;

        if (newX < -200 && !roundLock.current) {
          roundLock.current = true;

          if (round >= maxRounds) {
            finishGame();
            return -200;
          }

          setRound((r) => r + 1);
          startRound();

          setTimeout(() => {
            roundLock.current = false;
          }, 50);

          return window.innerWidth + 200;
        }

        return newX;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [running, speed, round]);

  // PARALLAX
  useEffect(() => {
    if (!running) return;

    let raf;
    const loop = () => {
      bgX.current -= speed;
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, speed]);

  useEffect(() => {
    if (running) {
      startRound();
    }
  }, [running]);

  // INPUT
  useEffect(() => {
    const handleKey = (e) => {
      if (!runningRef.current) return;

      if (e.code === "ArrowUp") {
        setIsBottom(true);
        setMagnetTopActive(true);
      }

      if (e.code === "ArrowDown") {
        setIsBottom(false);
        setMagnetTopActive(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // COLLISION
  useEffect(() => {
    if (!running) return;

    if (waveX > window.innerWidth || waveX < -150) return;

    const playerCenter = window.innerWidth / 2;
    const waveCenter = waveX + 60;
    const xHit = Math.abs(waveCenter - playerCenter) < 50;
    const isSameLane = isBottom === waveIsBottom;

    if (xHit && !hasScored) {
      if (isSameLane) {
        // Door de wave heen = punten krijgen
        setScore((s) => s + 15);
        setHasScored(true);

        setIsHit(true);
        setWaveHit(true);

        setTimeout(() => setIsHit(false), 300);
      } else {
        // Wave missen = geen punten
        setHasScored(true);
      }
    }
  }, [waveX, isBottom, waveIsBottom, running, hasScored]);

    useEffect(() => {
    const audio = document.getElementById("bg-music");
    if (audio) {
      audio.volume = 0.7;
      audio.play().catch(error => {
        console.log("Autoplay werd geblokkeerd. Muziek start na eerste klik.");
      });
    }

    return () => {
        if (audio) {
          audio.pause();
        }
      };
    }, []);

    useEffect(() => {
    const audio = document.getElementById("bg-music");
    if (gameOver && audio) {
      audio.pause();
    }
  }, [gameOver]);

  useEffect(() => {
    const handleEnter = (e) => {
      if (e.code !== "ArrowRight") return;

      if (gameOver) {
        if (!videoFinished) return;

        updateScore(score);
        saveGameResult(2, score);
        markGameAsPlayed(2);
        navigate("/games");
      }
    };

    window.addEventListener("keydown", handleEnter);

    return () => window.removeEventListener("keydown", handleEnter);
  }, [gameOver, videoFinished, score, updateScore, markGameAsPlayed, navigate]);


  return (
    <div className={`container text-center ${isHit ? "hit-flash" : ""}`}>
      <audio id="bg-music" src={backgroundMusic} loop />
      {!running && !gameOver && (
        <Countdown onComplete={() => setRunning(true)} />
      )}

      <div className="hud-root">
        <div className="hud-title-center">Minigame 2: <br/> <span className="italic">Magneet Wisselen</span></div>

        <div className="hud-panel hud-score">
          <div className="hud-label">Punten</div>
          <div className="hud-value" style={{ color: isHit ? "#4ade80" : "white", transition: "color 0.2s" }}>
            {score.toLocaleString("nl-NL")}
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
          </div>
        </div>

        <div className="hud-panel hud-round">
          <div className="hud-label">Ronde</div>
          <div className="hud-value hud-amber">{round} / {maxRounds}</div>
          <div className="hud-pips">
            {Array.from({ length: maxRounds }, (_, i) => (
              <div key={i} className={`hud-pip ${i < round - 1 ? "done" : i === round - 1 ? "current" : ""}`} />
            ))}
          </div>
        </div>

        <div className="hud-panel hud-speed">
          <div>
            <div className="hud-label">Snelheid</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span className="hud-speed-number">{speedKmH}</span>
              <span className="hud-speed-unit">km/u</span>
            </div>
          </div>
          <div className="hud-speed-bar-wrap">
            <div className="hud-speed-bar-label">max {100 + (Math.floor((maxRounds - 1) / 2) * 50)} km/u</div>
            <div className="hud-speed-track">
              <div className="hud-speed-fill" style={{ width: `${Math.min((speedKmH / (100 + Math.floor((maxRounds - 1) / 2) * 50)) * 100, 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="game-wrapper2">
        <div className="parallax">
          <div className="layer layer-back" style={{ transform: `translateX(${bgX.current * 0.05}px)` }} />
          <div className="layer layer-mid-fardest" style={{ transform: `translateX(${bgX.current * 0.25}px)` }} />
          <div className="layer layer-mid-far" style={{ transform: `translateX(${bgX.current * 0.3}px)` }} />
          <div className="layer layer-mid" style={{ transform: `translateX(${bgX.current * 0.5}px)` }} />
          <div className="layer layer-front" style={{ transform: `translateX(${bgX.current * 1.4}px)` }} />
        </div>

        <div
          className="pressure-wave"
          style={{
            left: `${waveX}px`,
            bottom: waveIsBottom ? "21vh" : "12vh",
            display: waveX < -500 ? "none" : "block",

            opacity: waveHit ? 0 : 1,
            transform: waveHit ? "scale(0.6)" : "scale(1)",

            transition: "opacity 0.4s ease, transform 0.4s ease",

            filter:
              waveHit
                ? "brightness(1.5) hue-rotate(90deg)"
                : "none"
          }}
        />

        {image && (
          <div
            className="player-wrapper"
            style={{
              bottom: isBottom ? "18vh" : "9vh",
              transition: "bottom 0.2s ease",
              filter: isHit ? "drop-shadow(0 0 20px #00ff00)" : "none"
            }}
          >
            <img src={image} className="player" alt="hyperloop" />
          </div>
        )}

        <div className={`magnets ${!running ? "paused" : ""}`}>
          {[...Array(count)].map((_, i) => (
            <div key={`top-${i}`} className={`magnet top ${magnetTopActive ? "pulse" : ""}`} style={{ left: `${i * 50}px` }} />
          ))}
          {[...Array(count)].map((_, i) => (
            <div key={`bottom-${i}`} className={`magnet bottom ${!magnetTopActive ? "pulse" : ""}`} style={{ left: `${i * 50}px` }} />
          ))}
        </div>
      </div>

      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-modal" style={{ 
            maxWidth: '1200px', 
            width: '90%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }}>
            <h2>Missie Voltooid!</h2>
            <p>Je hebt tijdens deze minigame <strong>{score}</strong> punten behaald!</p>
            
            <hr style={{ width: '100%', border: '0.5px solid #ccc', margin: '15px 0' }} />
            
            <div className="video-learning-section" style={{ width: '100%' }}>
              <div style={{ 
                width: '100%', 
                borderRadius: '12px', 
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                backgroundColor: '#000' 
              }}>
                <video
                  className="explainVideo-2"
                  src={uitlegVideoMiniGame2}
                  autoPlay
                  playsInline
                  onEnded={() => setVideoFinished(true)}
                  style={{
                    width: '100%',
                    display: 'block'
                  }}
                /> 
              </div>
            </div>
            
            <button
              className="btn-orange mt-4"
              style={{
                width: '100%',
                padding: '12px',
                opacity: videoFinished ? 1 : 0.15
              }}
              disabled={!videoFinished}
              onClick={() => {
                updateScore(score);
                markGameAsPlayed(2);

                saveGameResult(2, score);
                navigate("/games");
              }}
            >
              {videoFinished
                ? "Druk op de oranje knop om terug te gaan naar je Hyperloop"
                : "Bekijk eerst de video"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}