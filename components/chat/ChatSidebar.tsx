import { ChatHistory } from "@/types/chat";
import { ChatToolbar } from "./ChatToolbar";

interface ChatSidebarProps {
  chats: Record<string, ChatHistory>;
  currentChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
}

export function ChatSidebar({
  chats,
  currentChatId,
  onChatSelect,
  onNewChat,
}: ChatSidebarProps) {
  return (
    <div className="w-64 border-r dark:border-gray-700 bg-white dark:bg-gray-800">
      <ChatToolbar onNewChat={onNewChat} />
      <div className="overflow-y-auto h-[calc(100vh-5rem)]">
        {Object.values(chats)
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
          .map((chat) => (
            <button
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`w-full p-4 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                currentChatId === chat.id ? "bg-gray-100 dark:bg-gray-700" : ""
              }`}
            >
              <div className="font-medium truncate">
                {chat.title ||
                  chat.messages[0]?.content.slice(0, 30) ||
                  "New Chat"}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(chat.updatedAt).toLocaleDateString()}
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}
