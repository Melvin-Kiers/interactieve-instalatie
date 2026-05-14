// import { useState, useRef, useEffect } from "react";
// import HyperloopResult from "./HyperloopResult";
// import "../css/Designer.css";

// export default function HyperloopDesigner({ username, onReset }) {
//   const [selectedPart, setSelectedPart] = useState(null);
//   const [partColor, setPartColor] = useState("#F6653A");
//   const [drawColor, setDrawColor] = useState("#000000");
//   const [drawingData, setDrawingData] = useState(null);
//   const [submitted, setSubmitted] = useState(false);

//   // Refs voor de twee lagen
//   const backgroundCanvasRef = useRef(null); // Voor de Hyperloop (SVG)
//   const canvasRef = useRef(null);           // Voor de tekening van de gebruiker
  
//   const isDrawing = useRef(false);
//   const prevPos = useRef(null);

//   // Vaste afmetingen voor stabiliteit
//   const canvasWidth = 1200;
//   const canvasHeight = 250;

//   const [tool, setTool] = useState("brush"); // "brush" | "eraser"
//   const [pattern, setPattern] = useState("none"); // "none" | "dots" | "stripes"

//   const parts = [
//     {
//       id: 1,
//       name: "Car",
//       discription: "Gaat met zo'n 700km/u door een vacuum buis met zijn scherpe neus die naar beneden richt",
//       svgString: `<svg width="1199" height="174" viewBox="0 0 1199 174" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M844 0H46.9447C36.376 0 26.1998 4.00451 18.4655 11.2071C12.6117 16.6585 8.44542 23.6753 6.46151 31.4244L5.51551 35.1195C1.97857 48.9346 3.96646 63.5844 11.057 75.9574L16.3269 85.1536C22.0433 95.1287 29.8197 103.771 39.1382 110.505L100.779 155.051C117.825 167.369 138.32 174 159.351 174H1181.16C1185.51 174 1189.65 172.125 1192.51 168.855C1196.46 164.362 1197.38 157.966 1194.87 152.54L1194.75 152.274C1193.29 149.131 1190.83 146.562 1187.75 144.977L1044.5 71.2046L938.614 12.5311C923.782 4.31215 907.103 0 890.146 0H844Z" fill="__COLOR__"/><path d="M56 122.5L938 127L943.162 126.362C968.431 123.239 991.557 110.594 1007.82 91.0073L1031.5 62.5L1042.5 69.5L1017.5 143.5H937L82.5 141L56 122.5Z" fill="#FCA422"/><path d="M58 124.5L940 129L945.162 128.362C970.431 125.239 993.557 112.594 1009.82 93.0073L1033.5 64.5L1044.5 71.5L1019.5 145.5H939L84.5 143L58 124.5Z" fill="white"/><path d="M1194.87 152.54L1194.75 152.282C1193.29 149.134 1190.82 146.563 1187.74 144.98L1044.5 71.5L1020.74 104.444C1002.38 129.911 972.897 145 941.5 145L539 143H85.5L100.381 154.116C117.662 167.025 138.655 174 160.226 174H1181.16C1185.51 174 1189.65 172.125 1192.51 168.855C1196.46 164.362 1197.38 157.966 1194.87 152.54Z" fill="black"/><rect x="220" y="36.5" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><rect x="314" y="36.5" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><rect x="615" y="36.5" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><rect x="710" y="36.5" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><rect x="804" y="36.5" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><path d="M470 60.5C478.837 60.5 486 67.6634 486 76.5V129.5H454V76.5C454 67.6634 461.163 60.5 470 60.5Z" fill="white" stroke="white" stroke-width="5"/></svg>`
//     },
//     {
//       id: 2,
//       name: "Train",
//       discription: "Gaat met zo'n 700km/u door een vacuum buis met zijn scherpe neus die naar het midden richt",
//       svgString: `<svg width="1188" height="175" viewBox="0 0 1188 175" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M844 0H46.9447C36.376 0 26.1998 4.00451 18.4655 11.2071C12.6117 16.6585 8.44542 23.6754 6.4615 31.4244L5.51551 35.1195C1.97857 48.9346 3.96646 63.5844 11.057 75.9574L16.3269 85.1536C22.0433 95.1287 29.8197 103.771 39.1382 110.505L100.779 155.051C117.825 167.369 138.32 174 159.351 174H1050.7C1072.62 174 1093.94 166.794 1111.37 153.49L1180.41 100.795C1184.37 97.7736 1184.63 91.9091 1180.96 88.5419L1113.18 26.329C1094.74 9.39557 1070.61 0.000112005 1045.56 9.38629e-05L916 0H844Z" fill="__COLOR__"/><path d="M57 122.5L939 127L1039.24 125.886C1061.75 125.636 1083.52 117.798 1101.02 103.64L1152.5 62.0001L1157.5 68.5001L1108 118.5L1018.5 143.5H938L83.5 141L57 122.5Z" fill="#FCA422"/><path d="M59 124.5L941 129H1038.08C1060.08 129 1081.46 121.749 1098.92 108.368L1155.5 65.0001L1166 75.0001L1104.5 143.5L940 145.5L85 143.5L59 124.5Z" fill="white"/><rect x="220" y="36.5001" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><rect x="314" y="36.5001" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><rect x="615" y="36.5001" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><rect x="710" y="36.5001" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><rect x="804" y="36.5001" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><path d="M470 60.5001C478.837 60.5001 486 67.6636 486 76.5001V129.5H454V76.5001C454 67.6636 461.163 60.5001 470 60.5001Z" fill="white" stroke="white" stroke-width="5"/><path d="M1182.76 90.2395L1166 75.0001L1128.5 108.5L1124.24 112.953C1105.84 132.186 1080.54 143.292 1053.93 143.811L993 145H943L540.5 143L85 143.5L102.428 155.92C119.385 168.005 139.692 174.494 160.515 174.483L1053.29 174.018C1075.77 174.007 1097.59 166.421 1115.23 152.486L1182.45 99.3872C1185.35 97.0901 1185.51 92.7323 1182.76 90.2395Z" fill="black"/><circle cx="1038" cy="72.0001" r="32" fill="black"/></svg>`
//     }
//   ];

//   // EFFECT: Teken de SVG opnieuw als de kleur verandert
//   useEffect(() => {
//     if (!selectedPart || !backgroundCanvasRef.current) return;

//     const bgCanvas = backgroundCanvasRef.current;
//     const bgCtx = bgCanvas.getContext("2d");
    
//     const coloredSvg = selectedPart.svgString.replace(/__COLOR__/g, partColor);
//     const img = new Image();
    
//     img.onload = () => {
//       // Maak alleen de achtergrondlaag schoon
//       bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      
//       const padding = 20;
//       const aspectRatio = img.width / img.height;
//       let drawWidth = bgCanvas.width - 2 * padding;
//       let drawHeight = bgCanvas.height - 2 * padding;

