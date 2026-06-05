import { useState, useEffect } from "react";
import tickSoundFile from "../assets/sounds/go.mp3"; 
import goSoundFile from "../assets/sounds/button.mp3";

export default function Countdown({
  start = 3,
  onComplete = () => {},
  showGo = true,
  overlay = true,
  className = ""
}) {
  const [count, setCount] = useState(start);
  const [active, setActive] = useState(true);

  const playSound = (file) => {
    const audio = new Audio(file);
    audio.volume = 0.4;
    audio.play().catch((err) => {
      console.log("Audio kon niet direct afspelen via autoplay policy:", err);
    });
  };

  useEffect(() => {
    if (!active) return;


    if (count > 0) {
      playSound(tickSoundFile);
    } else if (count === 0 && showGo) {
      playSound(goSoundFile);
    }

    if (count === 0) {
      const timeout = setTimeout(() => {
        setActive(false);
        onComplete();
      }, showGo ? 400 : 0);

      return () => clearTimeout(timeout);
    }

    const timer = setTimeout(() => {
      setCount((c) => c - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, active, onComplete, showGo]);

  if (!active) return null;

  return (
    <div className={`countdown-wrapper ${overlay ? "overlay" : ""} ${className}`}>
      <span className="countdown-number">
        {count === 0 && showGo ? "GO!" : count}
      </span>
    </div>
  );
}