import { PlusIcon } from "@heroicons/react/24/outline";

interface ChatToolbarProps {
  onNewChat: () => void;
}

export function ChatToolbar({ onNewChat }: ChatToolbarProps) {
  return (
    <div className="p-2">
      <button
        onClick={onNewChat}
        className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md border border-gray-200 dark:border-gray-600 transition-colors duration-200"
      >
        <PlusIcon className="w-4 h-4" />
        <span>New Chat</span>
      </button>
    </div>
  );
}
