import "../css/GameReview.css";
import Speedometer from "../components/Speedometer.js";

export default function GameReview() {
  const username = localStorage.getItem("username");
  const totalScore = Number(localStorage.getItem("score")) || 0;
  const hyperloopImage = localStorage.getItem("hyperloopImage");
  const playedGames = JSON.parse(localStorage.getItem("playedGames")) || [];
  const gameResults = JSON.parse(localStorage.getItem("gameResults")) || [];

  const gameNames = {
    1: "Rem precies goed",
    2: "Magneet Wisselen",
    3: "Centreer de Hyperloop",
  };

  const gameScore = gameResults.reduce((sum, g) => sum + (g.score || 0), 0);
  const quizScore = totalScore - gameScore;
  const correctQuizzes = quizScore / 50;

  const initials = username ? username.charAt(0).toUpperCase() : "?";

  const getScore10 = (score) => {
    if (score >= 1000) return 10;
    if (score >= 900) return 9;
    if (score >= 800) return 8;
    if (score >= 700) return 7;
    if (score >= 600) return 6;
    if (score >= 500) return 5;
    if (score >= 400) return 4;
    if (score >= 300) return 3;
    if (score >= 200) return 2;
    return 1;
  };

const score10 = getScore10(totalScore);

  return (
    <div className="review-wrap">
      <div className="container py-2">
        <h1 className="title-review">Bekijk hier al je scores, <span className="orange">{username}</span>!</h1>

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
              om jouw Hyperloop met scores uit te printen!
            </h5>

        <div className="hero">
          {hyperloopImage ? (
            <img src={hyperloopImage} alt="Hyperloop" className="hero-img" />
          ) : (
            <div className="hero-img hero-img--empty">
              <i className="ti ti-train" aria-hidden="true"></i>
            </div>
          )}

          <div className="hero-info">
            <div className="pilot-row">
              <div className="avatar">{initials}</div>
              <div>
                <p className="pilot-name">{username}</p>
                <p className="pilot-sub">Hyperloop piloot</p>
              </div>
            </div>

            <div className="stat-grid">
              <div className="stat">
                <div className="stat-val orange">{totalScore}<span className="max-number"> / 1000</span></div>
                <div className="stat-lbl">Totaalscore</div>
              </div>
              <div className="stat">
                <div className="stat-val">{playedGames.length} / 3</div>
                <div className="stat-lbl">Minigames voltooid</div>
              </div>
              <div className="stat">
                <div className="stat-val">{correctQuizzes} / 3</div>
                <div className="stat-lbl">Quizvragen goed</div>
              </div>
              <div className="stat">
                <div className="stat-val">+{quizScore}</div>
                <div className="stat-lbl">Quizbonus</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", width:"100%" }}>
          <Speedometer score={totalScore} max={1000} label="Totaal punten" />
          <Speedometer score={score10} max={10} label="Eindbeoordeling" />
        </div>

        <hr className="review-divider" />

        <p className="sec-label">Minigames</p>
        <div className="games-list">
          {playedGames.map((gameId) => {
            const result = gameResults.find((g) => g.id === gameId);
            return (
              <div key={gameId} className="gcard">
                <span className="gcard-num">Minigame {gameId}:</span>
                <span className="gcard-name orange">{gameNames[gameId]}</span>
                <span className="gcard-score">{result?.score ?? 0} punten</span>
                <span className="done-badge">
                  ✓ Voltooid
                </span>
              </div>
            );
          })}
        </div>

        <p className="sec-label">Quizvragen</p>
        <div className="quiz-card">
          <div className="quiz-top">
            <span className="quiz-title">{correctQuizzes} van de 3 vragen goed</span>
            <span className="quiz-pts">+{quizScore} punten</span>
          </div>
          <div className="dots">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`dot ${i <= correctQuizzes ? "correct" : "wrong"}`}>
                {i <= correctQuizzes ? "✓" : "✕"}
              </div>
            ))}
          </div>
          <div className="bar-bg">
            <div className="bar-fill" style={{ width: `${(correctQuizzes / 3) * 100}%` }}></div>
          </div>
        </div>

        <hr className="review-divider" />
        <div className="total-rows">
          <div className="tr">
            <span className="tr-lbl">Minigames</span>
            <span className="tr-val">{gameScore} punten</span>
          </div>
          <div className="tr">
            <span className="tr-lbl">Quizbonus</span>
            <span className="tr-val">+{quizScore} punten</span>
          </div>
          <hr className="review-divider" />
          <div className="tr final">
            <span className="tr-lbl">Totaal</span>
            <span className="tr-val">{totalScore} punten</span>
          </div>
        </div>
      </div>
    </div>
  );
}