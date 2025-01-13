"use client";

import { useState, useEffect } from "react";
import { Message, ChatHistory, ChatPersona } from "@/types/chat";

export function useChat(setIsExpanded?: (expanded: boolean) => void) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<ChatPersona>("Human");
  const [chats, setChats] = useState<Record<string, ChatHistory>>(() => {
    // Load chats from localStorage on initial render
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chats");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  // Save chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  // Update selected persona when changing chats
  useEffect(() => {
    if (currentChatId && chats[currentChatId]) {
      setSelectedPersona(chats[currentChatId].persona);
    }
  }, [currentChatId, chats]);

  const handleNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat: ChatHistory = {
      id: newChatId,
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      persona: "Human",
    };

    setChats((prev) => ({
      ...prev,
      [newChatId]: newChat,
    }));

    setCurrentChatId(newChatId);
    setMessages([]);
    setSelectedPersona("Human");

    // Close the sidebar if setIsExpanded is provided
    if (setIsExpanded) {
      setIsExpanded(false);
    }
  };

  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId);
    setMessages(chats[chatId]?.messages || []);
    setSelectedPersona(chats[chatId]?.persona || "Human");
  };

  const updateChatMessages = (chatId: string, newMessages: Message[]) => {
    setChats((prev) => ({
      ...prev,
      [chatId]: {
        ...prev[chatId],
        messages: newMessages,
        updatedAt: new Date().toISOString(),
      },
    }));
    setMessages(newMessages);
  };

  const handlePersonaChange = (newPersona: ChatPersona) => {
    setSelectedPersona(newPersona);
    if (currentChatId) {
      setChats((prev) => ({
        ...prev,
        [currentChatId]: {
          ...prev[currentChatId],
          persona: newPersona,
        },
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setInput("");

      const newUserMessage: Message = {
        id: Date.now().toString(),
        content: input,
        role: "user",
        createdAt: new Date().toISOString(),
      };

      const newAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "",
        role: "assistant",
        createdAt: new Date().toISOString(),
      };

      const newMessages = [...messages, newUserMessage, newAssistantMessage];

      // Update messages in both state and chat history
      if (currentChatId) {
        updateChatMessages(currentChatId, newMessages);
      }

      // Get the chat history excluding the latest assistant message (which is empty)
      const chatHistory = newMessages.slice(0, -1);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          temperature: 0.7,
          chatHistory: chatHistory,
          persona: selectedPersona,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to send message");
      }

      const reader = response.body.getReader();
      let accumulatedResponse = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const text = new TextDecoder().decode(value);
        accumulatedResponse += text;

        const updatedMessages = [...newMessages];
        updatedMessages[updatedMessages.length - 1] = {
          ...updatedMessages[updatedMessages.length - 1],
          content: accumulatedResponse,
        };

        // Update both state and chat history
        if (currentChatId) {
          updateChatMessages(currentChatId, updatedMessages);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    setChats((prev) => {
      const newChats = { ...prev };
      delete newChats[chatId];
      return newChats;
    });

    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
      setSelectedPersona("Human");
    }
  };

  const handleToggleFavorite = (chatId: string) => {
    setChats((prev) => ({
      ...prev,
      [chatId]: {
        ...prev[chatId],
        isFavorite: !prev[chatId].isFavorite,
      },
    }));
  };

  const handleRenameChat = (chatId: string, newTitle: string) => {
    setChats((prev) => ({
      ...prev,
      [chatId]: {
        ...prev[chatId],
        title: newTitle,
      },
    }));
  };

  return {
    messages,
    input,
    isLoading,
    currentChatId,
    chats,
    selectedPersona,
    setInput,
    handleSubmit,
    handleNewChat,
    handleChatSelect,
    handleDeleteChat,
    handleToggleFavorite,
    handleRenameChat,
    setSelectedPersona: handlePersonaChange,
  };
}
