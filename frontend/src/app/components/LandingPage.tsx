import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, Shield, Globe, Zap, CheckCircle, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { AuthModal } from "./AuthModal";
import logo from "../../logo.jpeg";

function HealthMedicalBackground() {
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

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "linear-gradient(145deg, #ffe8ee 0%, #ffd6e0 40%, #ffb3c1 100%)" }}
    >
      <div className="absolute" style={{ width: "70%", height: "70%", top: "5%", right: "-10%", background: "radial-gradient(circle at center, rgba(220,31,63,0.25) 0%, transparent 65%)", animation: "blobPulse1 9s ease-in-out infinite alternate" }} />
      <div className="absolute" style={{ width: "60%", height: "60%", bottom: "10%", left: "-5%", background: "radial-gradient(circle at center, rgba(251,100,128,0.28) 0%, transparent 65%)", animation: "blobPulse2 11s ease-in-out infinite alternate" }} />
      <div className="absolute" style={{ width: "40%", height: "40%", top: "30%", left: "30%", background: "radial-gradient(circle at center, rgba(255,182,193,0.35) 0%, transparent 65%)", animation: "blobPulse3 13s ease-in-out infinite alternate" }} />
      <div ref={interactiveRef} className="absolute" style={{ width: "35%", height: "35%", background: "radial-gradient(circle at center, rgba(220,31,63,0.18) 0%, transparent 60%)", transition: "transform 0.15s ease-out", top: 0, left: 0, pointerEvents: "none" }} />

      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.25 }}>
        <polyline points="0,130 80,130 110,60 140,200 170,90 200,130 360,130" fill="none" stroke="#dc1f3f" strokeWidth="3" style={{ animation: "moveRight 22s linear infinite" }} />
        <polyline points="640,520 720,520 750,440 780,600 810,470 840,520 1000,520" fill="none" stroke="#dc1f3f" strokeWidth="3" style={{ animation: "moveLeft 26s linear infinite" }} />
        <polyline points="20,380 90,380 110,330 135,440 155,360 180,380 290,380" fill="none" stroke="#c91839" strokeWidth="2.2" strokeOpacity="0.8" style={{ animation: "moveRight 30s linear infinite" }} />
        <polyline points="720,260 790,260 810,210 835,320 855,240 880,260 980,260" fill="none" stroke="#c91839" strokeWidth="2.2" strokeOpacity="0.8" style={{ animation: "moveLeft 28s linear infinite" }} />

        {[0,1,2,3,4,5,6,7].map(i => (
          <g key={`ldna-${i}`} style={{ animation: `floatY ${8+i*0.7}s ease-in-out infinite alternate` }}>
            <circle cx={`${3 + Math.sin(i * 1.1) * 2.5}%`} cy={`${10 + i * 10}%`} r="6" fill="#c91839" />
            <circle cx={`${7.5 - Math.sin(i * 1.1) * 2.5}%`} cy={`${10 + i * 10}%`} r="6" fill="#ff8fa3" />
            <line x1={`${3 + Math.sin(i * 1.1) * 2.5}%`} y1={`${10 + i * 10}%`} x2={`${7.5 - Math.sin(i * 1.1) * 2.5}%`} y2={`${10 + i * 10}%`} stroke="#c91839" strokeWidth="2" strokeOpacity="0.7" />
          </g>
        ))}

        <rect x="12%" y="6%" width="16" height="48" rx="4" fill="#c91839" style={{ animation: "floatY 8s ease-in-out infinite alternate-reverse" }} />
        <rect x="calc(12% - 16px)" y="calc(6% + 16px)" width="48" height="16" rx="4" fill="#c91839" style={{ animation: "floatY 8s ease-in-out infinite alternate-reverse" }} />

        <g style={{ animation: "floatY 9s ease-in-out infinite alternate" }}>
          <ellipse cx="8%" cy="48%" rx="30" ry="15" fill="#c91839" transform="rotate(-35, 80, 430)" />
          <ellipse cx="8%" cy="48%" rx="15" ry="15" fill="#ff7a94" transform="rotate(-35, 80, 430)" />
        </g>

        <g style={{ animation: "floatY 11s ease-in-out infinite alternate-reverse" }}>
          <ellipse cx="14%" cy="72%" rx="24" ry="12" fill="#b01030" transform="rotate(20, 130, 650)" />
          <ellipse cx="14%" cy="72%" rx="12" ry="12" fill="#ff8fa3" transform="rotate(20, 130, 650)" />
        </g>

        <g style={{ animation: "floatY 10s ease-in-out infinite alternate" }}>
          <circle cx="6%" cy="82%" r="20" fill="#ff8fa3" stroke="#c91839" strokeWidth="3" opacity="0.9" />
          <path d="M60,720 C60,720 47,710 47,703 A9,9,0,0,1,60,703 A9,9,0,0,1,73,703 C73,710 60,720 60,720 Z" fill="#b01030" />
        </g>

        <rect x="20%" y="88%" width="12" height="36" rx="3" fill="#c91839" style={{ animation: "floatY 13s ease-in-out infinite alternate-reverse" }} />
        <rect x="calc(20% - 12px)" y="calc(88% + 12px)" width="36" height="12" rx="3" fill="#c91839" style={{ animation: "floatY 13s ease-in-out infinite alternate-reverse" }} />

        {[0,1,2,3,4,5,6,7].map(i => (
          <g key={`rdna-${i}`} style={{ animation: `floatY ${7+i*0.8}s ease-in-out infinite alternate-reverse` }}>
            <circle cx={`${92 + Math.sin(i * 1.1) * 2.5}%`} cy={`${10 + i * 10}%`} r="6" fill="#c91839" />
            <circle cx={`${96.5 - Math.sin(i * 1.1) * 2.5}%`} cy={`${10 + i * 10}%`} r="6" fill="#ff8fa3" />
            <line x1={`${92 + Math.sin(i * 1.1) * 2.5}%`} y1={`${10 + i * 10}%`} x2={`${96.5 - Math.sin(i * 1.1) * 2.5}%`} y2={`${10 + i * 10}%`} stroke="#c91839" strokeWidth="2" strokeOpacity="0.7" />
          </g>
        ))}

        <rect x="84%" y="6%" width="16" height="48" rx="4" fill="#c91839" style={{ animation: "floatY 7s ease-in-out infinite alternate" }} />
        <rect x="calc(84% - 16px)" y="calc(6% + 16px)" width="48" height="16" rx="4" fill="#c91839" style={{ animation: "floatY 7s ease-in-out infinite alternate" }} />

        <g style={{ animation: "floatY 9.5s ease-in-out infinite alternate-reverse" }}>
          <ellipse cx="93%" cy="46%" rx="29" ry="15" fill="#c91839" transform="rotate(35, 940, 420)" />
          <ellipse cx="93%" cy="46%" rx="14" ry="15" fill="#ff7a94" transform="rotate(35, 940, 420)" />
        </g>

        <g style={{ animation: "floatY 12s ease-in-out infinite alternate" }}>
          <circle cx="880" cy="580" r="22" fill="none" stroke="#c91839" strokeWidth="6" />
          <line x1="880" y1="440" x2="880" y2="560" stroke="#c91839" strokeWidth="6" strokeLinecap="round" />
          <circle cx="880" cy="432" r="12" fill="#c91839" />
        </g>

        <g style={{ animation: "floatY 10.5s ease-in-out infinite alternate" }}>
          <ellipse cx="88%" cy="74%" rx="24" ry="12" fill="#b01030" transform="rotate(-20, 950, 650)" />
          <ellipse cx="88%" cy="74%" rx="12" ry="12" fill="#ff8fa3" transform="rotate(-20, 950, 650)" />
        </g>

        <g style={{ animation: "floatY 10s ease-in-out infinite alternate-reverse" }}>
          <circle cx="94%" cy="84%" r="20" fill="#ff8fa3" stroke="#c91839" strokeWidth="3" opacity="0.9" />
          <path d="M960,750 C960,750 947,740 947,733 A9,9,0,0,1,960,733 A9,9,0,0,1,973,733 C973,740 960,750 960,750 Z" fill="#b01030" />
        </g>

        <rect x="78%" y="88%" width="12" height="36" rx="3" fill="#c91839" style={{ animation: "floatY 12s ease-in-out infinite alternate" }} />
        <rect x="calc(78% - 12px)" y="calc(88% + 12px)" width="36" height="12" rx="3" fill="#c91839" style={{ animation: "floatY 12s ease-in-out infinite alternate" }} />

        <g style={{ animation: "floatY 10s ease-in-out infinite alternate-reverse" }}>
          <ellipse cx="50%" cy="4%" rx="26" ry="13" fill="#c91839" />
          <ellipse cx="50%" cy="4%" rx="13" ry="13" fill="#ff7a94" />
        </g>
        <g style={{ animation: "floatY 11s ease-in-out infinite alternate" }}>
          <ellipse cx="50%" cy="95%" rx="22" ry="11" fill="#c91839" transform="rotate(15, 500, 860)" />
          <ellipse cx="50%" cy="95%" rx="11" ry="11" fill="#ff7a94" transform="rotate(15, 500, 860)" />
        </g>
      </svg>

      <style>{`
        @keyframes blobPulse1 { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(3%,5%) scale(1.08)} }
        @keyframes blobPulse2 { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(-4%,-3%) scale(1.06)} }
        @keyframes blobPulse3 { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(2%,4%) scale(1.05)} }
        @keyframes floatY { 0%{transform:translateY(0px)} 100%{transform:translateY(-18px)} }
        @keyframes moveLeft  { 0%{transform:translateX(0)} 100%{transform:translateX(-20%)} }
        @keyframes moveRight { 0%{transform:translateX(-20%)} 100%{transform:translateX(0)} }
      `}</style>
    </div>
  );
}

