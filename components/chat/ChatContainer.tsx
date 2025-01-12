import { useEffect, useRef } from "react";
import { ChatMessageList } from "./ChatMessageList";
import { LoadingIndicator } from "../ui/LoadingIndicator";
import type { ChatContainerProps } from "@/types/chat";

export function ChatContainer({ messages, isLoading }: ChatContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isLoading]); // Scroll when messages or loading state changes

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-4">
      <ChatMessageList messages={messages} />
      {isLoading && <LoadingIndicator />}
    </div>
  );
}
