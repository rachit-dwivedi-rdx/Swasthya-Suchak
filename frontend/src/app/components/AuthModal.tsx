import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User, Stethoscope, MessageCircle, Monitor } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (username: string) => void;
}

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [view, setView] = useState<"auth" | "platform">("auth");
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [loggedInUser, setLoggedInUser] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      localStorage.setItem(`user_${formData.email}`, JSON.stringify({
        username: formData.username, email: formData.email, password: formData.password,
      }));
      setLoggedInUser(formData.username);
    } else {
      const userData = localStorage.getItem(`user_${formData.email}`);
      if (userData) {
        const user = JSON.parse(userData);
        if (user.password === formData.password) { setLoggedInUser(user.username); }
        else { alert("Invalid credentials!"); return; }
      } else { alert("User not found! Please sign up."); return; }
    }
    setView("platform");
  };

  const handleWebChat = () => {
    onSuccess(loggedInUser);
  };

  const handleWhatsApp = () => {
    onSuccess(loggedInUser);
    window.open("https://wa.me/14155238886?text=Hi", "_blank");
  };

  const inputClass = "w-full bg-input-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-all text-sm";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/70 rounded-2xl opacity-50 blur" />
          <div className="relative bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-2xl">

            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-primary/10 transition-all">
              <X className="size-4" />
            </button>

            <div className="absolute top-4 right-14">
              <ThemeToggle />
            </div>

            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <img src="/src/logo.jpeg" alt="Swasthya Suchak" className="h-10 object-contain" />
            </div>

            {view === "auth" ? (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div>
                    <h2 className="text-xl font-bold mb-1">
                      {isSignUp ? "Create your account" : "Welcome back"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {isSignUp ? "Sign up to continue" : "Sign in to continue"}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-primary" />
                      <input type="text" placeholder="Your name" value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className={`${inputClass} pl-10`} required />
                    </div>
                  )}
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-primary" />
                    <input type="email" placeholder="Email address" value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`${inputClass} pl-10`} required />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-primary" />
                    <input type="password" placeholder="Password" value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`${inputClass} pl-10`} required />
                  </div>
                  <button type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg mt-2">
                    {isSignUp ? "Create Account" : "Sign In"}
                  </button>
                </form>

                <div className="mt-5 text-center text-sm">
                  <span className="text-muted-foreground">{isSignUp ? "Already have an account? " : "Don't have an account? "}</span>
                  <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:text-primary/80 font-medium transition-colors">
                    {isSignUp ? "Sign in" : "Sign up"}
                  </button>
                </div>
              </div>
            ) : (
              /* ── Platform Choice after login ── */
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-1">Where do you want to chat?</h2>
                  <p className="text-sm text-muted-foreground">Choose your preferred platform to continue</p>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleWebChat}
                    className="w-full flex items-center gap-4 p-4 bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 rounded-xl transition-all duration-200 text-left group"
                  >
                    <div className="bg-primary p-2.5 rounded-lg shrink-0 group-hover:scale-110 transition-transform">
                      <Monitor className="size-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">Continue on Web</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Keep chatting right here in the browser</p>
                    </div>
                  </button>

                  <button
                    onClick={handleWhatsApp}
                    className="w-full flex items-center gap-4 p-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 rounded-xl transition-all duration-200 text-left group"
                  >
                    <div className="bg-green-500 p-2.5 rounded-lg shrink-0 group-hover:scale-110 transition-transform">
                      <MessageCircle className="size-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Continue on WhatsApp</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Opens WhatsApp with Swasthya Suchak bot</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
