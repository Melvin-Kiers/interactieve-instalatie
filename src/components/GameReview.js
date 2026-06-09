import "../css/GameReview.css";

export default function GameReview() {
  const username = localStorage.getItem("username");
  const totalScore = Number(localStorage.getItem("score")) || 0;
  const hyperloopImage = localStorage.getItem("hyperloopImage");
  const playedGames = JSON.parse(localStorage.getItem("playedGames")) || [];
  const gameResults = JSON.parse(localStorage.getItem("gameResults")) || [];

  const gameNames = {
    1: "Rem precies goed",
    2: "Magneet Switch",
    3: "Centreer de Hyperloop",
  };

  const gameScore = gameResults.reduce((sum, g) => sum + (g.score || 0), 0);
  const quizScore = totalScore - gameScore;
  const correctQuizzes = quizScore / 50;

  return (
    <div className="lb-page-wrapper">
      <div className="container review-wrap">
        <h2 className="review-title">Missie overzicht</h2>

        <div className="review-header">
          {hyperloopImage && (
            <img src={hyperloopImage} alt="Hyperloop" className="hyperloop-img" />
          )}
          <div>
            <p className="player-name">{username}</p>
            <p className="player-sub">Hyperloop piloot</p>
            <div className="score-pill">
              <span className="score-num">{totalScore}</span>
              <span className="score-label">totaalscore</span>
            </div>
          </div>
        </div>

        <p className="section-label">Minigames</p>
        <div className="games-grid">
          {playedGames.map((gameId) => {
            const result = gameResults.find((g) => g.id === gameId);
            return (
              <div key={gameId} className="game-card">
                <p className="game-num">Minigame {gameId}</p>
                <p className="game-name">{gameNames[gameId]}</p>
                <div className="game-score-row">
                  <span className="game-score">{result?.score ?? 0} pts</span>
                  <span className="status-badge">✓ Voltooid</span>
                </div>
              </div>
            );
          })}
        </div>

        <hr className="review-divider" />

        <p className="section-label">Quizvragen</p>
        <div className="game-card" style={{ marginBottom: "1.5rem" }}>
          <div className="game-score-row">
            <div>
              <p className="game-num">Bonusvragen</p>
              <p className="game-name">{correctQuizzes} van de 3 goed</p>
            </div>
            <span className="game-score">+{quizScore} pts</span>
          </div>
          <div style={{ marginTop: 12, background: "rgba(255,255,255,0.05)", borderRadius: 8, overflow: "hidden", height: 6 }}>
            <div style={{ width: `${(correctQuizzes / 3) * 100}%`, height: "100%", background: "#F6653A", borderRadius: 8, transition: "width 0.6s ease" }} />
          </div>
        </div>

        <hr className="review-divider" />
        <div className="total-row" style={{ marginBottom: 8 }}>
          <span className="total-label">Minigames</span>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 16 }}>{gameScore} pts</span>
        </div>
        <div className="total-row" style={{ marginBottom: 8 }}>
          <span className="total-label">Quizbonus</span>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 16 }}>+{quizScore} pts</span>
        </div>
        <hr className="review-divider" />
        <div className="total-row">
          <span className="total-label">Eindtotaal</span>
          <span className="total-score">{totalScore} pts</span>
        </div>
      </div>
    </div>
  );
}