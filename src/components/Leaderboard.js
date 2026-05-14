import React from "react";
import { useNavigate } from "react-router-dom";
import icon from "../assets/icons/star.png";
import rankIcon from "../assets/icons/trophy.png";

export default function Leaderboard({ onReset }) {
  const leaderboardData = JSON.parse(localStorage.getItem("globalLeaderboard")) || [];
  const sortedPlayers = [...leaderboardData].sort((a, b) => b.score - a.score);

  const handleRestart = () => {
    if (onReset) onReset();
    window.location.href = "/";
  };

  return (
    <div className="lb-page-wrapper">
      <div className="container py-5">
        <div className="col-12">
            <h1 className="lb-title mb-5">Leaderboard</h1>
            
            {/* TOP 3 SECTIE */}
            <div className="row justify-content-center mb-5 mt-4">
            {sortedPlayers.slice(0, 3).map((player, index) => (
                <div key={index} className={`col-md-4 mb-4 podium-slot rank-${index + 1}`}>
                <div className="podium-card">
                    <div className="rank-badge">{index + 1}</div>
                    <img src={player.pod} alt="pod" className="pod-display-large" />
                    <h2 className="player-name-large">{player.name}</h2>
                    <div className="score-tag">{player.score} Punten</div>
                    <p className=" italic">{player.date}</p>
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
                        <img src={icon} alt="" className="score-icon" />
                        {player.score}
                      </span>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mt-5">
          <button className="btn-restart-neon" onClick={handleRestart}>
            NIEUWE MISSIE STARTEN
          </button>
        </div>
      </div>
    </div>
  );
}