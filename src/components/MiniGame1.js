import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MiniGame1({ updateScore, markGameAsPlayed }) {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);

  const [round, setRound] = useState(1);
  const [maxRounds] = useState(5);

  const [running, setRunning] = useState(true);
  const [result, setResult] = useState(null);

  const [finalScore, setFinalScore] = useState(0);

  // 🚄 physics
  const [position, setPosition] = useState(0);
  const [velocity, setVelocity] = useState(0);

  // 🛑 braking
  const [brakeActive, setBrakeActive] = useState(false);

  // 🎯 target zone
  const [target, setTarget] = useState({ start: 40, end: 60 });

  // ⚡ base speed per round
  const baseSpeed = 0 + round * 1.25;

  // 🎨 load image
  useEffect(() => {
    const storedImage = localStorage.getItem("hyperloopImage");
    if (storedImage) setImage(storedImage);
  }, []);

  // 🚄 movement
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setPosition((prev) => {
        let next = prev + velocity;

        if (next > 110) return -10;
        if (next < -10) return 110;

        return next;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [running, velocity]);

  // ⚡ acceleration (only when not braking)
  useEffect(() => {
    if (!running || brakeActive) return;

    const interval = setInterval(() => {
      setVelocity(baseSpeed);
    }, 50);

    return () => clearInterval(interval);
  }, [running, brakeActive, baseSpeed]);

  // 🧠 smooth braking (velocity + live speed display)
  useEffect(() => {
    if (!brakeActive) return;

    const interval = setInterval(() => {
      setVelocity((v) => {
        const newV = v * 0.88; // friction

        if (Math.abs(newV) < 0.05) {
          clearInterval(interval);

          setVelocity(0);
          setBrakeActive(false);
          setRunning(false);

          finishRound();
        }

        return newV;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [brakeActive]);

  // 🟢 new target per round
  useEffect(() => {
    const start = Math.floor(Math.random() * 60) + 20;
    const width = Math.max(10, 20 - round * 2);

    setTarget({
      start,
      end: start + width,
    });

    setPosition(0);
    setVelocity(0);
    setBrakeActive(false);
    setResult(null);
    setRunning(true);
  }, [round]);

  // ⌨️ input
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space" && running) {
        startBrake();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [running, brakeActive]);

  // 🛑 start braking
  const startBrake = () => {
    if (!running || brakeActive) return;
    setBrakeActive(true);
  };

  // 🎯 scoring
  const finishRound = () => {
    let points = 0;

    if (position >= target.start && position <= target.end) {
      points = 100;
    } else {
      const dist = Math.min(
        Math.abs(position - target.start),
        Math.abs(position - target.end)
      );

      if (dist < 5) points = 70;
      else if (dist < 10) points = 40;
      else points = 10;
    }

    const newTotal = finalScore + points;

    setFinalScore(newTotal);

    setResult({
      round,
      points,
      total: newTotal,
      finished: false,
    });
  };

  // ➡️ next round
  const nextRound = () => {
    setResult(null);

    if (round >= maxRounds) {
      updateScore(finalScore);
      markGameAsPlayed("minigame1");

      setResult({
        finished: true,
        total: finalScore,
      });

      setRunning(false);
      return;
    }

    setRound((r) => r + 1);
  };

  return (
    <div className="container text-center mt-4">
      <h1>Versnel de Hyperloop 🚄</h1>

      <h3>Ronde {round} / {maxRounds}</h3>

      {/* ⚡ LIVE SPEED DISPLAY */}
      <div className="speed-hud">
        ⚡ Snelheid: {Math.round(velocity * 100)}km/u
      </div>

      <p>Basis snelheid: {baseSpeed.toFixed(1)}</p>

      {/* 🎮 GAME BAR */}
      <div className="game-bar-wrapper">
        <div className="game-bar">

          {/* 🟢 TARGET */}
          <div
            className="target-zone"
            style={{
              left: `${target.start}%`,
              width: `${target.end - target.start}%`,
            }}
          />

          {/* 🚄 HYPERLOOP */}
          {image && (
            <img
              src={image}
              className="hyperloop-indicator"
              style={{ left: `${position}%` }}
              alt="hyperloop"
            />
          )}
        </div>
      </div>

      {!result && (
        <p>SPACE = remmen (velocity loopt nu smooth naar 0)</p>
      )}

      {result && !result.finished && (
        <>
          <h2>+{result.points} punten</h2>
          <h3>Totaal: {result.total}</h3>

          <button className="btn btn-success mt-3" onClick={nextRound}>
            Volgende ronde
          </button>
        </>
      )}

      {result?.finished && (
        <>
          <h2>🏁 Game voltooid!</h2>
          <h3>Eindscore: {result.total}</h3>

          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/games")}
          >
            Terug naar GameHub
          </button>
        </>
      )}
    </div>
  );
}