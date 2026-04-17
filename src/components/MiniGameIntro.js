import React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/MiniGameIntro.css';
import minigamesData from '../data/minigamesData';

const MiniGameIntro = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const game = minigamesData.find(g => g.id === Number(id));

  if (!game) {
    return <div className="text-white text-center mt-5">Game niet gevonden</div>;
  }

  return (
    <div className="minigame-wrapper bg">
      <div className="container-fluid h-100 p-0">
        <div className="row g-0 h-100">          

          {/* LINKERKANT */}
          <div className="col-md-8 d-flex flex-column align-items-center justify-content-center position-relative">            
            <div className="white-card shadow-lg d-flex flex-column align-items-center p-0">
              
              <h1 className="display-4 fw-bold mb-4 main-title">
                {game.title}
              </h1>
              
              <div className="video-overflow-container">
                <video 
                  className="game-video shadow" 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                >
                  <source src={game.video} type="video/mp4" />
                </video>
              </div>

              <div className="card-content-bottom p-5 text-center">
                <p className="description-text">
                  {game.description}
                </p>
              </div>

            </div>
          </div>

          {/* RECHTERKANT */}
          <div className="col-md-4 sidebar-custom d-flex flex-column p-5">
            
            <div className="flex-grow-1">
              <h2 className="text-white text-center mb-0">Besturing</h2>
              <div className="divider my-2"></div>
              
              <div className="controls-container mt-5">
                <div className="control-item d-flex align-items-center mb-4">
                  <div className="control-circle me-3">↑</div>
                  <span className="text-white fs-4">Omhoog</span>
                </div>
                
                <div className="control-item d-flex align-items-center">
                  <div className="control-circle me-3">↓</div>
                  <span className="text-white fs-4">Omlaag</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <button 
                className="btn-start w-100 py-3 shadow-lg"
                onClick={() => navigate(`/game/${id}`)}
              >
                Start (ENTER)
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default MiniGameIntro;