export function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("healthbot_user")) {
      navigate("/chat", { replace: true });
    }
  }, []);

  const sampleQueries = [
    "I have a fever and headache",
    "मुझे बुखार है",
    "mujhe pet dard hai",
    "myaar sir me dukh chu",
  ];

  const handleQuerySubmit = (query: string) => {
    if (query.trim()) {
      setInitialQuery(query);
      setShowAuth(true);
    }
  };

  const handleAuthSuccess = (username: string) => {
    localStorage.setItem("healthbot_user", username);
    if (initialQuery) {
      localStorage.setItem("healthbot_initial_query", initialQuery);
    }
    navigate("/chat");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ color: "#1a0a10" }}>
      <HealthMedicalBackground />

      {/* Header */}
      <header
        className="px-6 py-4 flex justify-between items-center sticky top-0 z-40"
        style={{
          backdropFilter: "blur(16px)",
          background: "rgba(255,245,247,0.85)",
          borderBottom: "1px solid rgba(220,31,63,0.15)",
          boxShadow: "0 2px 20px rgba(220,31,63,0.08)",
        }}
      >
        <div className="flex items-center gap-3">
          <img src={logo} alt="Swasthya Suchak" className="size-14 rounded-xl object-cover" style={{ boxShadow: "0 4px 16px rgba(220,31,63,0.30)" }} />
          <span className="text-xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #dc1f3f 0%, #e85d78 100%)" }}>
            Swasthya Suchak
          </span>
        </div>
        <button
          onClick={() => setShowAuth(true)}
          className="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{ border: "1.5px solid rgba(220,31,63,0.40)", color: "#dc1f3f", background: "rgba(255,255,255,0.70)", backdropFilter: "blur(8px)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#dc1f3f"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.70)"; (e.currentTarget as HTMLButtonElement).style.color = "#dc1f3f"; }}
        >
          Sign in
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="text-center max-w-4xl mx-auto w-full">

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center mb-8">
            <div className="rounded-2xl p-1 mb-2" style={{ background: "rgba(255,255,255,0.85)", boxShadow: "0 8px 32px rgba(220,31,63,0.22)" }}>
              <img src={logo} alt="Swasthya Suchak" className="w-52 rounded-xl object-contain" />
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ color: "#1a0a10" }}>
            Get instant{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #dc1f3f 0%, #ff6b8a 100%)" }}>health</span>{" "}
            advice,{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #e8294a 0%, #ff8fa3 100%)" }}>anytime</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg mb-12 max-w-2xl mx-auto" style={{ color: "#7a4552" }}>
            Chat with our AI health assistant in Hindi, English, Hinglish, or Garhwali. Get quick guidance on common health concerns with home remedies and Ayurvedic solutions.
          </motion.p>

          {/* Input Box */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="w-full max-w-3xl mx-auto mb-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur" style={{ background: "linear-gradient(135deg, #ffc9d4, #ffe8ee)" }} />
              <div className="relative rounded-2xl p-6 shadow-xl" style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", border: "1.5px solid rgba(220,31,63,0.08)" }}>
                <div className="flex gap-3 items-start">
                  <div className="mt-1 p-2 rounded-xl shrink-0" style={{ background: "linear-gradient(135deg, #ffc9d4, #ffe8ee)" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4.5 2.5c0 1.5 1 2.5 1 4a3 3 0 0 1-6 0c0-1.5 1-2.5 1-4" />
                      <path d="M4.5 6.5v6a6.5 6.5 0 0 0 13 0V9" />
                      <circle cx="19" cy="9" r="2" />
                    </svg>
                  </div>
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleQuerySubmit(inputValue); } }}
                    placeholder="Describe your symptoms... e.g. I have a headache and fever"
                    rows={3}
                    className="flex-1 outline-none resize-none text-sm w-full"
                    style={{ background: "transparent", color: "#1a0a10" }}
                  />
                  {inputValue.trim() && (
                    <button
                      onClick={() => handleQuerySubmit(inputValue)}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105 shadow-lg self-end shrink-0"
                      style={{ background: "linear-gradient(135deg, #ffc9d4, #ffb3c1)" }}
                    >
                      <ArrowRight className="size-4" />
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: "1px solid rgba(220,31,63,0.08)" }}>
                  <span className="text-xs" style={{ color: "#b07080" }}>AI Health Assistant · Bilingual Support</span>
                  <span className="text-xs" style={{ color: "#b07080" }}>Press Enter to send</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {sampleQueries.map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuerySubmit(query)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                  style={{ background: "rgba(255,255,255,0.88)", border: "1.5px solid rgba(220,31,63,0.12)", color: "#dc1f3f", backdropFilter: "blur(8px)" }}
                >
                  {query}
                </button>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Feature Pills */}
      <div className="px-6 md:px-16 pb-8 pt-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: <Zap className="size-5" style={{ color: "#ffb3c1" }} />, label: "Instant Responses", desc: "Real-time AI health guidance", color: "rgba(255,182,193,0.10)", border: "rgba(220,31,63,0.10)" },
            { icon: <Globe className="size-5" style={{ color: "#ffc9d4" }} />, label: "Multi-lingual (Hindi / English / Hinglish / Garhwali)", desc: "Hindi & English both supported", color: "rgba(255,182,193,0.08)", border: "rgba(220,31,63,0.08)" },
            { icon: <Shield className="size-5" style={{ color: "#ffd6e0" }} />, label: "Private & Secure", desc: "Your data, fully encrypted", color: "rgba(255,182,193,0.09)", border: "rgba(220,31,63,0.09)" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl px-5 py-4 transition-all duration-200 hover:scale-105" style={{ background: "rgba(255,255,255,0.92)", border: `1.5px solid ${item.border}`, backdropFilter: "blur(12px)", boxShadow: "0 4px 16px rgba(220,31,63,0.04)" }}>
              <div className="p-2 rounded-lg" style={{ background: item.color }}>{item.icon}</div>
              <div className="text-left">
                <div className="font-semibold text-sm" style={{ color: "#1a0a10" }}>{item.label}</div>
                <div className="text-xs" style={{ color: "#7a4552" }}>{item.desc}</div>
              </div>
              <CheckCircle className="size-4 ml-auto" style={{ color: "#ffc9d4", opacity: 0.5 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-10 pb-4 px-6 md:px-16" style={{ borderTop: "1px solid rgba(220,31,63,0.15)", background: "rgba(255,245,247,0.90)", backdropFilter: "blur(16px)" }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto" style={{ color: "#7a4552" }}>
          <div>
            <h3 className="font-bold mb-3 text-sm tracking-wide" style={{ color: "#dc1f3f" }}>FOR PATIENTS</h3>
            <ul className="space-y-2 text-sm">
              {["Consult Doctor", "Order Medicines", "Health Records", "Pricing"].map(t => (
                <li key={t} className="cursor-pointer transition-colors hover:text-rose-600">{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3 text-sm tracking-wide" style={{ color: "#dc1f3f" }}>FOR PROVIDERS</h3>
            <ul className="space-y-2 text-sm">
              {["Join Network", "List Hospital", "Partner with Us"].map(t => (
                <li key={t} className="cursor-pointer transition-colors hover:text-rose-600">{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3 text-sm tracking-wide" style={{ color: "#dc1f3f" }}>COMPANY</h3>
            <ul className="space-y-2 text-sm">
              {["About Us", "Blog", "Careers", "Press"].map(t => (
                <li key={t} className="cursor-pointer transition-colors hover:text-rose-600">{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3 text-sm tracking-wide" style={{ color: "#dc1f3f" }}>LEGAL</h3>
            <ul className="space-y-2 text-sm">
              {["Privacy Policy", "Terms of Service", "Support"].map(t => (
                <li key={t} className="cursor-pointer transition-colors hover:text-rose-600">{t}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-4 flex flex-col md:flex-row justify-between items-center gap-3" style={{ borderTop: "1px solid rgba(220,31,63,0.12)" }}>
          <p className="text-xs" style={{ color: "#b07080" }}>
            © 2026 Swasthya Suchak. All rights reserved. · AI assistant — always consult a professional for serious conditions.
          </p>
          <div className="flex gap-4" style={{ color: "#b07080" }}>
            <Facebook className="size-4 cursor-pointer hover:text-rose-500 transition-colors" />
            <Twitter className="size-4 cursor-pointer hover:text-rose-500 transition-colors" />
            <Linkedin className="size-4 cursor-pointer hover:text-rose-500 transition-colors" />
            <Instagram className="size-4 cursor-pointer hover:text-rose-600 transition-colors" />
          </div>
        </div>
      </footer>

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}
