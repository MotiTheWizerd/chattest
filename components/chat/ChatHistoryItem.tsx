import { useState } from "react";
import { ChatHistory } from "@/types/chat";
import { PencilIcon, TrashIcon, StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

interface ChatHistoryItemProps {
  chat: ChatHistory;
  isActive: boolean;
  onSelect: (chatId: string) => void;
  onDelete: (chatId: string) => void;
  onRename: (chatId: string, newTitle: string) => void;
  onToggleFavorite: (chatId: string) => void;
}

export function ChatHistoryItem({
  chat,
  isActive,
  onSelect,
  onDelete,
  onRename,
  onToggleFavorite,
}: ChatHistoryItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(
    chat.title || chat.messages[0]?.content.slice(0, 20) || "New Chat"
  );

  const handleRename = () => {
    onRename(chat.id, title);
    setIsEditing(false);
  };

  return (
    <div
      className={`group flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
        isActive ? "bg-gray-100 dark:bg-gray-700" : ""
      }`}
    >
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => e.key === "Enter" && handleRename()}
          className="flex-1 p-1 mr-2 text-sm bg-white dark:bg-gray-600 border rounded"
          autoFocus
        />
      ) : (
        <button
          onClick={() => onSelect(chat.id)}
          className="flex-1 text-left mr-2"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="truncate max-w-[120px]">{title}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              {new Date(chat.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </button>
      )}

      <div className="flex gap-1">
        <button
          onClick={() => onToggleFavorite(chat.id)}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          aria-label={
            chat.isFavorite ? "Remove from favorites" : "Add to favorites"
          }
        >
          {chat.isFavorite ? (
            <StarIconSolid className="w-4 h-4 text-yellow-400" />
          ) : (
            <StarIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          )}
        </button>
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          aria-label="Rename chat"
        >
          <PencilIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
        <button
          onClick={() => onDelete(chat.id)}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          aria-label="Delete chat"
        >
          <TrashIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
    </div>
  );
}
