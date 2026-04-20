import { useState, useRef, useEffect } from "react";
import HyperloopResult from "./HyperloopResult";
import "../css/Designer.css";

export default function HyperloopDesigner({ username, onReset }) {
  const [selectedPart, setSelectedPart] = useState(null);
  const [partColor, setPartColor] = useState("#F6653A");
  const [drawColor, setDrawColor] = useState("#000000");
  const [drawingData, setDrawingData] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Refs voor de twee lagen
  const backgroundCanvasRef = useRef(null); // Voor de Hyperloop (SVG)
  const canvasRef = useRef(null);           // Voor de tekening van de gebruiker
  
  const isDrawing = useRef(false);
  const prevPos = useRef(null);

  // Vaste afmetingen voor stabiliteit
  const canvasWidth = 1200;
  const canvasHeight = 250;

  const [tool, setTool] = useState("brush"); // "brush" | "eraser"
  const [pattern, setPattern] = useState("none"); // "none" | "dots" | "stripes"

  const parts = [
    {
      id: 1,
      name: "Car",
      discription: "Gaat met zo'n 700km/u door een vacuum buis met zijn scherpe neus die naar beneden richt",
      svgString: `<svg width="1199" height="174" viewBox="0 0 1199 174" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M844 0H46.9447C36.376 0 26.1998 4.00451 18.4655 11.2071C12.6117 16.6585 8.44542 23.6753 6.46151 31.4244L5.51551 35.1195C1.97857 48.9346 3.96646 63.5844 11.057 75.9574L16.3269 85.1536C22.0433 95.1287 29.8197 103.771 39.1382 110.505L100.779 155.051C117.825 167.369 138.32 174 159.351 174H1181.16C1185.51 174 1189.65 172.125 1192.51 168.855C1196.46 164.362 1197.38 157.966 1194.87 152.54L1194.75 152.274C1193.29 149.131 1190.83 146.562 1187.75 144.977L1044.5 71.2046L938.614 12.5311C923.782 4.31215 907.103 0 890.146 0H844Z" fill="__COLOR__"/><path d="M56 122.5L938 127L943.162 126.362C968.431 123.239 991.557 110.594 1007.82 91.0073L1031.5 62.5L1042.5 69.5L1017.5 143.5H937L82.5 141L56 122.5Z" fill="#FCA422"/><path d="M58 124.5L940 129L945.162 128.362C970.431 125.239 993.557 112.594 1009.82 93.0073L1033.5 64.5L1044.5 71.5L1019.5 145.5H939L84.5 143L58 124.5Z" fill="white"/><path d="M1194.87 152.54L1194.75 152.282C1193.29 149.134 1190.82 146.563 1187.74 144.98L1044.5 71.5L1020.74 104.444C1002.38 129.911 972.897 145 941.5 145L539 143H85.5L100.381 154.116C117.662 167.025 138.655 174 160.226 174H1181.16C1185.51 174 1189.65 172.125 1192.51 168.855C1196.46 164.362 1197.38 157.966 1194.87 152.54Z" fill="black"/><rect x="220" y="36.5" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><rect x="314" y="36.5" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><rect x="615" y="36.5" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><rect x="710" y="36.5" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><rect x="804" y="36.5" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><path d="M470 60.5C478.837 60.5 486 67.6634 486 76.5V129.5H454V76.5C454 67.6634 461.163 60.5 470 60.5Z" fill="white" stroke="white" stroke-width="5"/></svg>`
    },
    {
      id: 2,
      name: "Train",
      discription: "Gaat met zo'n 700km/u door een vacuum buis met zijn scherpe neus die naar het midden richt",
      svgString: `<svg width="1188" height="175" viewBox="0 0 1188 175" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M844 0H46.9447C36.376 0 26.1998 4.00451 18.4655 11.2071C12.6117 16.6585 8.44542 23.6754 6.4615 31.4244L5.51551 35.1195C1.97857 48.9346 3.96646 63.5844 11.057 75.9574L16.3269 85.1536C22.0433 95.1287 29.8197 103.771 39.1382 110.505L100.779 155.051C117.825 167.369 138.32 174 159.351 174H1050.7C1072.62 174 1093.94 166.794 1111.37 153.49L1180.41 100.795C1184.37 97.7736 1184.63 91.9091 1180.96 88.5419L1113.18 26.329C1094.74 9.39557 1070.61 0.000112005 1045.56 9.38629e-05L916 0H844Z" fill="__COLOR__"/><path d="M57 122.5L939 127L1039.24 125.886C1061.75 125.636 1083.52 117.798 1101.02 103.64L1152.5 62.0001L1157.5 68.5001L1108 118.5L1018.5 143.5H938L83.5 141L57 122.5Z" fill="#FCA422"/><path d="M59 124.5L941 129H1038.08C1060.08 129 1081.46 121.749 1098.92 108.368L1155.5 65.0001L1166 75.0001L1104.5 143.5L940 145.5L85 143.5L59 124.5Z" fill="white"/><rect x="220" y="36.5001" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><rect x="314" y="36.5001" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><rect x="615" y="36.5001" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><rect x="710" y="36.5001" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><rect x="804" y="36.5001" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><path d="M470 60.5001C478.837 60.5001 486 67.6636 486 76.5001V129.5H454V76.5001C454 67.6636 461.163 60.5001 470 60.5001Z" fill="white" stroke="white" stroke-width="5"/><path d="M1182.76 90.2395L1166 75.0001L1128.5 108.5L1124.24 112.953C1105.84 132.186 1080.54 143.292 1053.93 143.811L993 145H943L540.5 143L85 143.5L102.428 155.92C119.385 168.005 139.692 174.494 160.515 174.483L1053.29 174.018C1075.77 174.007 1097.59 166.421 1115.23 152.486L1182.45 99.3872C1185.35 97.0901 1185.51 92.7323 1182.76 90.2395Z" fill="black"/><circle cx="1038" cy="72.0001" r="32" fill="black"/></svg>`
    }
  ];

  // EFFECT: Teken de SVG opnieuw als de kleur verandert
  useEffect(() => {
    if (!selectedPart || !backgroundCanvasRef.current) return;

    const bgCanvas = backgroundCanvasRef.current;
    const bgCtx = bgCanvas.getContext("2d");
    
    const coloredSvg = selectedPart.svgString.replace(/__COLOR__/g, partColor);
    const img = new Image();
    
    img.onload = () => {
      // Maak alleen de achtergrondlaag schoon
      bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      
      const padding = 20;
      const aspectRatio = img.width / img.height;
      let drawWidth = bgCanvas.width - 2 * padding;
      let drawHeight = bgCanvas.height - 2 * padding;

      if (drawWidth / drawHeight > aspectRatio) {
        drawWidth = drawHeight * aspectRatio;
      } else {
        drawHeight = drawWidth / aspectRatio;
      }

      const offsetX = (bgCanvas.width - drawWidth) / 2;
      const offsetY = (bgCanvas.height - drawHeight) / 2;

      bgCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };
    // Gebruik unescape(encodeURIComponent()) om SVG karakters veilig te verwerken
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(coloredSvg)))}`;
  }, [selectedPart, partColor]);

  // Teken functies
  const startDrawing = (e) => {
    isDrawing.current = true;
    draw(e);
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    prevPos.current = null;
  };

const draw = (e) => {
  if (!isDrawing.current) return;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // --- GUM LOGICA ---
  if (tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out"; // Dit maakt pixels transparant
    ctx.lineWidth = 20; // Gum mag vaak iets dikker zijn
  } else {
    ctx.globalCompositeOperation = "source-over"; // Normaal tekenen
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = 4;
  }
  // ------------------

  ctx.lineCap = "round";
  ctx.beginPath();
  if (prevPos.current) {
    ctx.moveTo(prevPos.current.x, prevPos.current.y);
  } else {
    ctx.moveTo(x, y);
  }
  ctx.lineTo(x, y);
  ctx.stroke();

  prevPos.current = { x, y };
};

  const handleSubmit = () => {
    // Voeg beide lagen samen voor het eindresultaat
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = canvasWidth;
    finalCanvas.height = canvasHeight;
    const finalCtx = finalCanvas.getContext("2d");

    // Achtergrond (trein) eerst, dan de tekening
    finalCtx.drawImage(backgroundCanvasRef.current, 0, 0);
    finalCtx.drawImage(canvasRef.current, 0, 0);

    const data = finalCanvas.toDataURL("image/png");
    setDrawingData(data);
    localStorage.setItem("hyperloopImage", data);
    setSubmitted(true);
  };

  return (
    <div className=" hyperloop-choice-bg">
      <div className="container hyperloop-choice">
        <div className="designer-header">
          <h1>Ontwerp jouw Hyperloop, {username}!</h1>
        </div>

        {!selectedPart && !submitted && (
          <div className="part-selection">
            <div className="part-selection-items">
              {parts.map(part => (
                <div 
                  key={part.id} 
                  className="part-item"
                  onClick={() => setSelectedPart(part)} 
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src={`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(part.svgString.replace(/__COLOR__/g,"#F6653A"))))}`} 
                    alt={part.name}
                  />
                  <div className="info-hyperloop">
                    <h2>{part.name}</h2>
                    <p>{part.discription}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={onReset} className="reset-btn">Terug naar start</button>
          </div>
        )}

        {selectedPart && !submitted && (
          <div className="designer-ui">
            <div className="glass-card">
              
              {/* DE CANVAS CONTAINER MET VASTE HOOGTE */}
              <div className="preview-container" style={{ 
                  position: 'relative', 
                  width: `${canvasWidth}px`, 
                  height: `${canvasHeight}px`,
                  margin: '20px auto',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  overflow: 'hidden'
              }}>
                {/* ONDERSTE LAAG: De Trein (Z-INDEX 1) */}
                <canvas
                  ref={backgroundCanvasRef}
                  width={canvasWidth}
                  height={canvasHeight}
                  style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
                />
                
                {/* BOVENSTE LAAG: De Tekening (Z-INDEX 2) */}
                <canvas
                  ref={canvasRef}
                  width={canvasWidth}
                  height={canvasHeight}
                  onMouseDown={startDrawing}
                  onMouseUp={stopDrawing}
                  onMouseMove={draw}
                  onMouseLeave={stopDrawing}
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    zIndex: 2, 
                    cursor: 'crosshair',
                    background: 'transparent' 
                  }}
                />
              </div>

              <div className="color-picker">
                <div className="color-group">
                  <p>Onderdeel kleur:</p>
                  <div className="presets">
                    {["#F6653A","#3A1509","#A4E1FF"].map(color => (
                      <div
                        key={color}
                        className={`color-circle ${partColor===color ? 'selected':''}`}
                        onClick={() => setPartColor(color)}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <label
                      className={`color-circle rainbow-picker ${
                        !["#F6653A","#3A1509","#A4E1FF"].includes(partColor) ? "selected" : ""
                      }`}
                    >
                      <input
                        type="color"
                        value={partColor}
                        onChange={(e) => setPartColor(e.target.value)}
                      />
                    </label>
                  </div>
                </div>

                <div className="color-group">
                  <p>Penseel kleur:</p>
                  <div className="presets">
                    {["#000000","#FF0000","#00FF00","#0000FF", "#97067c", "#d89f00"].map(color => (
                      <div
                        key={color}
                        className={`color-circle ${drawColor===color ? 'selected':''}`}
                        onClick={() => setDrawColor(color)}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* GEREEDSCHAPPEN (Brush/Eraser) */}
            <div className="tool-picker" style={{ marginBottom: '15px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                className={`tool-btn ${tool === 'brush' ? 'active' : ''}`}
                onClick={() => setTool('brush')}
                style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: tool === 'brush' ? '#333' : '#eee', color: tool === 'brush' ? '#fff' : '#333', cursor: 'pointer' }}
              >
                🖌️ Penseel
              </button>
              <button 
                className={`tool-btn ${tool === 'eraser' ? 'active' : ''}`}
                onClick={() => setTool('eraser')}
                style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: tool === 'eraser' ? '#333' : '#eee', color: tool === 'eraser' ? '#fff' : '#333', cursor: 'pointer' }}
              >
                🧽 Gum
              </button>
              <button 
                onClick={() => {
                  const ctx = canvasRef.current.getContext("2d");
                  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                }}
                style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: '#fee', color: '#c00', cursor: 'pointer' }}
              >
                🗑️ Wis alles
              </button>
            </div>

            <div className="button-group">
              <button className="submit-btn" onClick={handleSubmit}>
                Verstuur naar scherm
              </button>
              <button className="reset-btn" onClick={() => setSelectedPart(null)}>
                Ander model kiezen
              </button>
            </div>
          </div>
        )}

        {submitted && drawingData && (
          <HyperloopResult 
            drawingData={drawingData}
            selectedPart={selectedPart}
            onReset={onReset}
          />
        )}
      </div>
    </div>
  );
}