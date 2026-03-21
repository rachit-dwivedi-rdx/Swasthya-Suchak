import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Send, Mic, Image as ImageIcon, LogOut, User, Loader2, MicOff, X, Plus, Trash2, MessageSquare, Menu, ChevronLeft,
} from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { toast } from "sonner";
import { api, Message, Conversation } from "../utils/api";
import { ThemeToggle } from "./ThemeToggle";
import { DualThemeBackground } from "./DualThemeBackground";

interface BotMessage extends Message {
  followUpQuestions?: string[];
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
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-open sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const username = localStorage.getItem("healthbot_user");
    if (!username) { navigate("/"); return; }
    setUser(username);
    loadConversations(username);
    
    const savedActiveId = localStorage.getItem("active_conversation_id");
    if (!savedActiveId) {
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
        setActiveId(savedActiveId);
        loadMessages(savedActiveId);
      } else if (convos.length === 0) {
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

    if (currentId) {
      const existingConvo = conversations.find((c) => c.id === currentId);
      if (!existingConvo) {
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

      const botMsg: BotMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.reply,
        timestamp: new Date().toISOString(),
        followUpQuestions: response.followUpQuestions || [],
      };

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
    <div className="h-screen flex text-foreground overflow-hidden relative">
      <DualThemeBackground />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ duration: 0.2 }}
            className="fixed md:relative z-40 flex flex-col h-full w-64 border-r border-border bg-card/80 backdrop-blur-xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-3 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <img src="/src/logo.jpeg" alt="Logo" className="size-6 rounded-lg" />
                <span className="font-bold text-sm bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Swasthya Suchak
                </span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-primary/10 transition-all">
                <ChevronLeft className="size-4" />
              </button>
            </div>

