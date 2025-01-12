import { ChatHistory, ChatStore } from "@/types/chat";

const STORAGE_KEY = "chat_store";

export const storageService = {
  getStore(): ChatStore {
    if (typeof window === "undefined")
      return { currentChatId: null, chats: {} };

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { currentChatId: null, chats: {} };

    return JSON.parse(stored);
  },

  saveStore(store: ChatStore) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  },

  createChat(): ChatHistory {
    return {
      id: crypto.randomUUID(),
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
};
