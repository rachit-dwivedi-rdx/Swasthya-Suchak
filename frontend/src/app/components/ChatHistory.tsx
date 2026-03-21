import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { MessageSquare, Trash2, ArrowLeft, Calendar } from "lucide-react";
import { api, Conversation } from "../utils/api";
import { toast } from "sonner";

function BackgroundGradient() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" style={{ background: "rgb(5, 8, 25)" }}>
      <svg className="hidden"><defs><filter id="blur-filter3"><feGaussianBlur stdDeviation="40" colorInterpolationFilters="sRGB" /></filter></defs></svg>
      <div style={{ filter: "url(#blur-filter3) blur(0px)", width: "100%", height: "100%" }}>
        <div className="absolute" style={{ width: "80%", height: "80%", top: "10%", left: "10%", background: "radial-gradient(circle at center, rgba(59,130,246,0.3) 0%, transparent 60%)", mixBlendMode: "hard-light", animation: "moveBlob1 8s ease infinite alternate" }} />
        <div className="absolute" style={{ width: "70%", height: "70%", top: "20%", left: "20%", background: "radial-gradient(circle at center, rgba(139,92,246,0.25) 0%, transparent 60%)", mixBlendMode: "hard-light", animation: "moveBlob2 10s ease infinite alternate" }} />
      </div>
      <style>{`
        @keyframes moveBlob1 { 0%{transform:translate(0,0)} 100%{transform:translate(5%,8%)} }
        @keyframes moveBlob2 { 0%{transform:translate(0,0)} 100%{transform:translate(-8%,5%)} }
      `}</style>
    </div>
  );
}

export function ChatHistory() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = localStorage.getItem("healthbot_user");
    if (!username) {
      navigate("/");
      return;
    }
    setUser(username);
    loadConversations(username);
  }, [navigate]);

  const loadConversations = async (username: string) => {
    try {
      const convos = await api.getConversations(username);
      setConversations(convos);
    } catch (error) {
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.deleteConversation(id);
      setConversations(conversations.filter((c) => c.id !== id));
      toast.success("Conversation deleted");
    } catch {
      toast.error("Failed to delete conversation");
    }
  };

  const groupByDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const week = new Date(today);
    week.setDate(week.getDate() - 7);

    const groups: { label: string; items: Conversation[] }[] = [];
    const todayItems = conversations.filter((c) => new Date(c.createdAt) >= today);
    const yesterdayItems = conversations.filter((c) => new Date(c.createdAt) >= yesterday && new Date(c.createdAt) < today);
    const weekItems = conversations.filter((c) => new Date(c.createdAt) >= week && new Date(c.createdAt) < yesterday);
    const olderItems = conversations.filter((c) => new Date(c.createdAt) < week);

    if (todayItems.length) groups.push({ label: "Today", items: todayItems });
    if (yesterdayItems.length) groups.push({ label: "Yesterday", items: yesterdayItems });
    if (weekItems.length) groups.push({ label: "Previous 7 Days", items: weekItems });
    if (olderItems.length) groups.push({ label: "Older", items: olderItems });

    return groups;
  };

  return (
    <div className="min-h-screen text-white">
      <BackgroundGradient />
      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/chat")}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
            >
              <ArrowLeft className="size-5" />
            </button>
            <h1 className="text-3xl font-bold">Chat History</h1>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-20">
              <MessageSquare className="size-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">No conversations yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupByDate().map((group) => (
                <div key={group.label}>
                  <h2 className="text-sm text-gray-400 font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="size-4" />
                    {group.label}
                  </h2>
                  <div className="space-y-2">
                    {group.items.map((convo) => (
                      <motion.div
                        key={convo.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 cursor-pointer transition-all group"
                        onClick={() => {
                          localStorage.setItem("active_conversation_id", convo.id);
                          navigate("/chat");
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <MessageSquare className="size-4 text-blue-400" />
                              <h3 className="font-medium text-white">{convo.title}</h3>
                            </div>
                            <p className="text-xs text-gray-500">
                              {new Date(convo.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={(e) => handleDelete(convo.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