            <div className="px-3 py-2 space-y-1">
              <button onClick={newChat} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 transition-all text-sm text-primary">
                <Plus className="size-4" />
                New Chat
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 pb-2" style={{ scrollbarWidth: "none" }}>
              {conversations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-xs">No conversations yet</div>
              ) : (
                grouped.map((group) => (
                  <div key={group.label} className="mb-4">
                    <p className="text-xs text-muted-foreground px-2 py-1.5 font-medium">{group.label}</p>
                    {group.items.map((convo) => (
                      <div
                        key={convo.id}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-sm transition-all group mb-1 cursor-pointer ${
                          activeId === convo.id
                            ? "bg-primary/20 text-foreground border border-primary/30"
                            : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                        }`}
                        onClick={() => { 
                          setActiveId(convo.id); 
                          loadMessages(convo.id); 
                          localStorage.setItem("active_conversation_id", convo.id);
                          if (window.innerWidth < 768) setSidebarOpen(false); // Close on mobile
                        }}
                      >
                        <MessageSquare className="size-3.5 shrink-0" />
                        <span className="flex-1 truncate text-xs">{convo.title}</span>
                        <button
                          onClick={(e) => deleteConvo(convo.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 hover:text-destructive transition-all shrink-0"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-border px-3 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {user.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm truncate max-w-[120px]">{user}</span>
              </div>
              <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-destructive/20 hover:text-destructive transition-all" title="Logout">
                <LogOut className="size-4" />
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col h-full min-w-0">
        <header className="border-b border-border backdrop-blur-md bg-card/60 px-3 md:px-4 py-3 flex items-center gap-2 md:gap-3 shrink-0">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-primary/10 transition-all">
              <Menu className="size-4" />
            </button>
          )}
          {!sidebarOpen && (
            <button onClick={newChat} className="p-2 rounded-lg hover:bg-primary/10 transition-all md:hidden" title="New Chat">
              <Plus className="size-4" />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {conversations.find((c) => c.id === activeId)?.title || "Swasthya Suchak"}
            </p>
          </div>
          <ThemeToggle />
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <User className="size-3.5" />
            <span>{user}</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-3 md:px-4 py-4 md:py-6" style={{ scrollbarWidth: "none" }}>
          <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
            {messages.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8 md:py-16">
                <img src="/src/logo.jpeg" alt="Logo" className="size-16 md:size-20 rounded-2xl shadow-xl object-cover mx-auto mb-4 md:mb-5" />
                <h2 className="text-xl md:text-2xl font-bold mb-2">How can I help you today?</h2>
                <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">Describe your symptoms and I'll provide guidance</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl mx-auto mb-8">
                  {[
                    "https://www.youtube.com/embed/q5egJZ0Jvfg",
                    "https://www.youtube.com/embed/P3GfsMwVo9g",
                    "https://www.youtube.com/embed/sYnhRZxbvYA",
                  ].map((src, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-border aspect-video">
                      <iframe src={src} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 max-w-xl mx-auto">
                  {quickReplies.map((q, i) => (
                    <button key={i} onClick={() => setInputValue(q)}
                      className="p-2 md:p-3 bg-card/60 hover:bg-card border border-border hover:border-primary/40 rounded-xl text-left text-xs md:text-sm transition-all backdrop-blur-sm">
                      {q}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div key={message.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 md:gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    {message.role === "assistant" && (
                      <img src="/src/logo.jpeg" alt="Bot" className="size-7 md:size-9 rounded-xl object-cover shrink-0 shadow-lg" />
                    )}
                    <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-3 md:px-4 py-2 md:py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-card/70 backdrop-blur-sm border border-border"
                    }`}>
                      {message.role === "assistant" && <div className="text-xs font-semibold text-primary mb-1">Swasthya Suchak</div>}
                      {message.image && <img src={message.image} alt="Uploaded" className="rounded-lg mb-2 max-w-full" />}
                      <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      
                      {message.role === "assistant" && message.followUpQuestions && message.followUpQuestions.length > 0 && (
                        <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-border space-y-2">
                          <p className="text-xs font-semibold text-primary mb-2">Quick Replies:</p>
                          <div className="flex flex-wrap gap-2">
                            {message.followUpQuestions.map((question, idx) => (
                              <button
                                key={idx}
                                onClick={() => setInputValue(question)}
                                className="px-2 md:px-3 py-1 md:py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 rounded-lg text-xs transition-all"
                              >
                                {question}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <p className="text-xs mt-1.5 opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <Avatar className="size-7 md:size-9 shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xs md:text-sm border border-primary/30">
                          {user.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </motion.div>
                ))}\n              </AnimatePresence>
            )}

            {isLoading && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 md:gap-3">
                <img src="/src/logo.jpeg" alt="Bot" className="size-7 md:size-9 rounded-xl object-cover shrink-0 shadow-lg" />
                <div className="bg-card/70 backdrop-blur-sm border border-border rounded-2xl px-3 md:px-4 py-2 md:py-3 flex items-center gap-2">
                  <div className="text-xs font-semibold text-primary mr-1">Swasthya Suchak</div>
                  <Loader2 className="size-4 animate-spin text-primary" />
                  <span className="text-xs md:text-sm text-muted-foreground">Thinking...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-border backdrop-blur-md bg-card/60 px-3 md:px-4 py-3 md:py-4 shrink-0">
          <div className="max-w-3xl mx-auto">
            {selectedImage && (
              <div className="mb-3 relative inline-block">
                <img src={selectedImage} alt="Selected" className="h-12 md:h-16 rounded-lg border border-border" />
                <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90">
                  <X className="size-3" />
                </button>
              </div>
            )}
            <div className="bg-card/70 backdrop-blur-xl border border-border rounded-2xl p-3 md:p-4 shadow-lg">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                  placeholder="Describe your symptoms..."
                  rows={2}
                  className="w-full outline-none bg-transparent text-foreground placeholder:text-muted-foreground resize-none text-xs md:text-sm"
                />
                <div className="flex items-center justify-between mt-2 md:mt-3 pt-2 md:pt-3 border-t border-border">
                  <div className="flex items-center gap-1">
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    <button onClick={() => fileInputRef.current?.click()} className="p-1.5 md:p-2 rounded-lg hover:bg-primary/10 transition-all" title="Attach image">
                      <ImageIcon className="size-3.5 md:size-4" />
                    </button>
                    <button onClick={handleVoiceInput}
                      className={`p-1.5 md:p-2 rounded-lg transition-all ${isRecording ? "bg-destructive/20 text-destructive" : "hover:bg-primary/10"}`}
                      title="Voice input">
                      {isRecording ? <MicOff className="size-3.5 md:size-4 animate-pulse" /> : <Mic className="size-3.5 md:size-4" />}
                    </button>
                  </div>
                  <button onClick={handleSendMessage}
                    disabled={(!inputValue.trim() && !selectedImage) || isLoading}
                    className="bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-primary-foreground px-3 md:px-4 py-1.5 md:py-2 rounded-xl flex items-center gap-2 text-xs md:text-sm font-medium transition-all hover:scale-105 shadow-lg">
                    {isLoading ? <Loader2 className="size-3.5 md:size-4 animate-spin" /> : <Send className="size-3.5 md:size-4" />}
                    <span className="hidden md:inline">{isLoading ? "Sending..." : "Send"}</span>
                  </button>
                </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">Swasthya Suchak aapki madad ke liye hai. Gambhir samasya hone par doctor se zaroor milein.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
