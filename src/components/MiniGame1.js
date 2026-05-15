import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import hyperloopBgGame1 from "../assets/bg-minigame-1.png";
import video from "../assets/videos/test.mp4"; 
import backgroundMusic from "../assets/sounds/minigame1.mp3";

export default function MiniGame1({ updateScore, markGameAsPlayed }) {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [round, setRound] = useState(1);
  const [maxRounds] = useState(5);
  const [running, setRunning] = useState(true);
  const [result, setResult] = useState(null);
  const [finalScore, setFinalScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasScoredThisRound, setHasScoredThisRound] = useState(false); // 🔒 Nieuwe check

  const [position, setPosition] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [brakeActive, setBrakeActive] = useState(false);
  const [target, setTarget] = useState({ start: 40, end: 60 });

  const baseSpeed = 0 + round * 1.25;

  useEffect(() => {
    const storedImage = localStorage.getItem("hyperloopImage");
    if (storedImage) setImage(storedImage);
  }, []);

  useEffect(() => {
    if (!running || gameOver) return;
    const interval = setInterval(() => {
      setPosition((prev) => {
        let next = prev + velocity;
        if (next > 110) return -10;
        if (next < -10) return 110;
        return next;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [running, velocity, gameOver]);

  useEffect(() => {
    if (!running || brakeActive || gameOver) return;
    const interval = setInterval(() => {
      setVelocity(baseSpeed);
    }, 50);
    return () => clearInterval(interval);
  }, [running, brakeActive, baseSpeed, gameOver]);

  useEffect(() => {
    if (!brakeActive || gameOver) return;
    const interval = setInterval(() => {
      setVelocity((v) => {
        const newV = v * 0.88;
        if (Math.abs(newV) < 0.05) {
          clearInterval(interval);
          setVelocity(0);
          setBrakeActive(false);
          setRunning(false);
          // Gebruik een functionele update om de laatste positie veilig te pakken
          setPosition((finalPos) => {
            finishRound(finalPos);
            return finalPos;
          });
        }
        return newV;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [brakeActive, gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const start = Math.floor(Math.random() * 60) + 20;
    const width = Math.max(10, 20 - round * 2);
    setTarget({ start, end: start + width });
    setPosition(0);
    setVelocity(0);
    setBrakeActive(false);
    setResult(null);
    setHasScoredThisRound(false); // 🔓 Reset check voor nieuwe ronde
    setRunning(true);
  }, [round, gameOver]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space" && running && !brakeActive && !gameOver) {
        setBrakeActive(true);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [running, brakeActive, gameOver]);

  const finishRound = (stopPos) => {
    // 🛡️ Blokkeer als er deze ronde al gescoord is
    setHasScoredThisRound((alreadyScored) => {
      if (alreadyScored) return true; 

      let points = 0;
      if (stopPos >= target.start && stopPos <= target.end) {
        points = 100;
      } else {
        const dist = Math.min(Math.abs(stopPos - target.start), Math.abs(stopPos - target.end));
        if (dist < 5) points = 70;
        else if (dist < 10) points = 40;
        else points = 10;
      }

      setFinalScore((prev) => prev + points);
      setResult({ round, points, total: finalScore + points });
      
      return true; // Zet op 'true' voor de rest van de ronde
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
    markGameAsPlayed(1);
    navigate("/games");
  };

  useEffect(() => {
    const audio = document.getElementById("bg-music");
    if (audio) {
      audio.volume = 0.3; // Zet het volume op 30% zodat het niet te hard is
      audio.play().catch(error => {
        console.log("Autoplay werd geblokkeerd. Muziek start na eerste klik.");
      });
    }

    // Cleanup: Stop muziek als de gebruiker de pagina verlaat
    return () => {
        if (audio) {
          audio.pause();
        }
      };
    }, []);

    useEffect(() => {
    const audio = document.getElementById("bg-music");
    if (gameOver && audio) {
      // Fade out of stop de muziek direct
      audio.pause();
    }
  }, [gameOver]);

  return (
    <div className="minigame-container" style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <audio id="bg-music" src={backgroundMusic} loop />
      <img src={hyperloopBgGame1} className="bg-image-game-1" alt="background" />
      
      <div className="game-screen text-center">
        <div className="text-section-game">
          <h1>Rem precies goed</h1>
          <h3>Ronde {round} / {maxRounds}</h3>
          <h4>Score: {finalScore}</h4>
          <div className="speedometer">
            <span className="speed-value">{Math.round(velocity * 100)}</span>
            <span className="speed-unit"> km/u</span>
          </div>
        </div>

        <div className="game-bar-wrapper">
          <div className="game-bar">
            <div className="target-zone" style={{ left: `${target.start}%`, width: `${target.end - target.start}%` }} />
            {image && (
              <img
                src={image}
                className="hyperloop-indicator"
                style={{ left: `${position}%`, filter: brakeActive ? 'drop-shadow(0 0 8px red)' : 'none' }}
                alt="hyperloop"
              />
            )}
          </div>
        </div>

        {result && !gameOver && (
          <div className="minigame1-result">
            <h2 className="mt-3">+{result.points} punten</h2>
            <h3>Totaal: {result.total}</h3>
            <button className="btn btn-success mt-3" onClick={nextRound}>
              {round >= maxRounds ? "Resultaat bekijken" : "Volgende ronde"}
            </button>
          </div>
        )}
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
                <video className="explainVideo-2" src={video} autoPlay loop playsInline style={{ width: '100%', height: 'auto', display: 'block' }} />    
              </div>
            </div>
            <button className="btn-orange btn-full mt-4" style={{ width: '100%', padding: '12px', fontWeight: 'bold' }} onClick={handleFinalExit}>
              Ga verder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}