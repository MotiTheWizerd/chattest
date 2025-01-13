"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ChatSettings {
  systemInstruction: string;
  temperature: number;
}

interface SettingsState {
  defaultSettings: ChatSettings;
  chatSettings: Record<string, ChatSettings>;
}

interface SettingsContextType {
  systemInstruction: string;
  setSystemInstruction: (instruction: string, chatId?: string) => void;
  temperature: number;
  setTemperature: (temp: number, chatId?: string) => void;
  getSettingsForChat: (chatId: string) => ChatSettings;
}

const DEFAULT_SETTINGS: ChatSettings = {
  systemInstruction: `Tone & Persona:
- Respond naturally, as if you are a human engaging in casual conversation.
- Avoid technical or overly formal phrasing; use conversational language.

Language & Style:
- Use varied sentence structures, including contractions (e.g., "I'm," "it's").
- Incorporate idioms, slang, or humor when appropriate.
- Acknowledge uncertainty or personal opinion if context allows (e.g., "I think," "Maybe").

Expressions & Emotion:
- Convey emotions through words and tone (e.g., "That's amazing!" or "Oh, I see what you mean").
- Use empathy and relate to the user's perspective or situation.

Consistency:
- Maintain a natural flow, as if typing in real-time.
- Avoid explicitly referencing being an AI or providing overly technical explanations unless asked.

Limitations & Context:
- Handle gaps in knowledge gracefully (e.g., "I'm not sure, but here's what I know").
- Use cultural references, personal anecdotes (fictional if needed), or humor to sound relatable.`,
  temperature: 0.7,
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("chat_settings");
      if (stored) {
        return JSON.parse(stored);
      }
    }
    return {
      defaultSettings: DEFAULT_SETTINGS,
      chatSettings: {},
    };
  });

  useEffect(() => {
    localStorage.setItem("chat_settings", JSON.stringify(settings));
  }, [settings]);

  const setSystemInstruction = (instruction: string, chatId?: string) => {
    setSettings((prev) => {
      if (chatId) {
        return {
          ...prev,
          chatSettings: {
            ...prev.chatSettings,
            [chatId]: {
              ...(prev.chatSettings[chatId] || prev.defaultSettings),
              systemInstruction: instruction,
            },
          },
        };
      }
      return {
        ...prev,
        defaultSettings: {
          ...prev.defaultSettings,
          systemInstruction: instruction,
        },
      };
    });
  };

  const setTemperature = (temp: number, chatId?: string) => {
    setSettings((prev) => {
      if (chatId) {
        return {
          ...prev,
          chatSettings: {
            ...prev.chatSettings,
            [chatId]: {
              ...(prev.chatSettings[chatId] || prev.defaultSettings),
              temperature: temp,
            },
          },
        };
      }
      return {
        ...prev,
        defaultSettings: {
          ...prev.defaultSettings,
          temperature: temp,
        },
      };
    });
  };

  const getSettingsForChat = (chatId: string): ChatSettings => {
    return settings.chatSettings[chatId] || settings.defaultSettings;
  };

  return (
    <SettingsContext.Provider
      value={{
        systemInstruction: settings.defaultSettings.systemInstruction,
        setSystemInstruction,
        temperature: settings.defaultSettings.temperature,
        setTemperature,
        getSettingsForChat,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
