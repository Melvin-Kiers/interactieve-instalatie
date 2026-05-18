import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Countdown from "./Countdown";
// import video from "../assets/videos/bg-video.mp4";
import uitlegVideoMiniGame2 from "..//assets/videos/UitlegVideoMiniGame2.mp4";
import backgroundMusic from "../assets/sounds/minigame2.mp3";

export default function MiniGame2({ updateScore, markGameAsPlayed }) {
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

  const [magnetTopActive, setMagnetTopActive] = useState(false);

  const runningRef = useRef(false);
  const bgX = useRef(0);
  const roundLock = useRef(false);

  const count = 60;
  const maxRounds = 5;

  useEffect(() => {
    const storedImage = localStorage.getItem("hyperloopImage");
    if (storedImage) setImage(storedImage);
  }, []);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  // Snelheid berekeningen
  const baseSpeed = 1;
  const steps = Math.floor((round - 1) / 2);
  const speedMultiplier = 1 + steps * 0.25;
  const speed = baseSpeed * speedMultiplier;

  const speedKmH = 100 + (steps * 50);

  const waveIsBottom = waveLane === 0;

  const startRound = () => {
    setWaveLane(Math.floor(Math.random() * 2));
    setWaveX(window.innerWidth + 200);
    setHasScored(false);
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
        setScore((s) => Math.max(0, s - 5));
        setHasScored(true);
        setIsHit(true);
        setTimeout(() => setIsHit(false), 300);
      } else {
        setScore((s) => s + 5);
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
    if (e.code === "ArrowRight" && gameOver) {
      updateScore(score);
      markGameAsPlayed(2);
      navigate("/games");
    }
  };

  window.addEventListener("keydown", handleEnter);
  return () => window.removeEventListener("keydown", handleEnter);
}, [gameOver, score]);


  return (
    <div className={`container text-center ${isHit ? "hit-flash" : ""}`}>
      <audio id="bg-music" src={backgroundMusic} loop />
      {!running && !gameOver && (
        <Countdown onComplete={() => setRunning(true)} />
      )}

      <div className="text-section-game">
        <h1>Magnet Switch</h1>
        <h3>Ronde {round} / {maxRounds}</h3>
        <h3 style={{ color: isHit ? "red" : "white", transition: "color 0.2s" }}>
          Score: {score}
        </h3>
        {/* <h4>Snelheid: {speed.toFixed(2)}x</h4> */}
        <div className="speedometer">
          <span className="speed-value">{speedKmH}</span>
          <span className="speed-unit"> km/u</span>
        </div> 
        <p>↑ / ↓ om te wisselen</p>
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
            display: waveX < -500 ? 'none' : 'block',
            filter: isHit && isBottom === waveIsBottom ? "brightness(2) saturate(2)" : "none"
          }}
        />

        {image && (
          <div
            className="player-wrapper"
            style={{
              bottom: isBottom ? "18vh" : "9vh",
              transition: "bottom 0.2s ease",
              opacity: isHit ? 0.5 : 1
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
                  style={{ 
                    width: '100%', 
                    display: 'block'
                  }} 
                />    
              </div>
            </div>
            
            <button
              className="btn-orange mt-4"
              style={{ width: '100%', padding: '12px' }}
              onClick={() => {
                updateScore(score);
                markGameAsPlayed(2); 
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