import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function MiniGame2({ updateScore, markGameAsPlayed }) {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [isBottom, setIsBottom] = useState(false);

  const [obstacleLane, setObstacleLane] = useState(0);
  const [obstacleX, setObstacleX] = useState(1200);

  const [running, setRunning] = useState(true);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  const [magnetTopActive, setMagnetTopActive] = useState(true);

  const runningRef = useRef(true);

  // 🔥 FIX: no state for animation (prevents jumps)
  const bgX = useRef(0);

  const maxRounds = 30;

  useEffect(() => {
    const storedImage = localStorage.getItem("hyperloopImage");
    if (storedImage) setImage(storedImage);
  }, []);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  const baseSpeed = 3;
  const speedMultiplier = 1 + Math.floor((round - 1) / 5) * 0.2;
  const speed = baseSpeed * speedMultiplier;

  const startRound = () => {
    setObstacleLane(Math.floor(Math.random() * 2));
    setObstacleX(window.innerWidth + 100);
  };

  const nextRound = () => {
    setRound((r) => r + 1);
    startRound();
  };

  const finishGame = () => {
    updateScore(score);
    markGameAsPlayed("minigame2");
    setRunning(false);
    setGameOver(true);
  };

  // 🚧 OBSTACLE MOVEMENT
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setObstacleX((x) => x - speed * 5);
    }, 16);

    return () => clearInterval(interval);
  }, [running, speed]);

  // 🌄 PARALLAX (FIXED - no state, no jumps)
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
    startRound();
  }, []);

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

    const obstacleCenter = obstacleX + 30;
    const playerCenter = window.innerWidth / 2;

    const xHit = Math.abs(obstacleCenter - playerCenter) < 25;
    const obstacleIsBottom = obstacleLane === 0;
    const yHit = isBottom === obstacleIsBottom;

    if (xHit) {
      if (yHit) {
        finishGame();
      } else {
        setScore((s) => s + 100);

        if (round >= maxRounds) {
          finishGame();
        } else {
          nextRound();
        }
      }
    }
  }, [obstacleX, isBottom, obstacleLane, round, running]);

  return (
    <div className="container text-center">

      {/* HUD */}
      <div className="text-section-game-2">
        <h1>Magnet Switch</h1>
        <h3>Ronde {round} / {maxRounds}</h3>
        <h3>Score: {score}</h3>
        <h4 style={{ color: "#000000" }}> Snelheid: {speed.toFixed(2)}x </h4>
        <p>↑ / ↓ om te wisselen</p>
      </div>

      <div className="game-wrapper2">

        {/* 🌄 PARALLAX */}
        <div className="parallax">

          <div
            className="layer layer-back"
            style={{ transform: `translateX(${bgX.current * 0.05}px)` }}
          />

          <div
            className="layer layer-mid-fardest"
            style={{ transform: `translateX(${bgX.current * 0.25}px)` }}
          />

          <div
            className="layer layer-mid-far"
            style={{ transform: `translateX(${bgX.current * 0.3}px)` }}
          />

          <div
            className="layer layer-mid"
            style={{ transform: `translateX(${bgX.current * 0.5}px)` }}
          />

          <div
            className="layer layer-front"
            style={{ transform: `translateX(${bgX.current * 1.4}px)` }}
          />

        </div>

        {/* OBSTACLE */}
        <div
          className="obstacle"
          style={{
            left: `${obstacleX}px`,
            bottom: obstacleLane === 0 ? "21vh" : "12vh",
          }}
        />

        {/* PLAYER */}
        {image && (
          <div
            className="player-wrapper"
            style={{
              bottom: isBottom ? "21vh" : "12vh",
              transition: "bottom 0.2s ease",
              zIndex: "0",
            }}
          >
            <img src={image} className="player" alt="hyperloop" />

            <div className="magnets">
              <div className={`magnet top ${magnetTopActive ? "pulse" : ""}`} />
              <div className={`magnet bottom ${!magnetTopActive ? "pulse" : ""}`} />
            </div>
          </div>
        )}

      </div>

      {/* GAME OVER */}
      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-modal">
            <h2>Game Over</h2>
            <p>Score: {score}</p>

            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate("/games")}
            >
              Terug naar GameHub
            </button>
          </div>
        </div>
      )}
    </div>
  );
}