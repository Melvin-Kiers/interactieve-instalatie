import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NameInput from "./NameInput";

export default function IdleTracker({ timeout = 30000, countdownStart = 10 }) {
  const navigate = useNavigate();
  const location = useLocation();

  const allowedPaths = ["/games", "/designer", "/leaderboard", "/game-review", "/game/1", "/game/2", "/game/3", "/games/uitleg/1", "/games/uitleg/2", "/games/uitleg/3"];
  const isActiveRoute = allowedPaths.includes(location.pathname);

  const idleTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const showPopupRef = useRef(false);

  const [showPopup, setShowPopup] = useState(false);
  const [countdown, setCountdown] = useState(countdownStart);

  const setPopup = (val) => {
    showPopupRef.current = val;
    setShowPopup(val);
  };

  const startCountdown = () => {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    let current = countdownStart;
    setCountdown(current);

    countdownTimerRef.current = setInterval(() => {
      current -= 1;
      setCountdown(current);

      if (current <= 0) {
        clearInterval(countdownTimerRef.current);
        navigate("/");
      }
    }, 1000);
  };

  const resetIdle = () => {
    if (!isActiveRoute) return;
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    idleTimerRef.current = setTimeout(() => {
      setPopup(true);
      startCountdown();
    }, timeout);
  };

  const handleActivity = () => {
    if (!isActiveRoute) return;

    if (showPopupRef.current) {
      setPopup(false);
      clearInterval(countdownTimerRef.current);
      resetIdle();
      return;
    }

    resetIdle();
  };

  useEffect(() => {
    if (!isActiveRoute) {
      setPopup(false);
      clearTimeout(idleTimerRef.current);
      clearInterval(countdownTimerRef.current);
      return;
    }

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, handleActivity));
    resetIdle();

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      clearTimeout(idleTimerRef.current);
      clearInterval(countdownTimerRef.current);
    };
  }, [location.pathname]); // ← showPopup eruit

  if (!showPopup) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
      }}
    >
      <div
        style={{
          background: "#0E0F15",
          border: "0.5px solid rgba(255,255,255,0.1)",
          padding: 36,
          borderRadius: 12,
          width: 360,
          textAlign: "center",
          color: "white",
        }}
      >
        <h3 style={{ marginBottom: 10, fontSize: 28 }}>Ben je er nog?</h3>

        <p style={{ opacity: 0.5, marginBottom: 24, fontSize: 14 }}>
          Geen activiteit gedetecteerd
        </p>

        <div
          style={{
            fontSize: 56,
            fontWeight: 500,
            color: "#F6653A",
            marginBottom: 24,
            lineHeight: 1,
          }}
        >
          {countdown}
        </div>

        <p style={{ fontSize: 12, opacity: 0.4, marginBottom: 20 }}>
          Je gaat automatisch terug naar de start!
        </p>

        <button
          onClick={() => {
            setPopup(false);
            clearInterval(countdownTimerRef.current);
            resetIdle();
          }}
          style={{
            padding: "10px 24px",
            borderRadius: 8,
            background: "#F6653A",
            color: "white",
            cursor: "pointer",
            fontSize: 18,
            fontFamily: "safiro-medium",
          }}
        >
          Verdergaan
        </button>
      </div>
    </div>
  );
}