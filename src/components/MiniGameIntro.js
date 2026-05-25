import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/MiniGameIntro.css';
import minigamesData from '../data/minigamesData';

const MiniGameIntro = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const game = minigamesData.find(g => g.id === Number(id));

  useEffect(() => {
    // Luister naar Enter toets
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") navigate(`/game/${id}`);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
        videoRef.current.load();
      }
    };
  }, [id, navigate]);

  if (!game) return <div className="text-white text-center mt-5">Game niet gevonden</div>;

  return (
    <div className="minigame-wrapper bg">
      <div className="container-fluid h-100 p-0">
        <div className="row g-0 h-100">          
          <div className="col-md-8 d-flex flex-column align-items-center justify-content-center position-relative">            
            <div className="white-card shadow-lg d-flex flex-column align-items-center p-0">
              
              <h1 className="display-4 fw-bold mb-4 main-title">{game.title}</h1>
              
              <div className="video-overflow-container">
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

              <div className="card-content-bottom p-5 text-center">
                <p className="description-text">{game.description}</p>
              </div>
            </div>
          </div>

          
          <div className="col-md-4 sidebar-custom d-flex flex-column p-5">
            <div className="flex-grow-1">
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

            <div className="mb-4">
              <button 
                className="btn-start w-100 py-3 shadow-lg"
                onClick={() => navigate(`/game/${id}`)}
              >
                Druk op de oranje knop om te starten!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniGameIntro;