import { useState, useRef, useEffect } from "react";

export default function HyperloopDesigner({ username, onReset }) {
  const [selectedPart, setSelectedPart] = useState(null);
  const [partColor, setPartColor] = useState("#F6653A");
  const [drawColor, setDrawColor] = useState("#000000");
  const [drawingData, setDrawingData] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const prevPos = useRef(null);

  const parts = [
  {
    id: 1,
    name: "Car",
    type: "svg",
    svgString: `
      <svg fill="__COLOR__" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
        width="800px" height="800px" viewBox="0 0 99.382 99.382">
        <g>
          <g>
            <path d="M17.001,49.693c-4.12,0-7.46,3.338-7.46,7.459c0,0.319,0.026,0.631,0.066,0.938c0.462,3.677,3.593,6.521,7.394,6.521
              c3.906,0,7.105-3.002,7.429-6.823c0.019-0.211,0.032-0.422,0.032-0.638C24.463,53.031,21.123,49.693,17.001,49.693z"/>
            <path d="M78.611,49.758c-4.103,0-7.428,3.324-7.428,7.428c0,0.317,0.025,0.627,0.064,0.934c0.46,3.66,3.578,6.494,7.363,6.494
              c3.889,0,7.074-2.989,7.396-6.794c0.019-0.21,0.032-0.42,0.032-0.634C86.04,53.082,82.715,49.758,78.611,49.758z"/>
            <path d="M99.352,52.001c-0.026-0.983-0.331-1.941-0.882-2.759l-0.402-0.6l-1.757-4.635c-0.331-0.875-1.139-1.484-2.07-1.562
              c-1.728-0.146-4.663-0.368-7.465-0.471c-9.794-5.201-27.904-10.43-43.262-4.731c-3.151,1.169-12.154,5.744-12.154,5.744
              s-14.62-0.37-25.047,3.349c-4.108,1.465-6.699,5.543-6.266,9.884c0.087,0.869,0.215,1.642,0.341,2.266
              c0.199,0.987,1.014,1.731,2.015,1.842l6.487,0.711c-0.408-0.852-0.695-1.773-0.818-2.755c-0.052-0.401-0.078-0.772-0.078-1.132
              c0-4.967,4.041-9.008,9.008-9.008c4.968,0,9.01,4.042,9.01,9.008c0,0.26-0.017,0.514-0.038,0.768
              c-0.095,1.115-0.399,2.172-0.868,3.135h45.045l0.365-0.021c-0.4-0.842-0.683-1.753-0.804-2.72
              c-0.052-0.403-0.077-0.773-0.077-1.127c0-4.95,4.026-8.978,8.977-8.978s8.978,4.026,8.978,8.978c0,0.259-0.017,0.511-0.038,0.764
              c-0.062,0.734-0.223,1.438-0.453,2.11L88.112,60l6.979-0.923c1.214-0.161,2.285-0.876,2.898-1.936l0.695-1.199
              c0.479-0.83,0.721-1.777,0.695-2.735L99.352,52.001z"/>
          </g>
        </g>
      </svg>
    `
  },
  {
    id: 2,
    name: "Train",
    type: "svg",
    svgString: `...` // vul hier de volledige Train SVG in
  }
];

  const startDrawing = () => { isDrawing.current = true; };
  const stopDrawing = () => { isDrawing.current = false; prevPos.current = null; };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!prevPos.current) prevPos.current = { x, y };

    ctx.strokeStyle = drawColor;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(prevPos.current.x, prevPos.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    prevPos.current = { x, y };
  };

  useEffect(() => {
    if (!selectedPart || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const coloredSvg = selectedPart.svgString.replace(/__COLOR__/g, partColor);
    const img = new Image();
    img.onload = () => {
      const padding = 20;
      const canvasWidth = canvas.width - 2 * padding;
      const canvasHeight = canvas.height - 2 * padding;
      const aspectRatio = img.width / img.height;

      let drawWidth = canvasWidth;
      let drawHeight = canvasHeight;
      if (canvasWidth / canvasHeight > aspectRatio) {
        drawWidth = canvasHeight * aspectRatio;
      } else {
        drawHeight = canvasWidth / aspectRatio;
      }

      const offsetX = (canvas.width - drawWidth) / 2;
      const offsetY = (canvas.height - drawHeight) / 2;

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };
    img.src = `data:image/svg+xml;base64,${btoa(coloredSvg)}`;
  }, [selectedPart, partColor]);

  const handleSubmit = () => {
    if (canvasRef.current) {
      setDrawingData(canvasRef.current.toDataURL());
      setSubmitted(true);
    }
  };

  return (
    <div className="container">
  <div className="designer-header">
    <h2>Hallo {username}, ontwerp je Hyperloop!</h2>
    <button onClick={onReset}>Reset naam</button>
  </div>

  {!selectedPart && !submitted && (
    <div className="part-selection">
      <h3>Kies een Hyperloop onderdeel</h3>
      <div className="part-selection-items">
        {parts.map(part => (
          <div key={part.id} onClick={() => setSelectedPart(part)} style={{ cursor: "pointer" }}>
            <img src={`data:image/svg+xml;base64,${btoa(part.svgString.replace(/__COLOR__/g,"gray"))}`} alt={part.name} />
            <p>{part.name}</p>
          </div>
        ))}
      </div>
    </div>
  )}

  {selectedPart && !submitted && (
    <>
      <div className="color-picker">
        <div className="color-group">
          <p>Onderdeel kleur:</p>
          {["#F6653A","#3A1509","#A4E1FF"].map(color => (
            <div key={color} className={`color-circle ${partColor===color ? 'selected':''}`} onClick={() => setPartColor(color)} style={{ backgroundColor: color }}/>
          ))}
        </div>
        <div className="color-group">
          <p>Penseel kleur:</p>
          {["#000000","#FF0000","#00FF00","#0000FF"].map(color => (
            <div key={color} className={`color-circle ${drawColor===color ? 'selected':''}`} onClick={() => setDrawColor(color)} style={{ backgroundColor: color }}/>
          ))}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={Math.min(window.innerWidth * 0.8, 600)}
        height={Math.min(window.innerHeight * 0.6, 400)}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        onMouseLeave={stopDrawing}
      />

      <button className="submit-btn" onClick={handleSubmit}>Verstuur naar scherm</button>
    </>
  )}

  {submitted && drawingData && (
    <div className="result">
      <h3>Jouw Hyperloop ontwerp</h3>
      <img src={drawingData} alt="Hyperloop ontwerp" />
    </div>
  )}
</div>
  );
}