import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import icon from "../assets/icons/star.png";
import rankIcon from "../assets/icons/trophy.png";
import buttonSound from "../assets/sounds/endVO.mp3";

export default function Leaderboard({ onReset }) {
  const leaderboardData = JSON.parse(localStorage.getItem("globalLeaderboard")) || [];
  const sortedPlayers = [...leaderboardData].sort((a, b) => b.score - a.score);

  const [showPopup, setShowPopup] = useState(true);
  const navigate = useNavigate();
  const myPlayer = JSON.parse(localStorage.getItem("myPlayer"));

  const myPosition = myPlayer
    ? sortedPlayers.findIndex(
        (p) =>
          p.name === myPlayer.name &&
          p.score === myPlayer.score
      ) + 1
    : null;

    const handleRestart = () => {
      if (onReset) onReset();
      window.location.href = "/";
    };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code !== "ArrowRight") return;

      if (showPopup) {
        // 1. popup sluiten
        setShowPopup(false);

        const audio = new Audio(buttonSound);
        audio.play().catch(() => {});
      } else {
        // 2. terug naar home
        handleRestart();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showPopup]);

  const topThree = sortedPlayers.slice(0, 3);

  const podiumOrder = [
    { player: topThree[1], rank: 2 },
    { player: topThree[0], rank: 1 },
    { player: topThree[2], rank: 3 },
  ].filter(item => item.player);

  return (
    <div className="lb-page-wrapper">
      {showPopup && myPosition > 0 && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h2>Dit is hoe jij gescoord hebt, <strong className="name">{myPlayer.name}</strong>!</h2>

            <p>
              Je bent geëindigd op plek <strong className="position">{myPosition}</strong> met{" "}
              <strong className="score">{myPlayer.score}</strong> punten! 
            </p>

            <button
              className="btn-orange"
              onClick={() => {
                setShowPopup(false);

                const audio = new Audio("/sounds/thanks.mp3");
                audio.play().catch(() => {});
              }}
            >
              Druk op de oranje knop om door te gaan
            </button>
          </div>
        </div>
      )}
      <div className="container py-5">
        <div className="col-12">
          <div className="lb-title">
            <h1>Bekijk hier <span>jouw score</span> en die van anderen!</h1>
            <h5>
              Klik{" "}
              <span
                onClick={() => window.open("/game-review", "_blank")}
                style={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  color: "#F6653A"
                }}
              >
                hier
              </span>{" "}
              om jouw Hyperloop uit te printen met je score, of deel hem{" "}
              <span
                onClick={() => window.open("/game-review", "_blank")}
                style={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  color: "#F6653A"
                }}
              >
                hier
              </span>{" "}
              met anderen!
            </h5>
          </div>
            
            {/* TOP 3 SECTIE */}
            <div className="row justify-content-center align-items-end mb-5 mt-4">
              {podiumOrder.map(({ player, rank }) => (
                <div
                  key={rank}
                  className={`col-md-4 mb-4 podium-slot rank-${rank}`}
                >
                  <div className="podium-card">
                    <div className="rank-badge">{rank}</div>

                    <img
                      src={player.pod}
                      alt="pod"
                      className="pod-display-large"
                    />

                    <div className="divider mb-4"></div>
                    <h2 className="player-name-large">{player.name}</h2>
                    <p className="italic">{player.date}</p>

                    <div className="score-tag">
                      {player.score} Punten
                      <span className="logo">
                          <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_653_6235)">
                            <path d="M24.0004 0C37.253 0.000191021 48 10.7503 48 24C48 37.2497 37.253 47.9998 24.0004 48C10.7476 48 0 37.2498 0 24C1.406e-05 10.7502 10.7476 0 24.0004 0ZM24.0004 2.28251C12.0231 2.28251 2.28006 12.0181 2.28004 24C2.28004 35.9819 12.0231 45.7175 24.0004 45.7175C28.7173 45.7174 33.0865 44.2048 36.6516 41.6412C34.2031 42.7577 31.4817 43.3815 28.6139 43.3815C17.903 43.3815 9.22695 34.7049 9.22695 24C9.22695 13.2951 17.9121 4.61923 28.6139 4.61923C31.4817 4.61928 34.2032 5.24161 36.6516 6.35802C33.0866 3.79454 28.7171 2.28258 24.0004 2.28251ZM28.6139 6.90096C19.1877 6.90096 11.507 14.5721 11.507 24C11.507 33.4279 19.1786 41.099 28.6139 41.099C32.8981 41.0989 36.8184 39.5169 39.8222 36.9074C37.9632 37.7885 35.884 38.2821 33.6885 38.2821C25.782 38.2821 19.3769 31.8883 19.3769 24C19.3769 16.1118 25.7911 9.71794 33.6885 9.71786C35.8841 9.71786 37.9639 10.2113 39.8229 11.0926C36.8191 8.48283 32.8983 6.90104 28.6139 6.90096ZM33.6885 12.0004C27.0485 12.0004 21.657 17.3797 21.6569 24C21.6569 30.6203 27.0485 36.0004 33.6885 36.0004C40.3284 36.0004 45.72 30.6204 45.72 24C45.7199 17.3797 40.3193 12.0004 33.6885 12.0004Z" fill="#F6653A"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_653_6235">
                            <rect width="48" height="48" fill="white"/>
                            </clipPath>
                            </defs>
                          </svg>
                        </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        

            {/* OVERIGE SPELERS TABEL */}
          <div className="lb-glass-container">
            <table className="table lb-table">
                <thead>
                <tr>
                    <th>Plaats</th>
                    <th></th>
                    <th>Naam</th>
                    <th>Datum</th>
                    <th>Punten</th>
                </tr>
                </thead>
                <tbody>
                {sortedPlayers.slice(3).map((player, index) => (
                    <tr key={index + 3}>
                    <td>
                      {index + 4 >= 4 && (
                        <img 
                          src={rankIcon} 
                          alt="" 
                          className="rank-icon"
                        />
                      )}
                      {index + 4}
                    </td>
                    <td><img src={player.pod} alt="pod" className="pod-mini" /></td>
                    <td>{player.name}</td>
                    <td>{player.date}</td>
                    <td className="lb-score">
                      <span className="score-badge">
                        {player.score}
                        {/* <img src={icon} alt="" className="score-icon" /> */}
                        <span className="logo">
                          <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_653_6235)">
                            <path d="M24.0004 0C37.253 0.000191021 48 10.7503 48 24C48 37.2497 37.253 47.9998 24.0004 48C10.7476 48 0 37.2498 0 24C1.406e-05 10.7502 10.7476 0 24.0004 0ZM24.0004 2.28251C12.0231 2.28251 2.28006 12.0181 2.28004 24C2.28004 35.9819 12.0231 45.7175 24.0004 45.7175C28.7173 45.7174 33.0865 44.2048 36.6516 41.6412C34.2031 42.7577 31.4817 43.3815 28.6139 43.3815C17.903 43.3815 9.22695 34.7049 9.22695 24C9.22695 13.2951 17.9121 4.61923 28.6139 4.61923C31.4817 4.61928 34.2032 5.24161 36.6516 6.35802C33.0866 3.79454 28.7171 2.28258 24.0004 2.28251ZM28.6139 6.90096C19.1877 6.90096 11.507 14.5721 11.507 24C11.507 33.4279 19.1786 41.099 28.6139 41.099C32.8981 41.0989 36.8184 39.5169 39.8222 36.9074C37.9632 37.7885 35.884 38.2821 33.6885 38.2821C25.782 38.2821 19.3769 31.8883 19.3769 24C19.3769 16.1118 25.7911 9.71794 33.6885 9.71786C35.8841 9.71786 37.9639 10.2113 39.8229 11.0926C36.8191 8.48283 32.8983 6.90104 28.6139 6.90096ZM33.6885 12.0004C27.0485 12.0004 21.657 17.3797 21.6569 24C21.6569 30.6203 27.0485 36.0004 33.6885 36.0004C40.3284 36.0004 45.72 30.6204 45.72 24C45.7199 17.3797 40.3193 12.0004 33.6885 12.0004Z" fill="#F6653A"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_653_6235">
                            <rect width="48" height="48" fill="white"/>
                            </clipPath>
                            </defs>
                          </svg>
                        </span>
                      </span>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mt-5">
          <button className="btn-orange" onClick={handleRestart} style={{ fontSize: "20px" }}> 
            Nieuwe missie starten / Terug naar start
          </button>
        </div>
      </div>
    </div>
  );
}