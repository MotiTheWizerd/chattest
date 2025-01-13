"use client";

import { ChatHistory } from "@/types/chat";
import { ChatHistoryItem } from "./ChatHistoryItem";
import { ChatToolbar } from "./ChatToolbar";
import { motion, AnimatePresence } from "framer-motion";

interface ChatSidebarProps {
  chats: Record<string, ChatHistory>;
  currentChatId: string | null;
  isExpanded: boolean;
  onNewChat: () => void;
  onChatSelect: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onToggleFavorite: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
  onToggleExpanded: (expanded: boolean) => void;
}

export function ChatSidebar({
  chats = {},
  currentChatId,
  isExpanded,
  onNewChat,
  onChatSelect,
  onDeleteChat,
  onToggleFavorite,
  onRenameChat,
  onToggleExpanded,
}: ChatSidebarProps) {
  const sortedChats = Object.values(chats || {}).sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <>
      <motion.div
        initial={{ x: -256 }}
        animate={{ x: isExpanded ? 0 : -256 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 z-30 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <div className="flex flex-col h-full">
          <div className="p-4">
            <ChatToolbar onNewChat={onNewChat} />
          </div>
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence>
              {sortedChats.map((chat) => (
                <motion.div
                  key={chat.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChatHistoryItem
                    chat={chat}
                    isSelected={chat.id === currentChatId}
                    onSelect={() => onChatSelect(chat.id)}
                    onDelete={() => onDeleteChat(chat.id)}
                    onToggleFavorite={() => onToggleFavorite(chat.id)}
                    onRename={(newTitle) => onRenameChat(chat.id, newTitle)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
      <button
        onClick={() => onToggleExpanded(!isExpanded)}
        className={`fixed z-40 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg transition-all duration-300 ${
          isExpanded ? "left-64 ml-2" : "left-2"
        } top-2`}
      >
        {isExpanded ? (
          <svg
            className="w-6 h-6 text-gray-600 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-gray-600 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        )}
      </button>
    </>
  );
}
