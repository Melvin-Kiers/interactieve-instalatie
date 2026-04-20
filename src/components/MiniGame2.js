import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Countdown from "./Countdown";

export default function MiniGame2({ updateScore, markGameAsPlayed }) {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [isBottom, setIsBottom] = useState(false);

  // 🌊 WAVE - Start ver buiten beeld om vroege hits te voorkomen
  const [waveX, setWaveX] = useState(-1000);
  const [waveLane, setWaveLane] = useState(0);

  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [hasScored, setHasScored] = useState(false);

  const [magnetTopActive, setMagnetTopActive] = useState(false);

  const runningRef = useRef(false);
  const bgX = useRef(0);
  const roundLock = useRef(false);

  const count = 60;
  const maxRounds = 30;

  useEffect(() => {
    const storedImage = localStorage.getItem("hyperloopImage");
    if (storedImage) setImage(storedImage);
  }, []);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  const baseSpeed = 1;
  const speedMultiplier = 1 + Math.floor((round - 1) / 2) * 0.25;
  const speed = baseSpeed * speedMultiplier;

  const waveIsBottom = waveLane === 0;

  // 🌊 spawn wave
  const startRound = () => {
    setWaveLane(Math.floor(Math.random() * 2));
    // Spawn de wave rechts buiten het scherm
    setWaveX(window.innerWidth + 200);
    setHasScored(false);
  };

  const finishGame = () => {
    // updateScore(score);
    // markGameAsPlayed(2);
    setRunning(false);
    setGameOver(true);
  };

  // 🌊 WAVE MOVEMENT + ROUND CONTROL
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setWaveX((x) => {
        const newX = x - speed * 6;

        // 🌊 wave volledig voorbij de linkerkant -> volgende ronde
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

  // 🌄 PARALLAX
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

  // 🎮 START NA COUNTDOWN
  useEffect(() => {
    if (running) {
        startRound();
    }
  }, [running]);

  // 🎮 INPUT
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

  // 💥 COLLISION
  useEffect(() => {
    if (!running) return;

    // Alleen checken als de wave daadwerkelijk in beeld is
    if (waveX > window.innerWidth || waveX < -150) return;

    const playerCenter = window.innerWidth / 2;
    const waveCenter = waveX + 60;
    const xHit = Math.abs(waveCenter - playerCenter) < 50;
    const correctLane = isBottom === waveIsBottom;

    if (xHit) {
      if (correctLane) {
        finishGame();
      } else if (!hasScored) {
        setScore((s) => s + 5);
        setHasScored(true);
      }
    }
  }, [waveX, isBottom, waveIsBottom, running, hasScored]);

  return (
    <div className="container text-center">

      {!running && !gameOver && (
        <Countdown onComplete={() => setRunning(true)} />
      )}

      <div className="text-section-game-2">
        <h1>Magnet Switch</h1>
        <h3>Ronde {round} / {maxRounds}</h3>
        <h3>Score: {score}</h3>
        <h4>Snelheid: {speed.toFixed(2)}x</h4>
        <p>↑ / ↓ om te wisselen</p>
      </div>

      <div className="game-wrapper2">

        <div className="parallax">
          <div className="layer layer-back"
            style={{ transform: `translateX(${bgX.current * 0.05}px)` }} />
          <div className="layer layer-mid-fardest"
            style={{ transform: `translateX(${bgX.current * 0.25}px)` }} />
          <div className="layer layer-mid-far"
            style={{ transform: `translateX(${bgX.current * 0.3}px)` }} />
          <div className="layer layer-mid"
            style={{ transform: `translateX(${bgX.current * 0.5}px)` }} />
          <div className="layer layer-front"
            style={{ transform: `translateX(${bgX.current * 1.4}px)` }} />
        </div>

        {/* 🌊 WAVE */}
        <div
          className="pressure-wave"
          style={{
            left: `${waveX}px`,
            bottom: waveIsBottom ? "21vh" : "12vh",
            display: waveX < -500 ? 'none' : 'block' // Verberg als hij nog op de wachtpositie staat
          }}
        />

        {/* PLAYER */}
        {image && (
          <div
            className="player-wrapper"
            style={{
              bottom: isBottom ? "18vh" : "9vh",
              transition: "bottom 0.2s ease",
            }}
          >
            <img src={image} className="player" alt="hyperloop" />
          </div>
        )}

        {/* MAGNETS */}
        <div className={`magnets ${!running ? "paused" : ""}`}>
          {[...Array(count)].map((_, i) => (
            <div
              key={`top-${i}`}
              className={`magnet top ${magnetTopActive ? "pulse" : ""}`}
              style={{ left: `${i * 50}px` }}
            />
          ))}
          {[...Array(count)].map((_, i) => (
            <div
              key={`bottom-${i}`}
              className={`magnet bottom ${!magnetTopActive ? "pulse" : ""}`}
              style={{ left: `${i * 50}px` }}
            />
          ))}
        </div>

      </div>

      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-modal">
            <h2>Game Over</h2>
            <p>Eindscore: {score}</p>
            
            <button
              className="btn btn-primary mt-3"
              onClick={() => {
                // Eerst de data opslaan...
                updateScore(score);
                markGameAsPlayed(2); 
                
                // ...en dan pas weg navigeren
                navigate("/games");
              }}
            >
              Terug naar GameHub
            </button>
          </div>
        </div>
      )}
    </div>
  );
}