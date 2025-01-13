"use client";

import { Header } from "@/components/ui/Header";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { useChat } from "@/hooks/useChat";
import { useThemeSetup } from "@/hooks/useThemeSetup";
import { useState, useEffect } from "react";

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [speechRate, setSpeechRate] = useState(1);

  // Initialize speech rate from localStorage
  useEffect(() => {
    const savedRate = localStorage.getItem("speechRate");
    if (savedRate) {
      setSpeechRate(parseFloat(savedRate));
    }
  }, []);

  // Handle speech rate changes
  const handleSpeechRateChange = (rate: number) => {
    setSpeechRate(rate);
    localStorage.setItem("speechRate", rate.toString());
  };

  const {
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
    setSelectedPersona,
  } = useChat(setIsExpanded);
  const { mounted } = useThemeSetup();

  if (!mounted) return null;

  return (
    <div className="flex h-screen max-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <ChatSidebar
        chats={chats}
        currentChatId={currentChatId}
        isExpanded={isExpanded}
        onNewChat={handleNewChat}
        onChatSelect={handleChatSelect}
        onDeleteChat={handleDeleteChat}
        onToggleFavorite={handleToggleFavorite}
        onRenameChat={handleRenameChat}
        onToggleExpanded={setIsExpanded}
      />
      <div className="flex flex-col flex-1">
        <Header
          selectedPersona={selectedPersona}
          onPersonaChange={setSelectedPersona}
          speechRate={speechRate}
          onSpeechRateChange={handleSpeechRateChange}
        />
        <ChatContainer messages={messages} isLoading={isLoading} />
        <ChatInput
          input={input}
          isLoading={isLoading}
          onInputChange={setInput}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