//       if (drawWidth / drawHeight > aspectRatio) {
//         drawWidth = drawHeight * aspectRatio;
//       } else {
//         drawHeight = drawWidth / aspectRatio;
//       }

//       const offsetX = (bgCanvas.width - drawWidth) / 2;
//       const offsetY = (bgCanvas.height - drawHeight) / 2;

//       bgCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
//     };
//     // Gebruik unescape(encodeURIComponent()) om SVG karakters veilig te verwerken
//     img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(coloredSvg)))}`;
//   }, [selectedPart, partColor]);

//   // Teken functies
//   const startDrawing = (e) => {
//     isDrawing.current = true;
//     draw(e);
//   };

//   const stopDrawing = () => {
//     isDrawing.current = false;
//     prevPos.current = null;
//   };

// const draw = (e) => {
//   if (!isDrawing.current) return;
//   const canvas = canvasRef.current;
//   const ctx = canvas.getContext("2d");
//   const rect = canvas.getBoundingClientRect();
//   const x = e.clientX - rect.left;
//   const y = e.clientY - rect.top;

//   // --- GUM LOGICA ---
//   if (tool === "eraser") {
//     ctx.globalCompositeOperation = "destination-out"; // Dit maakt pixels transparant
//     ctx.lineWidth = 20; // Gum mag vaak iets dikker zijn
//   } else {
//     ctx.globalCompositeOperation = "source-over"; // Normaal tekenen
//     ctx.strokeStyle = drawColor;
//     ctx.lineWidth = 4;
//   }
//   // ------------------

//   ctx.lineCap = "round";
//   ctx.beginPath();
//   if (prevPos.current) {
//     ctx.moveTo(prevPos.current.x, prevPos.current.y);
//   } else {
//     ctx.moveTo(x, y);
//   }
//   ctx.lineTo(x, y);
//   ctx.stroke();

//   prevPos.current = { x, y };
// };

//   const handleSubmit = () => {
//     // Voeg beide lagen samen voor het eindresultaat
//     const finalCanvas = document.createElement("canvas");
//     finalCanvas.width = canvasWidth;
//     finalCanvas.height = canvasHeight;
//     const finalCtx = finalCanvas.getContext("2d");

//     // Achtergrond (trein) eerst, dan de tekening
//     finalCtx.drawImage(backgroundCanvasRef.current, 0, 0);
//     finalCtx.drawImage(canvasRef.current, 0, 0);

//     const data = finalCanvas.toDataURL("image/png");
//     setDrawingData(data);
//     localStorage.setItem("hyperloopImage", data);
//     setSubmitted(true);
//   };

//   return (
//     <div className=" hyperloop-choice-bg">
//       <div className="container hyperloop-choice">
//         <div className="designer-header">
//           <h1>Ontwerp jouw Hyperloop, {username}!</h1>
//         </div>

//         {!selectedPart && !submitted && (
//           <div className="part-selection">
//             <div className="part-selection-items">
//               {parts.map(part => (
//                 <div 
//                   key={part.id} 
//                   className="part-item"
//                   onClick={() => setSelectedPart(part)} 
//                   style={{ cursor: 'pointer' }}
//                 >
//                   <img 
//                     src={`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(part.svgString.replace(/__COLOR__/g,"#F6653A"))))}`} 
//                     alt={part.name}
//                   />
//                   <div className="info-hyperloop">
//                     <h2>{part.name}</h2>
//                     <p>{part.discription}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <button onClick={onReset} className="reset-btn">Terug naar start</button>
//           </div>
//         )}

//         {selectedPart && !submitted && (
//           <div className="designer-ui">
//             <div className="glass-card">
              
//               {/* DE CANVAS CONTAINER MET VASTE HOOGTE */}
//               <div className="preview-container" style={{ 
//                   position: 'relative', 
//                   width: `${canvasWidth}px`, 
//                   height: `${canvasHeight}px`,
//                   margin: '20px auto',
//                   backgroundColor: '#ffffff',
//                   borderRadius: '12px',
//                   boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
//                   overflow: 'hidden'
//               }}>
//                 {/* ONDERSTE LAAG: De Trein (Z-INDEX 1) */}
//                 <canvas
//                   ref={backgroundCanvasRef}
//                   width={canvasWidth}
//                   height={canvasHeight}
//                   style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
//                 />
                
//                 {/* BOVENSTE LAAG: De Tekening (Z-INDEX 2) */}
//                 <canvas
//                   ref={canvasRef}
//                   width={canvasWidth}
//                   height={canvasHeight}
//                   onMouseDown={startDrawing}
//                   onMouseUp={stopDrawing}
//                   onMouseMove={draw}
//                   onMouseLeave={stopDrawing}
//                   style={{ 
//                     position: 'absolute', 
//                     top: 0, 
//                     left: 0, 
//                     zIndex: 2, 
//                     cursor: 'crosshair',
//                     background: 'transparent' 
//                   }}
//                 />
//               </div>

//               <div className="color-picker">
//                 <div className="color-group">
//                   <p>Onderdeel kleur:</p>
//                   <div className="presets">
//                     {["#F6653A","#3A1509","#A4E1FF"].map(color => (
//                       <div
//                         key={color}
//                         className={`color-circle ${partColor===color ? 'selected':''}`}
//                         onClick={() => setPartColor(color)}
//                         style={{ backgroundColor: color }}
//                       />
//                     ))}
//                     <label
//                       className={`color-circle rainbow-picker ${
//                         !["#F6653A","#3A1509","#A4E1FF"].includes(partColor) ? "selected" : ""
//                       }`}
//                     >
//                       <input
//                         type="color"
//                         value={partColor}
//                         onChange={(e) => setPartColor(e.target.value)}
//                       />
//                     </label>
//                   </div>
//                 </div>

//                 <div className="color-group">
//                   <p>Penseel kleur:</p>
//                   <div className="presets">
//                     {["#000000","#FF0000","#00FF00","#0000FF", "#97067c", "#d89f00"].map(color => (
//                       <div
//                         key={color}
//                         className={`color-circle ${drawColor===color ? 'selected':''}`}
//                         onClick={() => setDrawColor(color)}
//                         style={{ backgroundColor: color }}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* GEREEDSCHAPPEN (Brush/Eraser) */}
//             <div className="tool-picker" style={{ marginBottom: '15px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
//               <button 
//                 className={`tool-btn ${tool === 'brush' ? 'active' : ''}`}
//                 onClick={() => setTool('brush')}
//                 style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: tool === 'brush' ? '#333' : '#eee', color: tool === 'brush' ? '#fff' : '#333', cursor: 'pointer' }}
//               >
//                 🖌️ Penseel
//               </button>
//               <button 
//                 className={`tool-btn ${tool === 'eraser' ? 'active' : ''}`}
//                 onClick={() => setTool('eraser')}
//                 style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: tool === 'eraser' ? '#333' : '#eee', color: tool === 'eraser' ? '#fff' : '#333', cursor: 'pointer' }}
//               >
//                 🧽 Gum
//               </button>
//               <button 
//                 onClick={() => {
//                   const ctx = canvasRef.current.getContext("2d");
//                   ctx.clearRect(0, 0, canvasWidth, canvasHeight);
//                 }}
//                 style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: '#fee', color: '#c00', cursor: 'pointer' }}
//               >
//                 🗑️ Wis alles
//               </button>
//             </div>

