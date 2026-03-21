import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Send, Mic, Image as ImageIcon, LogOut, User, Loader2, MicOff, X, Plus, Trash2, MessageSquare, Menu, ChevronLeft,
} from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { toast } from "sonner";
import { api, Message, Conversation, ApiResponse } from "../utils/api";

interface BotMessage extends Message {
  followUpQuestions?: string[];
}

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

function getTitle(messages: Message[]): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "New Chat";
  const text = first.content || "Image";
  return text.length > 35 ? text.slice(0, 35) + "..." : text;
}

export function ChatInterface() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<BotMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const username = localStorage.getItem("healthbot_user");
    if (!username) { navigate("/"); return; }
    setUser(username);
    loadConversations(username);
    
    // Fresh login pe new chat kholo
    const savedActiveId = localStorage.getItem("active_conversation_id");
    if (!savedActiveId) {
      // Agar koi active conversation nahi hai to new chat create karo
      const newConvoId = Date.now().toString();
      const newConvo: Conversation = {
        id: newConvoId,
        title: "New Chat",
        createdAt: new Date().toISOString(),
      };
      setConversations([newConvo]);
      setActiveId(newConvoId);
      localStorage.setItem("active_conversation_id", newConvoId);
    }
  }, [navigate]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const loadConversations = async (username: string) => {
    try {
      const convos = await api.getConversations(username);
      setConversations(convos);
      
      const savedActiveId = localStorage.getItem("active_conversation_id");
      if (savedActiveId && convos.find((c) => c.id === savedActiveId)) {
        // Agar saved conversation exist karta hai to load karo
        setActiveId(savedActiveId);
        loadMessages(savedActiveId);
      } else if (convos.length === 0) {
        // Agar koi conversation nahi hai to new chat create karo
        const newConvoId = Date.now().toString();
        const newConvo: Conversation = {
          id: newConvoId,
          title: "New Chat",
          createdAt: new Date().toISOString(),
        };
        setConversations([newConvo]);
        setActiveId(newConvoId);
        localStorage.setItem("active_conversation_id", newConvoId);
      }
    } catch {
      toast.error("Failed to load conversations");
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const msgs = await api.getMessages(conversationId);
      setMessages(msgs);
    } catch {
      toast.error("Failed to load messages");
    }
  };

  const newChat = () => {
    const newConvoId = Date.now().toString();
    const newConvo: Conversation = {
      id: newConvoId,
      title: "New Chat",
      createdAt: new Date().toISOString(),
    };
    
    setConversations([newConvo, ...conversations]);
    setActiveId(newConvoId);
    setMessages([]);
    setInputValue("");
    setSelectedImage(null);
    localStorage.setItem("active_conversation_id", newConvoId);
  };

  const deleteConvo = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.deleteConversation(id);
      const updated = conversations.filter((c) => c.id !== id);
      setConversations(updated);
      if (activeId === id) {
        setActiveId(updated[0]?.id ?? null);
        if (updated[0]) loadMessages(updated[0].id);
        else setMessages([]);
      }
      toast.success("Conversation deleted");
    } catch {
      toast.error("Failed to delete conversation");
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedImage) return;

    let currentId = activeId;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
      image: selectedImage || undefined,
    };

    // Agar conversation already exist karta hai
    if (currentId) {
      // Check if conversation is already saved in database
      const existingConvo = conversations.find((c) => c.id === currentId);
      if (!existingConvo) {
        // Agar database me nahi hai to save karo
        try {
          await api.saveConversation(user, currentId, "New Chat", new Date().toISOString());
        } catch {
          toast.error("Failed to save conversation");
        }
      }
      
      setMessages((prev) => [...prev, userMsg]);
      try {
        await api.saveMessage(currentId, userMsg);
      } catch {
        toast.error("Failed to save message");
      }
    } else {
      // Naya conversation create karo
      currentId = Date.now().toString();
      const newConvo: Conversation = {
        id: currentId,
        title: "New Chat",
        createdAt: new Date().toISOString(),
      };
      try {
        await api.saveConversation(user, currentId, newConvo.title, newConvo.createdAt);
        setConversations([newConvo, ...conversations]);
        setActiveId(currentId);
        localStorage.setItem("active_conversation_id", currentId);
        setMessages([userMsg]);
        await api.saveMessage(currentId, userMsg);
      } catch {
        toast.error("Failed to create conversation");
        return;
      }
    }

    const currentInput = inputValue;
    const currentImage = selectedImage;
    setInputValue("");
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const response = currentImage
        ? await api.analyzeImage(user, currentImage)
        : await api.sendMessage(user, currentInput);

      console.log("API Response:", response);
      console.log("Follow-up Questions:", response.followUpQuestions);

      const botMsg: BotMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.reply,
        timestamp: new Date().toISOString(),
        followUpQuestions: response.followUpQuestions || [],
      };

      console.log("Bot Message:", botMsg);

      setMessages((prev) => [...prev, botMsg]);
      await api.saveMessage(currentId, botMsg);

      const title = getTitle([userMsg, botMsg]);
      await api.updateTitle(currentId, title);
      setConversations((prev) =>
        prev.map((c) => (c.id === currentId ? { ...c, title } : c))
      );
    } catch {
      toast.error("Failed to get response");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!(("webkitSpeechRecognition" in window) || ("SpeechRecognition" in window))) {
      toast.error("Speech recognition not supported"); return;
    }
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SR();
    recognition.lang = "en-US"; recognition.interimResults = false;
    recognition.onstart = () => { setIsRecording(true); toast.info("Listening..."); };
    recognition.onresult = (e: any) => { setInputValue(e.results[0][0].transcript); toast.success("Voice captured!"); };
    recognition.onerror = () => { toast.error("Voice recognition error"); setIsRecording(false); };
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setSelectedImage(reader.result as string); toast.success("Image attached"); };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => { localStorage.removeItem("healthbot_user"); navigate("/"); };

  const quickReplies = ["I have a high fever", "मुझे सिर दर्द है", "mujhe khansi ho rahi hai", "myaar sir me dukh chu"];

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const week = new Date(today); week.setDate(week.getDate() - 7);

  const grouped: { label: string; items: Conversation[] }[] = [];
  const todayItems = conversations.filter((c) => new Date(c.createdAt) >= today);
  const yesterdayItems = conversations.filter((c) => new Date(c.createdAt) >= yesterday && new Date(c.createdAt) < today);
  const weekItems = conversations.filter((c) => new Date(c.createdAt) >= week && new Date(c.createdAt) < yesterday);
  const olderItems = conversations.filter((c) => new Date(c.createdAt) < week);
  if (todayItems.length) grouped.push({ label: "Today", items: todayItems });
  if (yesterdayItems.length) grouped.push({ label: "Yesterday", items: yesterdayItems });
  if (weekItems.length) grouped.push({ label: "Previous 7 Days", items: weekItems });
  if (olderItems.length) grouped.push({ label: "Older", items: olderItems });

  return (
    <div className="h-screen flex text-gray-900 overflow-hidden">
      <HealthMedicalBackground />

      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full border-r border-rose-200/40 bg-white/60 backdrop-blur-xl overflow-hidden shrink-0"
            style={{ minWidth: 0 }}
          >
            <div className="flex items-center justify-between px-3 py-3 border-b border-rose-200/40">
              <div className="flex items-center gap-2">
                <img src="/src/logo.jpeg" alt="Logo" className="size-6 rounded-lg" />
                <span className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-pink-600">
                  Swasthya Suchak
                </span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-100 transition-all">
                <ChevronLeft className="size-4" />
              </button>
            </div>

            <div className="px-3 py-2 space-y-1">
              <button onClick={newChat} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 hover:border-rose-400 transition-all text-sm text-rose-700 hover:text-rose-800">
                <Plus className="size-4" />
                New Chat
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 pb-2" style={{ scrollbarWidth: "none" }}>
              {conversations.length === 0 ? (
                <div className="text-center py-8 text-rose-400 text-xs">No conversations yet</div>
              ) : (
                grouped.map((group) => (
                  <div key={group.label} className="mb-4">
                    <p className="text-xs text-rose-500 px-2 py-1.5 font-medium">{group.label}</p>
                    {group.items.map((convo) => (
                      <div
                        key={convo.id}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-sm transition-all group mb-1 cursor-pointer ${
                          activeId === convo.id
                            ? "bg-rose-100 text-rose-900 border border-rose-300"
                            : "text-rose-700 hover:bg-rose-50 hover:text-rose-900"
                        }`}
                        onClick={() => { setActiveId(convo.id); loadMessages(convo.id); localStorage.setItem("active_conversation_id", convo.id); }}
                      >
                        <MessageSquare className="size-3.5 shrink-0 text-rose-500" />
                        <span className="flex-1 truncate text-xs">{convo.title}</span>
                        <button
                          onClick={(e) => deleteConvo(convo.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 hover:text-red-400 transition-all shrink-0"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-rose-200/40 px-3 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-xs font-bold text-white">
                  {user.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-rose-800 truncate max-w-[120px]">{user}</span>
              </div>
              <button onClick={handleLogout} className="p-1.5 rounded-lg text-rose-600 hover:text-red-600 hover:bg-red-100 transition-all" title="Logout">
                <LogOut className="size-4" />
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col h-full min-w-0">
        <header className="border-b border-rose-200/40 backdrop-blur-md bg-white/40 px-4 py-3 flex items-center gap-3 shrink-0">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-100 transition-all">
              <Menu className="size-4" />
            </button>
          )}
          {!sidebarOpen && (
            <button onClick={newChat} className="p-2 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-100 transition-all" title="New Chat">
              <Plus className="size-4" />
            </button>
          )}
          <div className="flex-1">
            <p className="text-sm font-medium text-rose-900 truncate">
              {conversations.find((c) => c.id === activeId)?.title || "Swasthya Suchak"}
            </p>
          </div>
          {!sidebarOpen && (
            <div className="flex items-center gap-2 text-xs text-rose-700">
              <User className="size-3.5" />
              <span>{user}</span>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-6" style={{ scrollbarWidth: "none" }}>
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                <img src="/src/logo.jpeg" alt="Logo" className="size-20 rounded-2xl shadow-xl shadow-rose-500/30 object-cover mx-auto mb-5" />
                <h2 className="text-2xl font-bold mb-2 text-rose-900">How can I help you today?</h2>
                <p className="text-rose-600 mb-8">Describe your symptoms and I'll provide guidance</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl mx-auto mb-8">
                  {[
                    "https://www.youtube.com/embed/q5egJZ0Jvfg",
                    "https://www.youtube.com/embed/P3GfsMwVo9g",
                    "https://www.youtube.com/embed/sYnhRZxbvYA",
                  ].map((src, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-rose-200 aspect-video">
                      <iframe src={src} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto">
                  {quickReplies.map((q, i) => (
                    <button key={i} onClick={() => setInputValue(q)}
                      className="p-3 bg-white/60 hover:bg-rose-50 border border-rose-200 hover:border-rose-400 rounded-xl text-left text-sm text-rose-700 hover:text-rose-900 transition-all backdrop-blur-sm">
                      {q}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div key={message.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    {message.role === "assistant" && (
                      <img src="/src/logo.jpeg" alt="Bot" className="size-9 rounded-xl object-cover shrink-0 shadow-lg shadow-rose-500/30" />
                    )}
                    <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/20"
                        : "bg-white/70 backdrop-blur-sm border border-rose-200 text-rose-900"
                    }`}>
                      {message.role === "assistant" && <div className="text-xs font-semibold text-rose-600 mb-1">Swasthya Suchak</div>}
                      {message.image && <img src={message.image} alt="Uploaded" className="rounded-lg mb-2 max-w-full" />}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      
                      {/* Follow-up Questions as Buttons */}
                      {message.role === "assistant" && message.followUpQuestions && message.followUpQuestions.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-rose-200 space-y-2">
                          <p className="text-xs font-semibold text-rose-600 mb-2">Quick Replies:</p>
                          <div className="flex flex-wrap gap-2">
                            {message.followUpQuestions.map((question, idx) => (
                              <button
                                key={idx}
                                onClick={() => setInputValue(question)}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-300 hover:border-rose-400 rounded-lg text-xs text-rose-700 hover:text-rose-900 transition-all"
                              >
                                {question}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <p className={`text-xs mt-1.5 ${message.role === "user" ? "text-rose-100" : "text-rose-500"}`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <Avatar className="size-9 shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-600 text-white text-sm border border-rose-300">
                          {user.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {isLoading && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                <img src="/src/logo.jpeg" alt="Bot" className="size-9 rounded-xl object-cover shrink-0 shadow-lg shadow-rose-500/30" />
                <div className="bg-white/70 backdrop-blur-sm border border-rose-200 rounded-2xl px-4 py-3 flex items-center gap-2">
                  <div className="text-xs font-semibold text-rose-600 mr-1">Swasthya Suchak</div>
                  <Loader2 className="size-4 animate-spin text-rose-500" />
                  <span className="text-sm text-rose-700">Thinking...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-rose-200/40 backdrop-blur-md bg-white/40 px-4 py-4 shrink-0">
          <div className="max-w-3xl mx-auto">
            {selectedImage && (
              <div className="mb-3 relative inline-block">
                <img src={selectedImage} alt="Selected" className="h-16 rounded-lg border border-rose-300" />
                <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                  <X className="size-3" />
                </button>
              </div>
            )}
            <div className="bg-white/70 backdrop-blur-xl border border-rose-200 rounded-2xl p-4 shadow-lg">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                  placeholder="Describe your symptoms..."
                  rows={2}
                  className="w-full outline-none bg-transparent text-rose-900 placeholder-rose-400 resize-none text-sm"
                />
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-rose-200">
                  <div className="flex items-center gap-1">
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-100 transition-all" title="Attach image">
                      <ImageIcon className="size-4" />
                    </button>
                    <button onClick={handleVoiceInput}
                      className={`p-2 rounded-lg transition-all ${isRecording ? "bg-red-500/20 text-red-400" : "text-rose-600 hover:text-rose-700 hover:bg-rose-100"}`}
                      title="Voice input">
                      {isRecording ? <MicOff className="size-4 animate-pulse" /> : <Mic className="size-4" />}
                    </button>
                  </div>
                  <button onClick={handleSendMessage}
                    disabled={(!inputValue.trim() && !selectedImage) || isLoading}
                    className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all hover:scale-105 shadow-lg">
                    {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                    <span>{isLoading ? "Sending..." : "Send"}</span>
                  </button>
                </div>
            </div>
            <p className="text-xs text-rose-600 text-center mt-2">Swasthya Suchak aapki madad ke liye hai. Gambhir samasya hone par doctor se zaroor milein.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
