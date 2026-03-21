import { useEffect, useRef } from "react";
import { useTheme } from "../utils/ThemeContext";

export function DualThemeBackground() {
  const { theme } = useTheme();
  const interactiveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = interactiveRef.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      el.style.transform = `translate(${e.clientX - el.offsetWidth / 2}px, ${e.clientY - el.offsetHeight / 2}px)`;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  if (theme === "neon") {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden" style={{ background: "rgb(5, 8, 25)" }}>
        <svg className="hidden"><defs><filter id="blur-filter"><feGaussianBlur stdDeviation="40" colorInterpolationFilters="sRGB" /></filter></defs></svg>
        <div style={{ filter: "url(#blur-filter) blur(0px)", width: "100%", height: "100%" }}>
          <div className="absolute" style={{ width: "80%", height: "80%", top: "10%", left: "10%", background: "radial-gradient(circle at center, rgba(59,130,246,0.3) 0%, transparent 60%)", mixBlendMode: "hard-light", animation: "moveBlob1 8s ease infinite alternate" }} />
          <div className="absolute" style={{ width: "70%", height: "70%", top: "20%", left: "20%", background: "radial-gradient(circle at center, rgba(139,92,246,0.25) 0%, transparent 60%)", mixBlendMode: "hard-light", animation: "moveBlob2 10s ease infinite alternate" }} />
          <div className="absolute" style={{ width: "50%", height: "50%", top: "5%", left: "40%", background: "radial-gradient(circle at center, rgba(124,58,237,0.2) 0%, transparent 60%)", mixBlendMode: "hard-light", animation: "moveBlob4 9s ease infinite alternate" }} />
          <div ref={interactiveRef} className="absolute" style={{ width: "40%", height: "40%", background: "radial-gradient(circle at center, rgba(103,232,249,0.15) 0%, transparent 60%)", mixBlendMode: "hard-light", transition: "transform 0.1s ease-out", top: 0, left: 0 }} />
        </div>
        <style>{`
          @keyframes moveBlob1 { 0%{transform:translate(0,0)} 100%{transform:translate(5%,8%)} }
          @keyframes moveBlob2 { 0%{transform:translate(0,0)} 100%{transform:translate(-8%,5%)} }
          @keyframes moveBlob4 { 0%{transform:translate(0,0)} 100%{transform:translate(-5%,10%)} }
        `}</style>
      </div>
    );
  }

  // Pink theme background
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" style={{ background: "linear-gradient(145deg, #ffe8ee 0%, #ffd6e0 40%, #ffb3c1 100%)" }}>
      <div className="absolute" style={{ width: "70%", height: "70%", top: "5%", right: "-10%", background: "radial-gradient(circle at center, rgba(220,31,63,0.25) 0%, transparent 65%)", animation: "blobPulse1 9s ease-in-out infinite alternate" }} />
      <div className="absolute" style={{ width: "60%", height: "60%", bottom: "10%", left: "-5%", background: "radial-gradient(circle at center, rgba(251,100,128,0.28) 0%, transparent 65%)", animation: "blobPulse2 11s ease-in-out infinite alternate" }} />
      <div className="absolute" style={{ width: "40%", height: "40%", top: "30%", left: "30%", background: "radial-gradient(circle at center, rgba(255,182,193,0.35) 0%, transparent 65%)", animation: "blobPulse3 13s ease-in-out infinite alternate" }} />
      <div ref={interactiveRef} className="absolute" style={{ width: "35%", height: "35%", background: "radial-gradient(circle at center, rgba(220,31,63,0.18) 0%, transparent 60%)", transition: "transform 0.15s ease-out", top: 0, left: 0, pointerEvents: "none" }} />
      <style>{`
        @keyframes blobPulse1 { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(3%,5%) scale(1.08)} }
        @keyframes blobPulse2 { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(-4%,-3%) scale(1.06)} }
        @keyframes blobPulse3 { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(2%,4%) scale(1.05)} }
      `}</style>
    </div>
  );
}
