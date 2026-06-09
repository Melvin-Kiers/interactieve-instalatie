import { useEffect, useRef } from "react";

export default function Speedometer({ score, max, label }) {
  const arcRef = useRef();
  const needleRef = useRef();
  const displayRef = useRef();
  const lblRef = useRef();

  const labels = {
    1: "Blijf oefenen!", 2: "Bijna!", 3: "Aardig bezig",
    4: "Niet slecht", 5: "Gemiddeld", 6: "Goed bezig!",
    7: "Goed gedaan!", 8: "Uitstekend!", 9: "Bijna perfect!", 10: "Perfecte score!"
  };

  useEffect(() => {
    const totalArc = 377;
    const duration = 8000;
    const start = performance.now();

    const animate = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = ease * score;
      const dashLen = (val / max) * totalArc;

      arcRef.current.setAttribute("stroke-dasharray", `${dashLen} ${totalArc - dashLen}`);
      const angle = -90 + (val / max) * 180;
      needleRef.current.setAttribute("transform", `rotate(${angle} 140 140)`);
      displayRef.current.innerHTML = `${Math.round(val)}<span style="font-size:18px;color:rgba(255,255,255,1)">/${max}</span>`;

      if (p < 1) requestAnimationFrame(animate);
      else lblRef.current.textContent = labels[score];
    };

    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div className="speedometer-end">
      <p className="sp-lbl">{label}</p>
      <svg width="280" height="160" viewBox="0 0 280 160">
        <path d="M20 140 A120 120 0 0 1 260 140" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="16" strokeLinecap="round"/>
        <path ref={arcRef} d="M20 140 A120 120 0 0 1 260 140" fill="none" stroke="#F6653A" strokeWidth="16" strokeLinecap="round" strokeDasharray="0 377"/>
        <line ref={needleRef} x1="140" y1="140" x2="140" y2="30" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" transform="rotate(-90 140 140)"/>
        <circle cx="140" cy="140" r="6" fill="#F6653A"/>
      </svg>
      <div className="sp-ticks">
        <span>0</span>
        <span>{Math.round(max * 0.25)}</span>
        <span>{Math.round(max * 0.5)}</span>
        <span>{Math.round(max * 0.75)}</span>
        <span>{max}</span>
        </div>
      <p className="sp-score" ref={displayRef}>0<span style={{ fontSize: 18, color: "rgba(255,255,255,.25)" }}>/10</span></p>
      <p className="sp-sub" ref={lblRef}>...</p>
    </div>
  );
}