// import { useNavigate } from "react-router-dom";

// export default function HyperloopResult({ drawingData, selectedPart, onReset }) {
//   const navigate = useNavigate();

//   return (
//     <div className="result-page container mt-5">
//       <div className="row align-items-center">
        
//         <div className="col-md-6 text-center">
//           <img 
//             src={drawingData} 
//             alt="Hyperloop ontwerp" 
//             className="result-image slide-in"
//           />
//         </div>

//         <div className="col-md-6">
//           <h2>Jouw Hyperloop</h2>
//           <p>
//             Dit is jouw ontworpen {selectedPart?.name}. 
//             Je hebt zelf de kleuren gekozen en extra details getekend.
//           </p>

//           <p>
//             Hyperloops zijn supersnelle transportsystemen van de toekomst 🚄
//             waarbij capsules door buizen reizen met extreem hoge snelheid.
//           </p>

//           {/* NIEUWE KNOP */}
//           <button 
//             className="btn btn-success mt-3 me-2"
//             onClick={() => navigate("/games")}
//           >
//             Ga naar minigames 🎮
//           </button>

//           {/* BESTAANDE KNOP */}
//           <button 
//             className="btn btn-primary mt-3"
//             onClick={onReset}
//           >
//             Opnieuw beginnen
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }
