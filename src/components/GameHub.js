import { useNavigate } from "react-router-dom";

export default function GameHub({ username, score, playedGames }) {
  const navigate = useNavigate();

  const games = [
    { id: 1, name: "Versnel de Hyperloop", route: "/games/uitleg/1" },
    { id: 2, name: "Magnet Switch", route: "/games/uitleg/2" },
    { id: 3, name: "Obstakels ontwijken", route: "/games/uitleg/3" },
  ];

  return (
    <div className="container">
      <h1>Welkom {username} 🚄</h1>
      <h2>Score: {score} ⭐</h2>

      <div className="game-grid">
        {games.map((game) => {
          const isPlayed = playedGames.includes(game.id);

          return (
            <div
              key={game.id}
              className={`game-card ${isPlayed ? "disabled" : ""}`}
              onClick={() => {
                if (!isPlayed) navigate(game.route);
              }}
            >
              <h2>{game.name}</h2>

              {isPlayed ? (
                <p>✅ Al gespeeld</p>
              ) : (
                <p>Klik om te spelen</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}