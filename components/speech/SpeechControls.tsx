"use client";

import { SpeakerXMarkIcon } from "@heroicons/react/24/outline";
import { useSpeech } from "@/hooks/useSpeech";
import { useState, useEffect } from "react";

interface SpeechControlsProps {
  text: string;
  className?: string;
  autoSpeak?: boolean;
}

export function SpeechControls({
  text,
  className = "",
  autoSpeak = false,
}: SpeechControlsProps) {
  const { speakText, stopSpeaking, speaking, supported } = useSpeech();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (autoSpeak && text && supported) {
      handleSpeak();
    }
  }, [text, autoSpeak, supported]);

  if (!supported) {
    return null;
  }

  const handleSpeak = () => {
    try {
      setError(null);
      speakText(text);
    } catch (err) {
      setError("Failed to start speech");
      console.error("Speech error:", err);
    }
  };

  // Only show controls if speaking (to allow stopping) or if there's an error
  if (!speaking && !error) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {speaking && (
        <button
          onClick={stopSpeaking}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          aria-label="Stop speaking"
          title="Stop speaking"
        >
          <SpeakerXMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      )}
      {error && (
        <span className="text-sm text-red-500" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
