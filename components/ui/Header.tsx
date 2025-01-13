import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import { Settings } from "./Settings";
import { ChatPersona } from "@/types/chat";

interface HeaderProps {
  selectedPersona: ChatPersona;
  onPersonaChange: (persona: ChatPersona) => void;
  speechRate: number;
  onSpeechRateChange: (rate: number) => void;
}

export function Header({
  selectedPersona,
  onPersonaChange,
  speechRate,
  onSpeechRateChange,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <Image
          src="/next.svg"
          alt="Logo"
          width={80}
          height={20}
          className="dark:invert"
        />
        <span className="font-semibold text-xl text-gray-800 dark:text-white">
          Chat
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Settings
          selectedPersona={selectedPersona}
          onPersonaChange={onPersonaChange}
          speechRate={speechRate}
          onSpeechRateChange={onSpeechRateChange}
        />
        <ThemeToggle />
      </div>
    </header>
  );
}
