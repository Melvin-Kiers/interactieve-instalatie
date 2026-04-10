import { useState } from "react";
import VantaBackground from "./VantaBackground";

export default function NameInput({ setUsername }) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      localStorage.setItem("username", inputValue);
      setUsername(inputValue);
    }
  };

  return (
    <div className="start">
      <VantaBackground />
      <div className="text">
        <h1>Ontwerp je eigen Hyperloop en test hem uit!</h1>
      </div>
      <div className="input_field" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 50 }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Vul je naam in en druk Enter"
          style={{ padding: 10, fontSize: 16 }}
        />
        <p style={{ marginTop: 10 }}>Druk op Enter om verder te gaan</p>
      </div>
    </div>
  );
}