import { useState } from "react";
import VantaBackground from "./VantaBackground";

export default function NameInput({ setUsername }) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    if (inputValue.trim() !== "") {
      localStorage.setItem("username", inputValue);
      setUsername(inputValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") handleSubmit();
  };

  return (
    <div className="start">
      <VantaBackground />

      <div className="overlay" />

      <div className="content">
        <h1>
          Ontwerp je eigen <br/><span>Hyperloop </span> en ontdek.
        </h1>

        <p className="subtitle">
          Bouw. Speel. Leer.<br />
          Teken je eigen Hyperloop en ontdek hoe deze werkt.
        </p>

        <div className="input_group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Vul je naam in..."
          />

          <button onClick={handleSubmit}>
            Enter →
          </button>
        </div>

        <p className="hint">Druk op Enter om verder te gaan</p>
      </div>
    </div>
  );
}