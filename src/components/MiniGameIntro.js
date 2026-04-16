import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/MiniGameIntro.css';

const MiniGameIntro = () => {
  return (
    <div className="minigame-wrapper bg">
      <div className="container-fluid h-100 p-0">
        <div className="row g-0 h-100">          
          <div className="col-md-8 d-flex flex-column align-items-center justify-content-center position-relative">            
            <div className="white-card shadow-lg d-flex flex-column align-items-center p-0">
                <h1 className="display-4 fw-bold mb-4 main-title">Magnet Switch</h1>
              
              <div className="video-overflow-container">
                <video 
                  className="game-video shadow" 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                >
                  <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-green-landscape-with-hills-and-clouds-41315-large.mp4" type="video/mp4" />
                </video>
              </div>

              <div className="card-content-bottom p-5 text-center">
                <p className="description-text">
                  Nadat alle minigames zijn gespeeld krijgen de gebruikers/kinderen een overzicht 
                  met daarin een overall score en zien ze hun eerdere gemaakte Hyperloop rijden. 
                  (dit kan op een kaart zijn of gewoon los) Hier krijg je nog extra info te zien 
                  over alles wat eerder gedaan is zoals de magneten, snelheid, etc.
                </p>
              </div>
            </div>
          </div>

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
              <button className="btn-start w-100 py-3 shadow-lg">
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
