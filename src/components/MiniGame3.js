import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import hyperloopBgGame3 from "../assets/bg-minigame-3.png";
import backgroundMusic from "../assets/sounds/minigame3.mp3";
import uitlegVideoMiniGame3 from "..//assets/videos/UitlegVideoMiniGame3NEW.mp4";
import Countdown from "./Countdown";

export default function MiniGame3({ updateScore, markGameAsPlayed, saveGameResult }) {
  const navigate = useNavigate();
  const [videoFinished, setVideoFinished] = useState(false);

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
    if (gameOver) {
      setVideoFinished(false);
    }
  }, [gameOver]);

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
            points = 50;
          } else {
            const dist = Math.min(
              Math.abs(currentCapsulePos - currentZonePos),
              Math.abs(currentCapsulePos - zoneEnd)
            );
            if (dist < 5) points = 35;
            else if (dist < 10) points = 15;
            else points = 5;
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

    saveGameResult(3, finalScore);
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
      if (!videoFinished) return;
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
}, [result, gameOver, videoFinished, handleFinalExit, nextRound]);

  return (
    <div className="minigame-container" style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <audio id="bg-music" src={backgroundMusic} loop />
      <img src={hyperloopBgGame3} className="bg-image-game-3" alt="background" />
      
      {!running && !gameOver && !result && round === 1 && (
        <Countdown onComplete={() => setRunning(true)} />
      )}

      <div className="game-screen text-center mt-4">
        <div className="hud-root">
          <div className="hud-title-center">Minigame 3: <br/> <span className="italic">Centreer de Hyperloop</span></div>

          <div className="hud-panel hud-score">
            <div className="hud-label">Punten</div>
            <div className="hud-value">
              {finalScore.toLocaleString("nl-NL")}
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
              <h2 className={result.points === 100 ? "text-success compliment" : "compliment"}>
                {result.points === 100 ? "Perfect in het midden!" : `Ga zo door!`}
              </h2>
              <h2 className="points mt-3">+{result.points} punten
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
                <video
                  className="explainVideo-2"
                  src={uitlegVideoMiniGame3}
                  autoPlay
                  playsInline
                  onEnded={() => setVideoFinished(true)}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                />  
              </div>
            </div>

            <button
              className="btn-orange btn-full mt-4"
              style={{
                width: '100%',
                padding: '12px',
                fontWeight: 'bold',
                opacity: videoFinished ? 1 : 0.15,
                cursor: videoFinished ? 'pointer' : 'not-allowed'
              }}
              disabled={!videoFinished}
              onClick={handleFinalExit}
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