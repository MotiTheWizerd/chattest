import { useState } from "react";
import { ChatHistory } from "@/types/chat";
import { ChatToolbar } from "./ChatToolbar";
import { ChatHistoryItem } from "./ChatHistoryItem";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

interface ChatSidebarProps {
  chats: Record<string, ChatHistory>;
  currentChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
  onToggleFavorite: (chatId: string) => void;
}

export function ChatSidebar({
  chats,
  currentChatId,
  onChatSelect,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  onToggleFavorite,
}: ChatSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative flex">
      <div
        className={`absolute top-0 left-0 h-full transition-all duration-300 ease-in-out transform ${
          isExpanded ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <div className="w-64 h-full border-r dark:border-gray-700 bg-white dark:bg-gray-800">
          <ChatToolbar onNewChat={onNewChat} />
          <div className="overflow-y-auto h-[calc(100vh-5rem)]">
            {Object.values(chats)
              .sort((a, b) => {
                if (a.isFavorite && !b.isFavorite) return -1;
                if (!a.isFavorite && b.isFavorite) return 1;
                return (
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
                );
              })
              .map((chat) => (
                <ChatHistoryItem
                  key={chat.id}
                  chat={chat}
                  isActive={currentChatId === chat.id}
                  onSelect={onChatSelect}
                  onDelete={onDeleteChat}
                  onRename={onRenameChat}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
          </div>
        </div>
      </div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`absolute top-4 transition-all duration-300 ease-in-out ${
          isExpanded ? "left-64" : "left-0"
        } z-10 p-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-r-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
        aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isExpanded ? (
          <ChevronLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronRightIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        )}
      </button>
    </div>
  );
}
