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

  const maxRounds = 30;

  const [magnetTopActive, setMagnetTopActive] = useState(true);
  const [magnetPulse, setMagnetPulse] = useState(null);

  const runningRef = useRef(true);

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

  // 🏁 GAME OVER FIX
  const finishGame = () => {
    updateScore(score);
    markGameAsPlayed("minigame2");
    setRunning(false);
    setGameOver(true);
  };

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setObstacleX((x) => x - speed * 5);
    }, 16);

    return () => clearInterval(interval);
  }, [running, speed]);

  useEffect(() => {
    startRound();
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (!runningRef.current) return;

      if (e.code === "ArrowUp") {
        setIsBottom(false);
        setMagnetTopActive(true);
        setMagnetPulse("switch");
        setTimeout(() => setMagnetPulse(null), 120);
      }

      if (e.code === "ArrowDown") {
        setIsBottom(true);
        setMagnetTopActive(false);
        setMagnetPulse("switch");
        setTimeout(() => setMagnetPulse(null), 120);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (!running) return;

    const obstacleCenter = obstacleX + 30;
    const playerCenter = window.innerWidth / 2;

    const xHit = Math.abs(obstacleCenter - playerCenter) < 25;
    const yHit = isBottom === (obstacleLane === 1);

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
        <h4 style={{ color: "#00ffff" }}>
          Snelheid: {speed.toFixed(2)}x
        </h4>
        <p>Druk ↑ of ↓ om magneten te wisselen</p>
      </div>

      <div className="game-wrapper2">

        <div
          className="obstacle"
          style={{
            left: `${obstacleX}px`,
            top: `${obstacleLane === 0 ? 40 : 200}px`,
            transition: "top 0.25s ease"
          }}
        />

        {image && (
          <div
            className="player-wrapper"
            style={{
              top: isBottom ? "200px" : "40px",
              transition: "top 0.25s ease"
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

      {/* 🧨 MODAL GAME OVER */}
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