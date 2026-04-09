export default function HyperloopResult({ drawingData, selectedPart, onReset }) {
  return (
    <div className="result-page container mt-5">
      <div className="row align-items-center">
        
        {/* LINKS: afbeelding */}
        <div className="col-md-6 text-center">
          <img 
            src={drawingData} 
            alt="Hyperloop ontwerp" 
            className="result-image slide-in"
          />
        </div>

        {/* RECHTS: tekst */}
        <div className="col-md-6">
          <h2>Jouw Hyperloop</h2>
          <p>
            Dit is jouw ontworpen {selectedPart?.name}. 
            Je hebt zelf de kleuren gekozen en extra details getekend.
          </p>

          <p>
            Hyperloops zijn supersnelle transportsystemen van de toekomst 🚄
            waarbij capsules door buizen reizen met extreem hoge snelheid.
          </p>

          <button className="btn btn-primary mt-3" onClick={onReset}>
            Opnieuw beginnen
          </button>
        </div>

      </div>
    </div>
  );
}
