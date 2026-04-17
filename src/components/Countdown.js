import { useState, useEffect } from "react";

export default function Countdown({
  start = 3,
  onComplete = () => {},
  showGo = true,
  overlay = true,
  className = ""
}) {
  const [count, setCount] = useState(start);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!active) return;

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