import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, Shield, Globe, Zap, CheckCircle, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { AuthModal } from "./AuthModal";
import { ThemeToggle } from "./ThemeToggle";
import { DualThemeBackground } from "./DualThemeBackground";
import logo from "../../../src/logo.jpeg";

export function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("healthbot_user")) {
      navigate("/chat", { replace: true });
    }
  }, [navigate]);

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
    <div className="min-h-screen flex flex-col text-foreground">
      <DualThemeBackground />

      {/* Header */}
      <header className="px-4 md:px-6 py-3 md:py-4 flex justify-between items-center sticky top-0 z-40 backdrop-blur-md bg-card/80 border-b border-border shadow-sm">
        <div className="flex items-center gap-2 md:gap-3">
          <img src={logo} alt="Swasthya Suchak" className="size-10 md:size-14 rounded-xl object-cover shadow-lg" />
          <span className="text-base md:text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Swasthya Suchak
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setShowAuth(true)}
            className="px-3 md:px-5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 border border-primary/40 text-primary bg-card hover:bg-primary hover:text-primary-foreground backdrop-blur-sm"
          >
            Sign in
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-8 md:py-16">
        <div className="text-center max-w-4xl mx-auto w-full">

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center mb-6 md:mb-8">
            <div className="rounded-2xl p-1 mb-2 bg-card/80 shadow-xl">
              <img src={logo} alt="Swasthya Suchak" className="w-32 md:w-52 rounded-xl object-contain" />
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight px-4">
            Get instant{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">health</span>{" "}
            advice,{" "}
            <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">anytime</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-sm md:text-lg mb-8 md:mb-12 max-w-2xl mx-auto px-4 text-muted-foreground">
            Chat with our AI health assistant in Hindi, English, Hinglish, or Garhwali. Get quick guidance on common health concerns with home remedies and Ayurvedic solutions.
          </motion.p>

          {/* Input Box */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="w-full max-w-3xl mx-auto mb-6 md:mb-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur bg-primary/20" />
              <div className="relative rounded-2xl p-4 md:p-6 shadow-xl bg-card/90 backdrop-blur-xl border border-border">
                <div className="flex gap-3 items-start">
                  <div className="mt-1 p-2 rounded-xl shrink-0 bg-primary/20">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
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
                    className="flex-1 outline-none resize-none text-sm w-full bg-transparent text-foreground placeholder:text-muted-foreground"
                  />
                  {inputValue.trim() && (
                    <button
                      onClick={() => handleQuerySubmit(inputValue)}
                      className="flex items-center gap-2 px-3 md:px-5 py-2 md:py-3 rounded-xl font-semibold bg-primary text-primary-foreground transition-all duration-200 hover:scale-105 shadow-lg self-end shrink-0"
                    >
                      <ArrowRight className="size-4" />
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">AI Health Assistant · Bilingual Support</span>
                  <span className="text-xs text-muted-foreground hidden md:block">Press Enter to send</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 justify-center px-4">
              {sampleQueries.map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuerySubmit(query)}
                  className="px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 hover:scale-105 bg-card/80 border border-border text-primary backdrop-blur-sm"
                >
                  {query}
                </button>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Feature Pills */}
      <div className="px-4 md:px-16 pb-8 pt-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {[
            { icon: <Zap className="size-5 text-primary" />, label: "Instant Responses", desc: "Real-time AI health guidance" },
            { icon: <Globe className="size-5 text-primary" />, label: "Multi-lingual", desc: "Hindi & English both supported" },
            { icon: <Shield className="size-5 text-primary" />, label: "Private & Secure", desc: "Your data, fully encrypted" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 md:gap-3 rounded-xl px-3 md:px-5 py-3 md:py-4 transition-all duration-200 hover:scale-105 bg-card/90 border border-border backdrop-blur-sm shadow-sm">
              <div className="p-2 rounded-lg bg-primary/10">{item.icon}</div>
              <div className="text-left">
                <div className="font-semibold text-xs md:text-sm">{item.label}</div>
                <div className="text-xs text-muted-foreground hidden md:block">{item.desc}</div>
              </div>
              <CheckCircle className="size-4 ml-auto text-primary/50" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-10 pb-4 px-4 md:px-16 border-t border-border bg-card/80 backdrop-blur-md">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto text-muted-foreground">
          <div>
            <h3 className="font-bold mb-3 text-xs md:text-sm tracking-wide text-primary">FOR PATIENTS</h3>
            <ul className="space-y-2 text-xs md:text-sm">
              {["Consult Doctor", "Order Medicines", "Health Records", "Pricing"].map(t => (
                <li key={t} className="cursor-pointer transition-colors hover:text-primary">{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3 text-xs md:text-sm tracking-wide text-primary">FOR PROVIDERS</h3>
            <ul className="space-y-2 text-xs md:text-sm">
              {["Join Network", "List Hospital", "Partner with Us"].map(t => (
                <li key={t} className="cursor-pointer transition-colors hover:text-primary">{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3 text-xs md:text-sm tracking-wide text-primary">COMPANY</h3>
            <ul className="space-y-2 text-xs md:text-sm">
              {["About Us", "Blog", "Careers", "Press"].map(t => (
                <li key={t} className="cursor-pointer transition-colors hover:text-primary">{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3 text-xs md:text-sm tracking-wide text-primary">LEGAL</h3>
            <ul className="space-y-2 text-xs md:text-sm">
              {["Privacy Policy", "Terms of Service", "Support"].map(t => (
                <li key={t} className="cursor-pointer transition-colors hover:text-primary">{t}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-4 flex flex-col md:flex-row justify-between items-center gap-3 border-t border-border">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            © 2026 Swasthya Suchak. All rights reserved. · AI assistant — always consult a professional for serious conditions.
          </p>
          <div className="flex gap-4 text-muted-foreground">
            <Facebook className="size-4 cursor-pointer hover:text-primary transition-colors" />
            <Twitter className="size-4 cursor-pointer hover:text-primary transition-colors" />
            <Linkedin className="size-4 cursor-pointer hover:text-primary transition-colors" />
            <Instagram className="size-4 cursor-pointer hover:text-primary transition-colors" />
          </div>
        </div>
      </footer>

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}
