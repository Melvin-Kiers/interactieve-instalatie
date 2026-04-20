import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MiniGame3({ updateScore, markGameAsPlayed }) {
  const navigate = useNavigate();

  const maxRounds = 5;
  const [round, setRound] = useState(1);
  const [running, setRunning] = useState(true);
  const [result, setResult] = useState(null);
  const [finalScore, setFinalScore] = useState(0);
  const [image, setImage] = useState(null);

  // 🎯 Capsule state
  const [position, setPosition] = useState(15);
  const [velocity, setVelocity] = useState(0);
  const [holding, setHolding] = useState(false);

  // 🟢 Target zone state
  const [zonePos, setZonePos] = useState(40);
  const [zoneWidth, setZoneWidth] = useState(20);
  const [zoneVelocity, setZoneVelocity] = useState(0);
  const [anchorPoint, setAnchorPoint] = useState(40); // Het punt waar hij omheen schommelt

  // ⏱️ Timer state
  const [timer, setTimer] = useState(5);

  // ⚙️ Physics constants
  const drift = 0.12;        
  const enginePower = 0.38;   
  const damping = 0.9;       

  // 🎨 Load image & controls
  useEffect(() => {
    const storedImage = localStorage.getItem("hyperloopImage");
    if (storedImage) setImage(storedImage);

    const down = (e) => {
      if (e.code === "ArrowRight" || e.code === "Space") setHolding(true);
    };
    const up = (e) => {
      if (e.code === "ArrowRight" || e.code === "Space") setHolding(false);
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // 🟢 New round setup
  useEffect(() => {
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
    setRunning(true);
  }, [round]);

  // ⏱️ Timer & Moving Target Logic (Schommel-effect)
  useEffect(() => {
    if (!running || result) return;

    const interval = setInterval(() => {
      // 1. Timer aftellen
      setTimer((prev) => {
        if (prev <= 0.05) {
          finishRound();
          return 0;
        }
        return parseFloat((prev - 0.05).toFixed(2));
      });

      // 2. Schommel-logica voor de Zone
      setZoneVelocity((v) => {
        // Een kleine random zetje geven
        let newV = v + (Math.random() - 0.5) * 0.15;
        
        // "Elastiek" effect: trek de zone terug naar het anchorPoint
        const distanceFromAnchor = zonePos - anchorPoint;
        newV -= distanceFromAnchor * 0.02; 

        // Snelheidslimiet voor het vakje (neemt toe per ronde)
        const maxV = 0.3 + (round * 0.1);
        return Math.max(-maxV, Math.min(maxV, newV));
      });

      setZonePos((prev) => {
        let next = prev + zoneVelocity;
        // Harde grenzen
        if (next < 12) { next = 12; setZoneVelocity(0.1); }
        if (next + zoneWidth > 88) { next = 88 - zoneWidth; setZoneVelocity(-0.1); }
        return next;
      });

    }, 50);

    return () => clearInterval(interval);
  }, [running, result, zonePos, zoneVelocity, anchorPoint, round]);

  useEffect(() => {
    if (!running) return;

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
  }, [running, holding, velocity]);

  const finishRound = () => {
    setRunning(false);
    // Gebruik de huidige states voor score-berekening
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

        setFinalScore((prev) => {
          const newTotal = prev + points;
          setResult({ round, points, total: newTotal, finished: false });
          return newTotal;
        });

        return currentCapsulePos;
      });
      return currentZonePos;
    });
  };

  const nextRound = () => {
    if (round >= maxRounds) {
      updateScore(finalScore);
      markGameAsPlayed(3);
      setResult({ finished: true, total: finalScore });
    } else {
      setRound((r) => r + 1);
    }
  };

  return (
    <div className="container text-center mt-4">
      <h1>Magnetic Stability Control</h1>
      <h3 className="mb-0">Ronde {round} / {maxRounds}</h3>

      <div className={`timer-display ${timer < 1.5 ? "text-danger animate-pulse" : ""}`} 
           style={{ fontSize: '2.5rem', fontWeight: 'bold', height: '60px' }}>
        {timer}s
      </div>

      <div className="game-bar-wrapper">
        <div className="game-bar" style={{ position: 'relative', height: '110px', backgroundColor: '#ddd', borderRadius: '15px' }}>
          
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
        {!result ? (
          <p>
            Houd de capsule stabiel! Het magnetisch veld schommelt.<br/>
            <strong>SPATIE / RECHTS</strong> = Gas geven
          </p>
        ) : !result.finished ? (
          <div className="result-area">
            <h2 className={result.points === 100 ? "text-success" : "text-primary"}>
              {result.points === 100 ? "Perfecte Stabiliteit!" : `+${result.points} punten`}
            </h2>
            <h3>Totaal: {result.total}</h3>
            <button className="btn btn-success btn-lg mt-2" onClick={nextRound}>
              Volgende ronde
            </button>
          </div>
        ) : (
          <div className="final-area">
            <h2>Test voltooid!</h2>
            <h3 className="display-4">{result.total} punten</h3>
            <button className="btn btn-primary btn-lg mt-3" onClick={() => navigate("/games")}>
              Terug naar GameHub
            </button>
          </div>
        )}
      </div>
    </div>
  );
}