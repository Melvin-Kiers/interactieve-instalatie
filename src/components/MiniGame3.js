import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import hyperloopBgGame3 from "../assets/bg-minigame-3.png";
import backgroundMusic from "../assets/sounds/minigame3.mp3";
import uitlegVideoMiniGame3 from "..//assets/videos/UitlegVideoMiniGame3.mp4";
import Countdown from "./Countdown";

export default function MiniGame3({ updateScore, markGameAsPlayed }) {
  const navigate = useNavigate();

  const maxRounds = 5;
  const [round, setRound] = useState(1);
  
  const [running, setRunning] = useState(false); 
  
  const [result, setResult] = useState(null);
  const [finalScore, setFinalScore] = useState(0);
  const [image, setImage] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [hasScoredThisRound, setHasScoredThisRound] = useState(false);

  // Capsule state
  const [position, setPosition] = useState(15);
  const [velocity, setVelocity] = useState(0);
  const [holding, setHolding] = useState(false);

  // Target zone state
  const [zonePos, setZonePos] = useState(40);
  const [zoneWidth, setZoneWidth] = useState(20);
  const [zoneVelocity, setZoneVelocity] = useState(0);
  const [anchorPoint, setAnchorPoint] = useState(40);

  // Timer state
  const [timer, setTimer] = useState(5);

  const drift = 0.12;
  const enginePower = 0.38;
  const damping = 0.9;

  useEffect(() => {
    const storedImage = localStorage.getItem("hyperloopImage");
    if (storedImage) setImage(storedImage);

    const down = (e) => {
      if (gameOver || !running) return;
      if (e.code === "Space") setHolding(true);
    };
    const up = (e) => {
      if (e.code === "Space") setHolding(false);
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [gameOver, running]);

  useEffect(() => {
    if (gameOver) return;
    const startPos = Math.floor(Math.random() * 30) + 35;
    const newWidth = Math.max(8, 18 - round * 1.5);

    setAnchorPoint(startPos);
    setZonePos(startPos);
    setZoneWidth(newWidth);
    setZoneVelocity(0);
    
    setPosition(15); 
    setVelocity(0);
    setHolding(false);
    setResult(null);
    setTimer(5);
    setHasScoredThisRound(false);
    

    if (round > 1) {
      setRunning(true);
    }
  }, [round, gameOver]);

  // Timer & Moving Target Logic
  useEffect(() => {
    if (!running || result || gameOver) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0.05) {
          finishRound();
          return 0;
        }
        return parseFloat((prev - 0.05).toFixed(2));
      });

      setZoneVelocity((v) => {
        let newV = v + (Math.random() - 0.5) * 0.15;
        const distanceFromAnchor = zonePos - anchorPoint;
        newV -= distanceFromAnchor * 0.02; 
        const maxV = 0.3 + (round * 0.1);
        return Math.max(-maxV, Math.min(maxV, newV));
      });

      setZonePos((prev) => {
        let next = prev + zoneVelocity;
        if (next < 12) { next = 12; setZoneVelocity(0.1); }
        if (next + zoneWidth > 88) { next = 88 - zoneWidth; setZoneVelocity(-0.1); }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [running, result, zonePos, zoneVelocity, anchorPoint, round, gameOver]);

  // Physics loop
  useEffect(() => {
    if (!running || gameOver) return;

    const interval = setInterval(() => {
      setPosition((prev) => {
        let newVel = velocity;
        newVel -= drift;
        if (holding) newVel += enginePower;
        newVel *= damping;

        let next = prev + newVel;
        if (next < 0) { next = 0; newVel = 0; }
        if (next > 92) { next = 92; newVel = 0; } 

        setVelocity(newVel);
        return next;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [running, holding, velocity, gameOver]);

  const finishRound = () => {
    setHasScoredThisRound((alreadyScored) => {
      if (alreadyScored) return true;

      setRunning(false);
      setZonePos((currentZonePos) => {
        setPosition((currentCapsulePos) => {
          const zoneEnd = currentZonePos + zoneWidth;
          let points = 0;

          if (currentCapsulePos >= currentZonePos && currentCapsulePos <= zoneEnd) {
            points = 100;
          } else {
            const dist = Math.min(
              Math.abs(currentCapsulePos - currentZonePos),
              Math.abs(currentCapsulePos - zoneEnd)
            );
            if (dist < 5) points = 70;
            else if (dist < 10) points = 40;
            else points = 10;
          }

          setFinalScore((prev) => prev + points);
          setResult({ round, points, total: finalScore + points, finished: false });

          return currentCapsulePos;
        });
        return currentZonePos;
      });

      return true;
    });
  };

  const nextRound = () => {
    if (round >= maxRounds) {
      setGameOver(true);
      setRunning(false);
      setResult(null);
    } else {
      setRound((r) => r + 1);
    }
  };

  const handleFinalExit = () => {
    updateScore(finalScore);
    markGameAsPlayed(3);
    navigate("/games");
  };

  useEffect(() => {
    const audio = document.getElementById("bg-music");
    if (audio) {
      audio.volume = 0.3;
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
    const handleKeyDown = (e) => {
      if (e.key !== "ArrowRight") return;

      if (gameOver) {
        handleFinalExit();
        return;
      }

      if (result) {
        nextRound();
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [result, gameOver]);

  return (
    <div className="minigame-container" style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <audio id="bg-music" src={backgroundMusic} loop />
      <img src={hyperloopBgGame3} className="bg-image-game-3" alt="background" />
      
      {!running && !gameOver && !result && round === 1 && (
        <Countdown onComplete={() => setRunning(true)} />
      )}

      <div className="game-screen text-center mt-4">
        <div className="hud-root">
          <div className="hud-title-center">Minigame 3: <br/> <span className="italic">Hyperloop Stabiel Houden</span></div>

          <div className="hud-panel hud-score">
            <div className="hud-label">Punten</div>
            <div className="hud-value">
              {finalScore.toLocaleString("nl-NL")}
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

          <div className={`hud-panel hud-speed ${timer < 1.5 ? "hud-timer-danger" : ""}`}>
            <div className="hud-label">Tijd over:</div><br/>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span className="hud-speed-number-timer" style={{ color: timer < 1.5 ? "#f87171" : "var(--hud-amber)" }}>
                {Number(timer).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="game-bar-wrapper3">
          <div className="game-bar3">
            <div style={{ position: 'absolute', height: '100%', left: `${zonePos - 10}%`, width: '10%', backgroundColor: 'rgba(255, 0, 0, 0.2)', borderRadius: '5px' }} />
            <div style={{ position: 'absolute', height: '100%', left: `${zonePos - 5}%`, width: '5%', backgroundColor: 'rgba(255, 165, 0, 0.3)' }} />

            <div
              className="target-zone"
              style={{
                left: `${zonePos}%`,
                width: `${zoneWidth}%`,
                backgroundColor: 'rgba(40, 167, 69, 0.5)',
                borderLeft: '3px solid green',
                borderRight: '3px solid green',
                boxShadow: '0 0 15px rgba(40, 167, 69, 0.3)'
              }}
            />

            <div style={{ position: 'absolute', height: '100%', left: `${zonePos + zoneWidth}%`, width: '5%', backgroundColor: 'rgba(255, 165, 0, 0.3)' }} />
            <div style={{ position: 'absolute', height: '100%', left: `${zonePos + zoneWidth + 5}%`, width: '10%', backgroundColor: 'rgba(255, 0, 0, 0.2)', borderRadius: '5px' }} />

            {image && (
              <img
                src={image}
                className="hyperloop-indicator"
                style={{ 
                  left: `${position}%`,
                  filter: holding ? 'drop-shadow(0 0 12px cyan) brightness(1.2)' : 'none',
                  transition: 'filter 0.3s',
                  zIndex: 10
                }}
                alt="hyperloop"
              />
            )}
          </div>
        </div>

        <div className="mt-4">
          {!result && !gameOver ? (
            <p></p>
          ) : !gameOver && result ? (
            <div className="minigame3-result result-area">
              <h2 className={result.points === 100 ? "text-success" : "text-primary"}>
                {result.points === 100 ? "Perfecte Stabiliteit!" : `+${result.points} punten`}
              </h2>
              <h3>Totaal: {result.total}</h3>
              <button className="btn btn-orange btn-lg mt-2" onClick={nextRound}>
                {round >= maxRounds ? "Resultaat bekijken" : "Druk op de oranje knop voor de volgende ronde!"}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-modal" style={{ maxWidth: '1200px', width: '90%' }}>
            <h2>Missie Voltooid!</h2>
            <p>Je hebt tijdens deze minigame <strong>{finalScore}</strong> punten behaald!</p>
            
            <hr style={{ width: '100%', border: '0.5px solid #444', margin: '15px 0' }} />
            
            <div className="video-learning-section" style={{ width: '100%' }}>
              <div className="video-container" style={{ 
                width: '100%', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)', lineHeight: 0 
              }}>
                <video className="explainVideo-2" src={uitlegVideoMiniGame3} autoPlay playsInline style={{ width: '100%', height: 'auto', display: 'block' }} />    
              </div>
            </div>

            <button 
              className="btn-orange btn-full mt-4" 
              style={{ width: '100%', padding: '12px', fontWeight: 'bold' }} 
              onClick={handleFinalExit}
            >
              Druk op de oranje knop om terug te gaan naar je Hyperloop
            </button>
          </div>
        </div>
      )}
    </div>
  );
}