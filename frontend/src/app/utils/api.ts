const API_BASE = import.meta.env.VITE_API_URL || "https://swasthya-suchak.onrender.com";

async function fetchWithRetry(url: string, options?: RequestInit, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      return res;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  throw new Error("Max retries reached");
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  image?: string;
  followUpQuestions?: string[];
}

export interface ApiResponse {
  reply: string;
  followUpQuestions?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
}

export const api = {
  async getConversations(user: string): Promise<Conversation[]> {
    const res = await fetchWithRetry(`${API_BASE}/conversations/${user}`);
    if (!res.ok) throw new Error("Failed to fetch conversations");
    const data = await res.json();
    return data.conversations;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const res = await fetchWithRetry(`${API_BASE}/conversations/${conversationId}/messages`);
    if (!res.ok) throw new Error("Failed to fetch messages");
    const data = await res.json();
    return data.messages;
  },

  async saveConversation(user: string, id: string, title: string, createdAt: string) {
    const res = await fetch(`${API_BASE}/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, id, title, createdAt }),
    });
    if (!res.ok) throw new Error("Failed to save conversation");
  },

  async saveMessage(conversationId: string, message: Message) {
    const res = await fetch(`${API_BASE}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: message.id,
        conversationId,
        role: message.role,
        content: message.content,
        timestamp: message.timestamp,
        image: message.image,
      }),
    });
    if (!res.ok) throw new Error("Failed to save message");
  },

  async deleteConversation(conversationId: string) {
    const res = await fetch(`${API_BASE}/conversations/${conversationId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete conversation");
  },

  async updateTitle(conversationId: string, title: string) {
    const res = await fetch(`${API_BASE}/conversations/${conversationId}/title`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error("Failed to update title");
  },

  async sendMessage(user: string, message: string): Promise<ApiResponse> {
    const res = await fetchWithRetry(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, user }),
    });
    if (!res.ok) throw new Error("Backend error");
    const data = await res.json();
    return data;
  },

  async analyzeImage(user: string, image: string): Promise<ApiResponse> {
    const res = await fetchWithRetry(`${API_BASE}/analyze-image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image, user }),
    });
    if (!res.ok) throw new Error("Backend error");
    const data = await res.json();
    return data;
  },
};
