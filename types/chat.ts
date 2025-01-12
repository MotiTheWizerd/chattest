export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
}

export interface ChatHistory {
  id: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  title?: string;
  isFavorite?: boolean;
}

export interface ChatStore {
  currentChatId: string | null;
  chats: Record<string, ChatHistory>;
}
