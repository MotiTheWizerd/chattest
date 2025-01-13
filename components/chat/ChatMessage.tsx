import { SpeechControls } from "../speech/SpeechControls";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div
      className={`flex ${
        role === "user" ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          role === "user"
            ? "bg-blue-600 dark:bg-blue-700 text-white"
            : "bg-white dark:bg-gray-800 border dark:border-gray-700 dark:text-gray-200"
        }`}
      >
        <div className="flex items-start gap-2">
          <div className="whitespace-pre-wrap break-words flex-grow">
            {content}
          </div>
          {role === "assistant" && (
            <SpeechControls
              text={content}
              className="mt-1 flex-shrink-0"
              autoSpeak={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
