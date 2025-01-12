interface ChatToolbarProps {
  onNewChat: () => void;
}

export function ChatToolbar({ onNewChat }: ChatToolbarProps) {
  return (
    <div className="p-4">
      <button
        onClick={onNewChat}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
      >
        New Chat
      </button>
    </div>
  );
}
