import { useState } from "react";
import NameInput from "./components/NameInput";
import HyperloopDesigner from "./components/HyperloopDesigner";
import "./css/App.css";


export default function App() {
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");

  const handleReset = () => {
    localStorage.removeItem("username");
    setUsername("");
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {!username ? (
        <NameInput setUsername={setUsername} />
      ) : (
        <HyperloopDesigner username={username} onReset={handleReset} />
      )}
    </div>
  );
}
