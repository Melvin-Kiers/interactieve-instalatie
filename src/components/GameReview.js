import { useRef } from "react";
import "../css/GameReview.css";
import Speedometer from "../components/Speedometer.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function GameReview() {
  const printRef = useRef(null);

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

  const initials = username ? username.charAt(0).toUpperCase() : "?";

  const handlePrint = async () => {
    const element = printRef.current;

    const clonedElement = element.cloneNode(true);
    clonedElement.style.height = "auto";
    clonedElement.style.maxHeight = "none";

    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "0";
    container.style.width = element.offsetWidth + "px";

    container.appendChild(clonedElement);
    document.body.appendChild(container);

    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#0a0b0f",
      windowWidth: clonedElement.scrollWidth,
      windowHeight: clonedElement.scrollHeight,
    });

    document.body.removeChild(container);

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    const addPageWithBackground = (posY) => {
      pdf.setFillColor(10, 11, 15);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");
      pdf.addImage(imgData, "PNG", 0, posY, imgWidth, imgHeight);
    };

    addPageWithBackground(position);

    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      addPageWithBackground(position);
      heightLeft -= pageHeight;
    }

    pdf.save(`hyperloop-${username}.pdf`);
  };

  return (
    <div className="review-wrap" ref={printRef}>
      <div className="container py-2">

        <h1 className="title-review">
          Bekijk hier al je scores, <span className="orange">{username}</span>!
        </h1>

        <h5>
          Klik{" "}
          <span
            onClick={handlePrint}
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              color: "#F6653A",
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
                <div className="stat-val orange">
                  {totalScore}<span className="max-number"> / 1000</span>
                </div>
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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", width: "100%" }}>
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
                <span className="done-badge">✓ Voltooid</span>
              </div>
            );
          })}
        </div>

        <p className="sec-label">Quizvragen</p>
        <div className="quiz-card">
          <div className="quiz-top">
            <span className="quiz-title">
              {correctQuizzes} van de 3 vragen goed
            </span>
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
            <div
              className="bar-fill"
              style={{ width: `${(correctQuizzes / 3) * 100}%` }}
            />
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
            <span className="tr-val">{totalScore} punten
              <span className="logo">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_653_6235)">
                    <path d="M24.0004 0C37.253 0.000191021 48 10.7503 48 24C48 37.2497 37.253 47.9998 24.0004 48C10.7476 48 0 37.2498 0 24C1.406e-05 10.7502 10.7476 0 24.0004 0ZM24.0004 2.28251C12.0231 2.28251 2.28006 12.0181 2.28004 24C2.28004 35.9819 12.0231 45.7175 24.0004 45.7175C28.7173 45.7174 33.0865 44.2048 36.6516 41.6412C34.2031 42.7577 31.4817 43.3815 28.6139 43.3815C17.903 43.3815 9.22695 34.7049 9.22695 24C9.22695 13.2951 17.9121 4.61923 28.6139 4.61923C31.4817 4.61928 34.2032 5.24161 36.6516 6.35802C33.0866 3.79454 28.7171 2.28258 24.0004 2.28251ZM28.6139 6.90096C19.1877 6.90096 11.507 14.5721 11.507 24C11.507 33.4279 19.1786 41.099 28.6139 41.099C32.8981 41.0989 36.8184 39.5169 39.8222 36.9074C37.9632 37.7885 35.884 38.2821 33.6885 38.2821C25.782 38.2821 19.3769 31.8883 19.3769 24C19.3769 16.1118 25.7911 9.71794 33.6885 9.71786C35.8841 9.71786 37.9639 10.2113 39.8229 11.0926C36.8191 8.48283 32.8983 6.90104 28.6139 6.90096ZM33.6885 12.0004C27.0485 12.0004 21.657 17.3797 21.6569 24C21.6569 30.6203 27.0485 36.0004 33.6885 36.0004C40.3284 36.0004 45.72 30.6204 45.72 24C45.7199 17.3797 40.3193 12.0004 33.6885 12.0004Z" fill="#F6653A"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_653_6235">
                      <rect width="48" height="48" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}