//             <div className="button-group">
//               <button className="submit-btn" onClick={handleSubmit}>
//                 Verstuur naar scherm
//               </button>
//               <button className="reset-btn" onClick={() => setSelectedPart(null)}>
//                 Ander model kiezen
//               </button>
//             </div>
//           </div>
//         )}

//         {submitted && drawingData && (
//           <HyperloopResult 
//             drawingData={drawingData}
//             selectedPart={selectedPart}
//             onReset={onReset}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";



// // ─── inline styles (no external CSS needed) ──────────────────────────────────
// const S = {
//   root: {
//     minHeight: "100vh",
//     background: "radial-gradient(ellipse at 20% 20%, #1a1a2e 0%, #0d0d0d 60%)",
//     color: "#fff",
//     fontFamily: "'Segoe UI', system-ui, sans-serif",
//     display: "flex",
//     flexDirection: "column",
//   },
//   // ── top bar
//   topBar: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "18px 28px",
//     borderBottom: "1px solid rgba(255,255,255,0.07)",
//   },
//   logo: {
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     fontWeight: 700,
//     fontSize: 18,
//     letterSpacing: 2,
//     textTransform: "uppercase",
//   },
//   logoIcon: {
//     width: 32,
//     height: 32,
//   },
//   backBtn: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     background: "rgba(255,255,255,0.06)",
//     border: "1px solid rgba(255,255,255,0.12)",
//     borderRadius: 10,
//     color: "#fff",
//     padding: "8px 18px",
//     cursor: "pointer",
//     fontSize: 14,
//     transition: "background 0.2s",
//   },
//   modeBadge: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     background: "rgba(255,255,255,0.06)",
//     border: "1px solid rgba(255,255,255,0.12)",
//     borderRadius: 10,
//     padding: "8px 16px",
//     fontSize: 14,
//   },
//   dot: {
//     width: 8,
//     height: 8,
//     borderRadius: "50%",
//     background: "#FF6B35",
//     boxShadow: "0 0 8px #FF6B35",
//   },
//   // ── body
//   body: {
//     display: "flex",
//     flex: 1,
//     gap: 0,
//   },
//   // ── headings
//   heading: {
//     textAlign: "center",
//     padding: "28px 0 4px",
//     fontSize: 32,
//     fontWeight: 700,
//     letterSpacing: -0.5,
//   },
//   subheading: {
//     textAlign: "center",
//     color: "rgba(255,255,255,0.45)",
//     fontSize: 14,
//     marginBottom: 0,
//   },
//   // ── left panel
//   leftPanel: {
//     width: 300,
//     minWidth: 280,
//     background: "rgba(255,255,255,0.03)",
//     borderRight: "1px solid rgba(255,255,255,0.07)",
//     display: "flex",
//     flexDirection: "column",
//     padding: "24px 20px",
//     gap: 12,
//   },
//   panelLabel: {
//     fontSize: 13,
//     fontWeight: 600,
//     color: "rgba(255,255,255,0.5)",
//     textTransform: "uppercase",
//     letterSpacing: 1,
//     marginBottom: 8,
//   },
//   partCard: (selected) => ({
//     background: selected
//       ? "rgba(255,107,53,0.12)"
//       : "rgba(255,255,255,0.04)",
//     border: `1.5px solid ${selected ? "#FF6B35" : "rgba(255,255,255,0.09)"}`,
//     borderRadius: 14,
//     padding: "14px 16px",
//     cursor: "pointer",
//     transition: "all 0.2s",
//     position: "relative",
//   }),
//   partImg: {
//     width: "100%",
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   partTitle: (selected) => ({
//     color: selected ? "#FF6B35" : "#fff",
//     fontWeight: 600,
//     fontSize: 15,
//     marginBottom: 4,
//   }),
//   partDesc: {
//     color: "rgba(255,255,255,0.45)",
//     fontSize: 12,
//     lineHeight: 1.5,
//   },
//   radioCircle: (selected) => ({
//     position: "absolute",
//     top: 12,
//     right: 12,
//     width: 16,
//     height: 16,
//     borderRadius: "50%",
//     border: `2px solid ${selected ? "#FF6B35" : "rgba(255,255,255,0.3)"}`,
//     background: selected ? "#FF6B35" : "transparent",
//     boxShadow: selected ? "0 0 8px #FF6B35" : "none",
//   }),
//   leftBottom: {
//     marginTop: "auto",
//   },
//   leftBackBtn: {
//     width: "100%",
//     padding: "12px",
//     background: "rgba(255,255,255,0.05)",
//     border: "1px solid rgba(255,255,255,0.1)",
//     borderRadius: 12,
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: 14,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//   },
//   // ── center panel
//   center: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     padding: "24px 28px 24px",
//   },
//   centerLabel: {
//     alignSelf: "flex-start",
//     fontSize: 13,
//     fontWeight: 600,
//     color: "rgba(255,255,255,0.5)",
//     textTransform: "uppercase",
//     letterSpacing: 1,
//     marginBottom: 16,
//   },
//   canvasWrapper: {
//     position: "relative",
//     width: "100%",
//     flex: 1,
//     borderRadius: 16,
//     overflow: "hidden",
//     border: "1px solid rgba(255,255,255,0.09)",
//     background: "radial-gradient(ellipse at center, #1e0e08 0%, #0d0d0d 70%)",
//     boxShadow: "0 0 80px rgba(255,107,53,0.08) inset",
//     minHeight: 340,
//   },
//   // ── bottom toolbar
//   toolbar: {
//     display: "flex",
//     gap: 10,
//     marginTop: 18,
//     alignSelf: "center",
//   },
//   toolBtn: (active) => ({
//     display: "flex",
//     alignItems: "center",
//     gap: 7,
//     padding: "10px 22px",
//     borderRadius: 12,
//     border: `1.5px solid ${active ? "#FF6B35" : "rgba(255,255,255,0.12)"}`,
//     background: active ? "rgba(255,107,53,0.18)" : "rgba(255,255,255,0.05)",
//     color: active ? "#FF6B35" : "rgba(255,255,255,0.7)",
//     cursor: "pointer",
//     fontSize: 14,
//     fontWeight: active ? 600 : 400,
//     transition: "all 0.2s",
//   }),
//   iconBtn: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     border: "1.5px solid rgba(255,255,255,0.12)",
//     background: "rgba(255,255,255,0.05)",
//     color: "rgba(255,255,255,0.7)",
//     cursor: "pointer",
//     fontSize: 18,
//     transition: "all 0.2s",
//   },
//   deleteBtn: {
//     display: "flex",
//     alignItems: "center",
//     gap: 7,
//     padding: "10px 22px",
//     borderRadius: 12,
//     border: "1.5px solid rgba(255,255,255,0.12)",
//     background: "rgba(255,255,255,0.05)",
//     color: "rgba(255,255,255,0.7)",
//     cursor: "pointer",
//     fontSize: 14,
//     transition: "all 0.2s",
//   },
//   submitRow: {
//     marginTop: 14,
//     display: "flex",
//     gap: 12,
//     alignSelf: "center",
//   },
//   submitBtn: {
//     padding: "12px 30px",
//     borderRadius: 12,
//     border: "none",
//     background: "linear-gradient(135deg, #FF6B35, #e04e1e)",
//     color: "#fff",
//     fontWeight: 700,
//     fontSize: 15,
//     cursor: "pointer",
//     boxShadow: "0 8px 24px rgba(255,107,53,0.35)",
//     transition: "transform 0.2s, box-shadow 0.2s",
//   },
//   // ── right panel
//   rightPanel: {
//     width: 220,
//     minWidth: 200,
//     background: "rgba(255,255,255,0.03)",
//     borderLeft: "1px solid rgba(255,255,255,0.07)",
//     padding: "24px 20px",
//     display: "flex",
//     flexDirection: "column",
//     gap: 24,
//   },
//   colorGroupLabel: {
//     fontSize: 13,
//     color: "rgba(255,255,255,0.55)",
//     marginBottom: 14,
//     fontWeight: 500,
//   },
//   colorGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(3, 1fr)",
//     gap: 10,
//   },
//   colorDot: (color, selected) => ({
//     width: 40,
//     height: 40,
//     borderRadius: "50%",
//     background: color,
//     border: selected ? "2.5px solid #fff" : "2.5px solid transparent",
//     boxShadow: selected ? `0 0 12px ${color}` : "none",
//     cursor: "pointer",
//     transition: "all 0.2s",
//   }),
//   rainbowDot: (selected) => ({
//     width: 40,
//     height: 40,
//     borderRadius: "50%",
//     background: "conic-gradient(red, orange, yellow, green, cyan, blue, violet, red)",
//     border: selected ? "2.5px solid #fff" : "2.5px solid rgba(255,255,255,0.3)",
//     cursor: "pointer",
//     position: "relative",
//     transition: "all 0.2s",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   }),
//   rainbowInput: {
//     position: "absolute",
//     inset: 0,
//     opacity: 0,
//     cursor: "pointer",
//     borderRadius: "50%",
//     width: "100%",
//     height: "100%",
//   },
// };

// // ─── SVG data ─────────────────────────────────────────────────────────────────
// const PARTS = [
//   {
//     id: 1,
//     name: "Car",
//     discription: "Gaat met zo'n 700km/u door een vacuum buis met zijn scherpe neus die naar beneden richt",
//     svgString: `<svg width="1199" height="174" viewBox="0 0 1199 174" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M844 0H46.9447C36.376 0 26.1998 4.00451 18.4655 11.2071C12.6117 16.6585 8.44542 23.6753 6.46151 31.4244L5.51551 35.1195C1.97857 48.9346 3.96646 63.5844 11.057 75.9574L16.3269 85.1536C22.0433 95.1287 29.8197 103.771 39.1382 110.505L100.779 155.051C117.825 167.369 138.32 174 159.351 174H1181.16C1185.51 174 1189.65 172.125 1192.51 168.855C1196.46 164.362 1197.38 157.966 1194.87 152.54L1194.75 152.274C1193.29 149.131 1190.83 146.562 1187.75 144.977L1044.5 71.2046L938.614 12.5311C923.782 4.31215 907.103 0 890.146 0H844Z" fill="__COLOR__"/><path d="M56 122.5L938 127L943.162 126.362C968.431 123.239 991.557 110.594 1007.82 91.0073L1031.5 62.5L1042.5 69.5L1017.5 143.5H937L82.5 141L56 122.5Z" fill="#FCA422"/><path d="M58 124.5L940 129L945.162 128.362C970.431 125.239 993.557 112.594 1009.82 93.0073L1033.5 64.5L1044.5 71.5L1019.5 145.5H939L84.5 143L58 124.5Z" fill="white"/><path d="M1194.87 152.54L1194.75 152.282C1193.29 149.134 1190.82 146.563 1187.74 144.98L1044.5 71.5L1020.74 104.444C1002.38 129.911 972.897 145 941.5 145L539 143H85.5L100.381 154.116C117.662 167.025 138.655 174 160.226 174H1181.16C1185.51 174 1189.65 172.125 1192.51 168.855C1196.46 164.362 1197.38 157.966 1194.87 152.54Z" fill="black"/><rect x="220" y="36.5" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><rect x="314" y="36.5" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><rect x="615" y="36.5" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><rect x="710" y="36.5" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><rect x="804" y="36.5" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><path d="M470 60.5C478.837 60.5 486 67.6634 486 76.5V129.5H454V76.5C454 67.6634 461.163 60.5 470 60.5Z" fill="white" stroke="white" stroke-width="5"/></svg>`
//   },
//   {
//     id: 2,
//     name: "Train",
//     discription: "Gaat met zo'n 700km/u door een vacuum buis met zijn scherpe neus die naar het midden richt",
//     svgString: `<svg width="1188" height="175" viewBox="0 0 1188 175" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M844 0H46.9447C36.376 0 26.1998 4.00451 18.4655 11.2071C12.6117 16.6585 8.44542 23.6754 6.4615 31.4244L5.51551 35.1195C1.97857 48.9346 3.96646 63.5844 11.057 75.9574L16.3269 85.1536C22.0433 95.1287 29.8197 103.771 39.1382 110.505L100.779 155.051C117.825 167.369 138.32 174 159.351 174H1050.7C1072.62 174 1093.94 166.794 1111.37 153.49L1180.41 100.795C1184.37 97.7736 1184.63 91.9091 1180.96 88.5419L1113.18 26.329C1094.74 9.39557 1070.61 0.000112005 1045.56 9.38629e-05L916 0H844Z" fill="__COLOR__"/><path d="M57 122.5L939 127L1039.24 125.886C1061.75 125.636 1083.52 117.798 1101.02 103.64L1152.5 62.0001L1157.5 68.5001L1108 118.5L1018.5 143.5H938L83.5 141L57 122.5Z" fill="#FCA422"/><path d="M59 124.5L941 129H1038.08C1060.08 129 1081.46 121.749 1098.92 108.368L1155.5 65.0001L1166 75.0001L1104.5 143.5L940 145.5L85 143.5L59 124.5Z" fill="white"/><rect x="220" y="36.5001" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><rect x="314" y="36.5001" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><rect x="615" y="36.5001" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><rect x="710" y="36.5001" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><rect x="804" y="36.5001" width="37" height="71" rx="10.5" stroke="white" stroke-width="3"/><path d="M470 60.5001C478.837 60.5001 486 67.6636 486 76.5001V129.5H454V76.5001C454 67.6636 461.163 60.5001 470 60.5001Z" fill="white" stroke="white" stroke-width="5"/><path d="M1182.76 90.2395L1166 75.0001L1128.5 108.5L1124.24 112.953C1105.84 132.186 1080.54 143.292 1053.93 143.811L993 145H943L540.5 143L85 143.5L102.428 155.92C119.385 168.005 139.692 174.494 160.515 174.483L1053.29 174.018C1075.77 174.007 1097.59 166.421 1115.23 152.486L1182.45 99.3872C1185.35 97.0901 1185.51 92.7323 1182.76 90.2395Z" fill="black"/><circle cx="1038" cy="72.0001" r="32" fill="black"/></svg>`
//   }
// ];

// const svgToDataUrl = (svg) =>
//   `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;

// const PART_COLORS = ["#FF6B35", "#3A1509", "#A4E1FF"];
// const BRUSH_COLORS = ["#000000", "#FF0000", "#00FF00", "#0000FF", "#97067c", "#d89f00"];

// // ─── Component ────────────────────────────────────────────────────────────────
// export default function HyperloopDesigner({ username = "Melvin", onReset }) {
//   const navigate = useNavigate();
//   const [selectedPart, setSelectedPart] = useState(PARTS[0]);
//   const [partColor, setPartColor] = useState("#FF6B35");
//   const [drawColor, setDrawColor] = useState("#000000");
//   const [tool, setTool] = useState("brush");
//   const [submitted, setSubmitted] = useState(false);
//   const [drawingData, setDrawingData] = useState(null);

//   const bgRef = useRef(null);
//   const drawRef = useRef(null);
//   const isDrawing = useRef(false);
//   const prevPos = useRef(null);
//   const historyRef = useRef([]); // undo stack
//   const redoRef = useRef([]);   // redo stack

//   const W = 900, H = 300;

//   // ── render SVG onto bg canvas
//   useEffect(() => {
//     if (!selectedPart || !bgRef.current) return;
//     const canvas = bgRef.current;
//     const ctx = canvas.getContext("2d");
//     const colored = selectedPart.svgString.replace(/__COLOR__/g, partColor);
//     const img = new Image();
//     img.onload = () => {
//       ctx.clearRect(0, 0, W, H);
//       const pad = 30;
//       const ar = img.width / img.height;
//       let dw = W - 2 * pad, dh = H - 2 * pad;
//       if (dw / dh > ar) dw = dh * ar; else dh = dw / ar;
//       const ox = (W - dw) / 2, oy = (H - dh) / 2;
//       ctx.drawImage(img, ox, oy, dw, dh);
//     };
//     img.src = svgToDataUrl(colored);
//   }, [selectedPart, partColor]);

//   // ── drawing helpers
//   const saveHistory = () => {
//     const snap = drawRef.current.toDataURL();
//     historyRef.current.push(snap);
//     redoRef.current = [];
//   };

//   const startDraw = (e) => {
//     saveHistory();
//     isDrawing.current = true;
//     draw(e);
//   };

//   const stopDraw = () => {
//     isDrawing.current = false;
//     prevPos.current = null;
//   };

//   const draw = (e) => {
//     if (!isDrawing.current) return;
//     const canvas = drawRef.current;
//     const ctx = canvas.getContext("2d");
//     const rect = canvas.getBoundingClientRect();
//     const scaleX = W / rect.width;
//     const scaleY = H / rect.height;
//     const x = (e.clientX - rect.left) * scaleX;
//     const y = (e.clientY - rect.top) * scaleY;

//     ctx.lineCap = "round";
//     ctx.lineJoin = "round";

//     if (tool === "eraser") {
//       ctx.globalCompositeOperation = "destination-out";
//       ctx.lineWidth = 24;
//     } else {
//       ctx.globalCompositeOperation = "source-over";
//       ctx.strokeStyle = drawColor;
//       ctx.lineWidth = 4;
//     }

//     ctx.beginPath();
//     if (prevPos.current) ctx.moveTo(prevPos.current.x, prevPos.current.y);
//     else ctx.moveTo(x, y);
//     ctx.lineTo(x, y);
//     ctx.stroke();
//     prevPos.current = { x, y };
//   };

//   const undo = () => {
//     if (!historyRef.current.length) return;
//     const snap = historyRef.current.pop();
//     const cur = drawRef.current.toDataURL();
//     redoRef.current.push(cur);
//     const ctx = drawRef.current.getContext("2d");
//     ctx.clearRect(0, 0, W, H);
//     const img = new Image();
//     img.onload = () => ctx.drawImage(img, 0, 0);
//     img.src = snap;
//   };

//   const redo = () => {
//     if (!redoRef.current.length) return;
//     const snap = redoRef.current.pop();
//     historyRef.current.push(drawRef.current.toDataURL());
//     const ctx = drawRef.current.getContext("2d");
//     ctx.clearRect(0, 0, W, H);
//     const img = new Image();
//     img.onload = () => ctx.drawImage(img, 0, 0);
//     img.src = snap;
//   };

//   const clearAll = () => {
//     saveHistory();
//     drawRef.current.getContext("2d").clearRect(0, 0, W, H);
//   };

//   const handleSubmit = () => {
//     const final = document.createElement("canvas");
//     final.width = W; final.height = H;
//     const ctx = final.getContext("2d");
//     ctx.drawImage(bgRef.current, 0, 0);
//     ctx.drawImage(drawRef.current, 0, 0);
//     const data = final.toDataURL("image/png");
//     setDrawingData(data);
//     setSubmitted(true);
//   };

//   // ── submitted view
//   if (submitted && drawingData) {
//     return (
//       <div style={S.root}>
//         <div style={{ textAlign: "center", padding: 60 }}>
//           <h2 style={{ color: "#FF6B35", marginBottom: 20 }}>Jouw ontwerp is verstuurd! 🚀</h2>
//           <img src={drawingData} alt="result" style={{ maxWidth: "80%", borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }} />
//           <br />
//           <button onClick={() => navigate("/games")}></button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={S.root}>
//       {/* ── top bar */}
//       <div style={S.topBar}>
//         <button style={S.backBtn} onClick={onReset}>
//           ← Terug naar start
//         </button>
//         <div style={S.logo}>
//           {/* infinity-ish icon */}
//           <svg style={S.logoIcon} viewBox="0 0 32 32" fill="none">
//             <path d="M8 16c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6" stroke="#FF6B35" strokeWidth="2.5" strokeLinecap="round"/>
//             <path d="M24 16c0 3.3-2.7 6-6 6" stroke="#FF6B35" strokeWidth="2.5" strokeLinecap="round"/>
//           </svg>
//           HYPERLOOP
//         </div>
//         <div style={S.modeBadge}>
//           <div style={S.dot} />
//           Ontwerpmodus &nbsp; ✏️
//         </div>
//       </div>

//       {/* ── page title */}
//       <h1 style={S.heading}>
//         Ontwerp jouw <span style={{ color: "#FF6B35" }}>Hyperloop</span>, {username}!
//       </h1>
//       <p style={S.subheading}>Kies een onderdeel, pas de kleur aan en teken jouw eigen ontwerp.</p>

//       {/* ── three-column body */}
//       <div style={{ ...S.body, marginTop: 20 }}>

//         {/* LEFT */}
//         <div style={S.leftPanel}>
//           <div style={S.panelLabel}>1. Kies een onderdeel</div>
//           {PARTS.map(part => {
//             const sel = selectedPart?.id === part.id;
//             return (
//               <div key={part.id} style={S.partCard(sel)} onClick={() => setSelectedPart(part)}>
//                 <div style={S.radioCircle(sel)} />
//                 <img
//                   src={svgToDataUrl(part.svgString.replace(/__COLOR__/g, "#FF6B35"))}
//                   alt={part.name}
//                   style={S.partImg}
//                 />
//                 <div style={S.partTitle(sel)}>{part.name}</div>
//                 <div style={S.partDesc}>{part.discription}</div>
//               </div>
//             );
//           })}
//           <div style={S.leftBottom}>
//             <button style={S.leftBackBtn} onClick={onReset}>← Terug naar start</button>
//           </div>
//         </div>

//         {/* CENTER */}
//         <div style={S.center}>
//           <div style={S.centerLabel}>2. Ontwerp jouw onderdeel</div>

//           <div style={S.canvasWrapper}>
//             {/* grid floor effect */}
//             <div style={{
//               position: "absolute", inset: 0, zIndex: 0,
//               backgroundImage: `
//                 linear-gradient(rgba(255,107,53,0.06) 1px, transparent 1px),
//                 linear-gradient(90deg, rgba(255,107,53,0.06) 1px, transparent 1px)
//               `,
//               backgroundSize: "40px 40px",
//               maskImage: "linear-gradient(to top, rgba(0,0,0,0.4), transparent 60%)",
//             }} />
//             {/* glow */}
//             <div style={{
//               position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
//               width: "60%", height: 80,
//               background: "radial-gradient(ellipse, rgba(255,107,53,0.25), transparent 70%)",
//               zIndex: 0,
//             }} />

//             <canvas ref={bgRef} width={W} height={H} style={{
//               position: "absolute", top: 0, left: 0, zIndex: 1,
//               width: "100%", height: "100%",
//             }} />
//             <canvas ref={drawRef} width={W} height={H}
//               onMouseDown={startDraw}
//               onMouseUp={stopDraw}
//               onMouseMove={draw}
//               onMouseLeave={stopDraw}
//               style={{
//                 position: "absolute", top: 0, left: 0, zIndex: 2,
//                 width: "100%", height: "100%",
//                 cursor: tool === "eraser" ? "cell" : "crosshair",
//                 background: "transparent",
//               }}
//             />
//           </div>

//           {/* toolbar */}
//           <div style={S.toolbar}>
//             <button style={S.toolBtn(tool === "brush")} onClick={() => setTool("brush")}>
//               ✏️ Pen
//             </button>
//             <button style={S.toolBtn(tool === "eraser")} onClick={() => setTool("eraser")}>
//               🧽 Wissen
//             </button>
//             <button style={S.iconBtn} onClick={undo} title="Ongedaan maken">↩</button>
//             <button style={S.iconBtn} onClick={redo} title="Opnieuw">↪</button>
//             <button style={S.deleteBtn} onClick={clearAll}>
//               🗑️ Alles wissen
//             </button>
//           </div>

//           <div style={S.submitRow}>
//             <button style={S.submitBtn} onClick={handleSubmit}>
//               Verstuur naar scherm →
//             </button>
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div style={S.rightPanel}>
//           <div>
//             <div style={S.colorGroupLabel}>Onderdeel kleur</div>
//             <div style={S.colorGrid}>
//               {PART_COLORS.map(c => (
//                 <div key={c}
//                   style={S.colorDot(c, partColor === c)}
//                   onClick={() => setPartColor(c)}
//                 />
//               ))}
//               {/* rainbow custom */}
//               <label style={S.rainbowDot(!PART_COLORS.includes(partColor))}>
//                 <span style={{ fontSize: 16, zIndex: 1 }}>✏️</span>
//                 <input type="color" value={partColor}
//                   onChange={e => setPartColor(e.target.value)}
//                   style={S.rainbowInput}
//                 />
//               </label>
//             </div>
//           </div>

//           <div>
//             <div style={S.colorGroupLabel}>Penseel kleur</div>
//             <div style={S.colorGrid}>
//               {BRUSH_COLORS.map(c => (
//                 <div key={c}
//                   style={S.colorDot(c, drawColor === c)}
//                   onClick={() => setDrawColor(c)}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ─── inline styles ──────────────────────────────────
const S = {
  root: {
    minHeight: "100vh",
    background: "radial-gradient(ellipse at 20% 20%, #1a1a2e 0%, #0d0d0d 60%)",
    color: "#fff",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 28px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontWeight: 700,
    fontSize: 18,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  logoIcon: {
    width: 32,
    height: 32,
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10,
    color: "#fff",
    padding: "8px 18px",
    cursor: "pointer",
    fontSize: 14,
    transition: "background 0.2s",
  },
  modeBadge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10,
    padding: "8px 16px",
    fontSize: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#FF6B35",
    boxShadow: "0 0 8px #FF6B35",
  },
  body: {
    display: "flex",
    flex: 1,
    gap: 0,
  },
  heading: {
    textAlign: "center",
    padding: "28px 0 4px",
    fontSize: 32,
    fontWeight: 700,
    letterSpacing: -0.5,
  },
  subheading: {
    textAlign: "center",
    color: "rgba(255,255,255,0.45)",
    fontSize: 14,
    marginBottom: 0,
  },
  leftPanel: {
    width: 400,
    minWidth: 280,
    background: "rgba(255,255,255,0.03)",
    borderRight: "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    flexDirection: "column",
    padding: "24px 20px",
    gap: 12,
  },
  panelLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "rgba(255,255,255,0.5)",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  partCard: (selected) => ({
    background: selected ? "rgba(255,107,53,0.12)" : "rgba(255,255,255,0.04)",
    border: `1.5px solid ${selected ? "#FF6B35" : "rgba(255,255,255,0.09)"}`,
    borderRadius: 14,
    padding: "14px 16px",
    cursor: "pointer",
    transition: "all 0.2s",
    position: "relative",
  }),
  partImg: {
    width: "100%",
    borderRadius: 8,
    marginBottom: 10,
  },
  partTitle: (selected) => ({
    color: selected ? "#FF6B35" : "#fff",
    fontWeight: 600,
    fontSize: 15,
    marginBottom: 4,
  }),
  partDesc: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
    lineHeight: 1.5,
  },
  radioCircle: (selected) => ({
    position: "absolute",
    top: 12,
    right: 12,
    width: 16,
    height: 16,
    borderRadius: "50%",
    border: `2px solid ${selected ? "#FF6B35" : "rgba(255,255,255,0.3)"}`,
    background: selected ? "#FF6B35" : "transparent",
    boxShadow: selected ? "0 0 8px #FF6B35" : "none",
  }),
  leftBottom: {
    marginTop: "auto",
  },
  leftBackBtn: {
    width: "100%",
    padding: "12px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    color: "#fff",
    cursor: "pointer",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  center: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "24px 28px 24px",
  },
  centerLabel: {
    alignSelf: "flex-start",
    fontSize: 13,
    fontWeight: 600,
    color: "rgba(255,255,255,0.5)",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 16,
  },
  canvasWrapper: {
    position: "relative",
    width: "100%",
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.09)",
    background: "radial-gradient(ellipse at center, #1e0e08 0%, #0d0d0d 70%)",
    boxShadow: "0 0 80px rgba(255,107,53,0.08) inset",
    minHeight: 340,
  },
  toolbar: {
    display: "flex",
    gap: 10,
    marginTop: 18,
    alignSelf: "center",
  },
  toolBtn: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "10px 22px",
    borderRadius: 12,
    border: `1.5px solid ${active ? "#FF6B35" : "rgba(255,255,255,0.12)"}`,
    background: active ? "rgba(255,107,53,0.18)" : "rgba(255,255,255,0.05)",
    color: active ? "#FF6B35" : "rgba(255,255,255,0.7)",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: active ? 600 : 400,
    transition: "all 0.2s",
  }),
  iconBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    borderRadius: 12,
    border: "1.5px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "rgba(255,255,255,0.7)",
    cursor: "pointer",
    fontSize: 18,
    transition: "all 0.2s",
  },
  deleteBtn: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "10px 22px",
    borderRadius: 12,
    border: "1.5px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "rgba(255,255,255,0.7)",
    cursor: "pointer",
    fontSize: 14,
    transition: "all 0.2s",
  },
  submitRow: {
    marginTop: 14,
    display: "flex",
    gap: 12,
    alignSelf: "center",
  },
  submitBtn: {
    padding: "12px 30px",
    borderRadius: 12,
    border: "none",
    background: "#FF6B35",
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  rightPanel: {
    width: 300,
    minWidth: 200,
    background: "rgba(255,255,255,0.03)",
    borderLeft: "1px solid rgba(255,255,255,0.07)",
    padding: "24px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  colorGroupLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.55)",
    marginBottom: 14,
    fontWeight: 500,
  },
  colorGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
  },
  colorDot: (color, selected) => ({
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: color,
    border: selected ? "2.5px solid #fff" : "2.5px solid transparent",
    boxShadow: selected ? `0 0 12px ${color}` : "none",
    cursor: "pointer",
    transition: "all 0.2s",
  }),
  rainbowDot: (selected) => ({
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "conic-gradient(red, orange, yellow, green, cyan, blue, violet, red)",
    border: selected ? "2.5px solid #fff" : "2.5px solid rgba(255,255,255,0.3)",
    cursor: "pointer",
    position: "relative",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  rainbowInput: {
    position: "absolute",
    inset: 0,
    opacity: 0,
    cursor: "pointer",
    borderRadius: "50%",
    width: "100%",
    height: "100%",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 20,
  },
  modalContent: {
    background: "linear-gradient(145deg, #1a1a2e, #16213e)",
    borderRadius: 24,
    border: "1px solid rgba(255,107,53,0.3)",
    maxWidth: 1000,
    width: "100%",
    padding: 40,
    boxShadow: "0 0 50px rgba(0,0,0,0.5)",
    display: "flex",
    gap: 40,
    alignItems: "center",
  },
  modalImage: {
    flex: 1,
    borderRadius: 16,
    boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
    maxWidth: "50%",
  },
  modalText: {
    flex: 1,
  },
  secondaryBtn: {
    padding: "12px 20px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    cursor: "pointer",
    fontSize: 14,
    transition: "all 0.2s",
  }
};

// ─── SVG data ─────────────────────────────────────────────────────────────────
const PARTS = [
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

const svgToDataUrl = (svg) => `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
const PART_COLORS = ["#FF6B35", "#3A1509", "#A4E1FF"];
const BRUSH_COLORS = ["#000000", "#FF0000", "#00FF00", "#0000FF", "#97067c", "#d89f00"];

export default function HyperloopDesigner({ username = "Melvin", onReset }) {
  const navigate = useNavigate();
  const [selectedPart, setSelectedPart] = useState(PARTS[0]);
  const [partColor, setPartColor] = useState("#FF6B35");
  const [drawColor, setDrawColor] = useState("#000000");
  const [tool, setTool] = useState("brush");
  const [submitted, setSubmitted] = useState(false);
  const [drawingData, setDrawingData] = useState(null);

  const bgRef = useRef(null);
  const drawRef = useRef(null);
  const isDrawing = useRef(false);
  const prevPos = useRef(null);
  const historyRef = useRef([]); 
  const redoRef = useRef([]);   

  const W = 1350, H = 450;

  useEffect(() => {
    if (!selectedPart || !bgRef.current) return;
    const canvas = bgRef.current;
    const ctx = canvas.getContext("2d");
    const colored = selectedPart.svgString.replace(/__COLOR__/g, partColor);
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, W, H);
      const pad = 30;
      const ar = img.width / img.height;
      let dw = W - 2 * pad, dh = H - 2 * pad;
      if (dw / dh > ar) dw = dh * ar; else dh = dw / ar;
      const ox = (W - dw) / 2, oy = (H - dh) / 2;
      ctx.drawImage(img, ox, oy, dw, dh);
    };
    img.src = svgToDataUrl(colored);
  }, [selectedPart, partColor]);

  const saveHistory = () => {
    const snap = drawRef.current.toDataURL();
    historyRef.current.push(snap);
    redoRef.current = [];
  };

  const startDraw = (e) => {
    saveHistory();
    isDrawing.current = true;
    draw(e);
  };

  const stopDraw = () => {
    isDrawing.current = false;
    prevPos.current = null;
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const canvas = drawRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    
    // Scaling fix
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 24;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = 4;
    }

    ctx.beginPath();
    const startX = prevPos.current ? prevPos.current.x : x;
    const startY = prevPos.current ? prevPos.current.y : y;
    ctx.moveTo(startX, startY);
    ctx.lineTo(x, y);
    ctx.stroke();
    prevPos.current = { x, y };
  };

  const undo = () => {
    if (!historyRef.current.length) return;
    const snap = historyRef.current.pop();
    redoRef.current.push(drawRef.current.toDataURL());
    const ctx = drawRef.current.getContext("2d");
    ctx.clearRect(0, 0, W, H);
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.src = snap;
  };

  const redo = () => {
    if (!redoRef.current.length) return;
    const snap = redoRef.current.pop();
    historyRef.current.push(drawRef.current.toDataURL());
    const ctx = drawRef.current.getContext("2d");
    ctx.clearRect(0, 0, W, H);
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.src = snap;
  };

  const clearAll = () => {
    saveHistory();
    drawRef.current.getContext("2d").clearRect(0, 0, W, H);
  };

  const handleSubmit = () => {
    const final = document.createElement("canvas");
    final.width = W; final.height = H;
    const ctx = final.getContext("2d");
    ctx.drawImage(bgRef.current, 0, 0);
    ctx.drawImage(drawRef.current, 0, 0);
    const data = final.toDataURL("image/png");
    
    // localStorage fix voor de andere minigames
    localStorage.setItem("hyperloopImage", data);
    
    setDrawingData(data);
    setSubmitted(true);
  };

  if (submitted && drawingData) {
    return (
      <div style={S.root}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 40 }}>

            {/* IMAGE */}
            <div style={{ flex: 1, textAlign: "center" }}>
              <img
                src={drawingData}
                alt="Hyperloop ontwerp"
                style={{
                  maxWidth: "100%",
                  borderRadius: 16,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.6)"
                }}
              />
            </div>

            {/* TEXT */}
            <div style={{ flex: 1 }}>
              <h2 style={{ marginBottom: 10 }}>
                Jouw Hyperloop
              </h2>

              <p>
                Dit is jouw ontworpen {selectedPart?.name}. 
                Je hebt zelf de kleuren gekozen en extra details getekend.
              </p>

              <p>
                Hyperloops zijn supersnelle transportsystemen van de toekomst 🚄
                waarbij capsules door buizen reizen met extreem hoge snelheid.
              </p>

              <div style={{ marginTop: 20 }}>
                <button
                  onClick={() => navigate("/games")}
                  style={{
                    padding: "12px 20px",
                    marginRight: 10,
                    borderRadius: 10,
                    border: "none",
                    background: "#28a745",
                    color: "#fff",
                    cursor: "pointer"
                  }}
                >
                  Ga naar minigames 🎮
                </button>

                <button onClick={() => setSubmitted(false)}>
                  ✏️ Verder bewerken
                </button>

                <button
                  onClick={onReset}
                  style={{
                    padding: "12px 20px",
                    borderRadius: 10,
                    border: "none",
                    background: "#007bff",
                    color: "#fff",
                    cursor: "pointer"
                  }}
                >
                  Opnieuw beginnen
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.root}>
      <div style={S.topBar}>
        <button style={S.backBtn} onClick={onReset}>← Terug naar start</button>
        <div style={S.logo}>
          <svg style={S.logoIcon} viewBox="0 0 32 32" fill="none">
            <path d="M8 16c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6" stroke="#FF6B35" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M24 16c0 3.3-2.7 6-6 6" stroke="#FF6B35" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          HYPERLOOP
        </div>
        <div style={S.modeBadge}>
          <div style={S.dot} /> Ontwerpmodus &nbsp; ✏️
        </div>
      </div>

      <h1 style={S.heading}>Ontwerp jouw <span style={{ color: "#FF6B35" }}>Hyperloop</span>, {username}!</h1>
      <p style={S.subheading}>Kies een onderdeel, pas de kleur aan en teken jouw eigen ontwerp.</p>

      <div style={{ ...S.body, marginTop: 20 }}>
        <div style={S.leftPanel}>
          <div style={S.panelLabel}>1. Kies een onderdeel</div>
          {PARTS.map(part => {
            const sel = selectedPart?.id === part.id;
            return (
              <div key={part.id} style={S.partCard(sel)} onClick={() => setSelectedPart(part)}>
                <div style={S.radioCircle(sel)} />
                <img src={svgToDataUrl(part.svgString.replace(/__COLOR__/g, "#FF6B35"))} alt={part.name} style={S.partImg} />
                <div style={S.partTitle(sel)}>{part.name}</div>
                <div style={S.partDesc}>{part.discription}</div>
              </div>
            );
          })}
        </div>

        <div style={S.center}>
          <div style={S.centerLabel}>2. Ontwerp jouw onderdeel</div>
          <div style={S.canvasWrapper}>
            <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: `linear-gradient(rgba(255,107,53,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,53,0.06) 1px, transparent 1px)`, backgroundSize: "40px 40px", maskImage: "linear-gradient(to top, rgba(0,0,0,0.4), transparent 60%)" }} />
            <canvas ref={bgRef} width={W} height={H} style={{ position: "absolute", top: 0, left: 0, zIndex: 1, width: "100%", height: "100%" }} />
            <canvas ref={drawRef} width={W} height={H} onMouseDown={startDraw} onMouseUp={stopDraw} onMouseMove={draw} onMouseLeave={stopDraw} style={{ position: "absolute", top: 0, left: 0, zIndex: 2, width: "100%", height: "100%", cursor: tool === "eraser" ? "cell" : "crosshair", background: "transparent" }} />
          </div>

          <div style={S.toolbar}>
            <button style={S.toolBtn(tool === "brush")} onClick={() => setTool("brush")}>✏️ Pen</button>
            <button style={S.toolBtn(tool === "eraser")} onClick={() => setTool("eraser")}>🧽 Wissen</button>
            <button style={S.deleteBtn} onClick={clearAll}>🗑️ Alles wissen</button>
          </div>
          <div style={S.submitRow}>
            <button style={S.submitBtn} onClick={handleSubmit}>Verstuur naar scherm →</button>
          </div>
        </div>

        <div style={S.rightPanel}>
          <div>
            <div style={S.colorGroupLabel}>Onderdeel kleur</div>
            <div style={S.colorGrid}>
              {PART_COLORS.map(c => <div key={c} style={S.colorDot(c, partColor === c)} onClick={() => setPartColor(c)} />)}
              <label style={S.rainbowDot(!PART_COLORS.includes(partColor))}>
                <span style={{ fontSize: 16, zIndex: 1 }}>✏️</span>
                <input type="color" value={partColor} onChange={e => setPartColor(e.target.value)} style={S.rainbowInput} />
              </label>
            </div>
          </div>
          <div>
            <div style={S.colorGroupLabel}>Penseel kleur</div>
            <div style={S.colorGrid}>
              {BRUSH_COLORS.map(c => <div key={c} style={S.colorDot(c, drawColor === c)} onClick={() => setDrawColor(c)} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}