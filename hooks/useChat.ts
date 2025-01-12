import { useState, useEffect } from "react";
import { chatService } from "@/services/api";
import { storageService } from "@/services/storage";
import type { Message, ChatStore } from "@/types/chat";

export function useChat() {
  const [store, setStore] = useState<ChatStore>(() =>
    storageService.getStore()
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const currentChat = store.currentChatId
    ? store.chats[store.currentChatId]
    : null;
  const messages = currentChat?.messages || [];

  useEffect(() => {
    storageService.saveStore(store);
  }, [store]);

  const createNewChat = () => {
    const newChat = storageService.createChat();
    setStore((prev) => ({
      currentChatId: newChat.id,
      chats: { ...prev.chats, [newChat.id]: newChat },
    }));
  };

  const selectChat = (chatId: string) => {
    setStore((prev) => ({ ...prev, currentChatId: chatId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!store.currentChatId) {
      createNewChat();
    }

    const newMessage: Message = { role: "user", content: input };
    setStore((prev) => {
      const chatId = prev.currentChatId!;
      const chat = prev.chats[chatId];
      return {
        ...prev,
        chats: {
          ...prev.chats,
          [chatId]: {
            ...chat,
            messages: [...chat.messages, newMessage],
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });

    setInput("");
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(input);
      const reader = response.body?.getReader();
      if (!reader) throw new Error("Failed to get reader");

      // Add empty assistant message
      setStore((prev) => {
        const chatId = prev.currentChatId!;
        const chat = prev.chats[chatId];
        return {
          ...prev,
          chats: {
            ...prev.chats,
            [chatId]: {
              ...chat,
              messages: [...chat.messages, { role: "assistant", content: "" }],
              updatedAt: new Date().toISOString(),
            },
          },
        };
      });

      const decoder = new TextDecoder();
      let text = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        text += chunk;

        // Update the last message with accumulated text
        setStore((prev) => {
          const chatId = prev.currentChatId!;
          const chat = prev.chats[chatId];
          const messages = [...chat.messages];
          messages[messages.length - 1].content = text;

          return {
            ...prev,
            chats: {
              ...prev.chats,
              [chatId]: {
                ...chat,
                messages,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    input,
    isLoading,
    setInput,
    handleSubmit,
    createNewChat,
    selectChat,
    chats: store.chats,
    currentChatId: store.currentChatId,
  };
}
