"use client";

import { Header } from "@/components/ui/Header";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { useChat } from "@/hooks/useChat";
import { useThemeSetup } from "@/hooks/useThemeSetup";

export default function Home() {
  const {
    messages,
    input,
    isLoading,
    setInput,
    handleSubmit,
    createNewChat,
    selectChat,
    chats,
    currentChatId,
  } = useChat();
  const { mounted } = useThemeSetup();

  if (!mounted) return null;

  return (
    <div className="flex h-screen max-h-screen bg-gray-50 dark:bg-gray-900">
      <ChatSidebar
        chats={chats}
        currentChatId={currentChatId}
        onChatSelect={selectChat}
        onNewChat={createNewChat}
      />
      <div className="flex flex-col flex-1">
        <Header />
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
