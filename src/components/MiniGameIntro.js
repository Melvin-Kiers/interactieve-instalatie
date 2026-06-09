import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/MiniGameIntro.css';
import minigamesData from '../data/minigamesData';

const MiniGameIntro = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [buttonsVisible, setButtonsVisible] = useState(false);

  const game = minigamesData.find(g => g.id === Number(id));

  useEffect(() => {
  const handleKeyDown = (e) => {
    if (!buttonsVisible) return;

    if (e.key === "ArrowRight") navigate(`/game/${id}`);
    if (e.key === "ArrowLeft") navigate(`/games`);
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [id, navigate, buttonsVisible]);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
        videoRef.current.load();
      }
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setButtonsVisible(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  if (!game) return <div className="text-white text-center mt-5">Game niet gevonden</div>;

  return (
    <div className="minigame-wrapper bg">
      <div className="container-fluid h-100 p-0">
        <div className="row g-0 h-100">          
          <div className="col-md-8 d-flex flex-column align-items-center justify-content-center position-relative">            
            <div className="white-card shadow-lg d-flex flex-column align-items-center p-0">
              
              <h1 className="display-4 fw-bold mb-4 main-title pop-up1">{game.title}</h1>
              <div className="card-content-bottom mb-5 text-center pop-up1">
                <p className="description-text">{game.description}</p>
              </div>
              
              <div className="video-overflow-container position-relative videoPop-in">
                <div className="video-overlay">
                  Voorbeeld
                </div>
                <video 
                  ref={videoRef}
                  className="game-video shadow" 
                  autoPlay 
                  loop 
                  playsInline
                >
                  <source src={game.video} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>

          
          <div className="col-md-4 sidebar-custom d-flex flex-column p-5">
            <div className="controls flex-grow-1">
              <h2 className="text-white text-center mb-0">Besturing</h2>
              <div className="divider my-2"></div>
              
              <div className="controls-container mt-5">
                {game.controls && game.controls.map((control, index) => (
                  <div key={index} className="control-item d-flex align-items-center mb-4">
                    <div className="control-icon-wrapper me-3">
                      <img src={control.icon} alt={control.label} style={{ width: control.size ?? "60px" }} />
                    </div>
                    <span className="text-white fs-4">{control.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`buttons mb-4 ${buttonsVisible ? "visible" : ""}`}>
              <button 
                className="btn-start w-100 py-3 shadow-lg"
                onClick={() => navigate(`/game/${id}`)}
              >
                Druk op de oranje knop om te starten!
              </button>
              <button 
                className="btn-back w-90 py-3 shadow-lg"
                onClick={() => navigate(`/games`)}
              >
                Terug naar minigames
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniGameIntro;