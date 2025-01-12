interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div
      className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          role === "user"
            ? "bg-blue-600 dark:bg-blue-700 text-white"
            : "bg-white dark:bg-gray-800 border dark:border-gray-700 dark:text-gray-200"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
