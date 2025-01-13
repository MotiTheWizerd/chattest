"use client";

import { useState } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { ChatPersona } from "@/types/chat";
import { useSpeech } from "@/hooks/useSpeech";

const PERSONAS: ChatPersona[] = ["Human", "Rapper", "Caveman"];
const SPEECH_RATES = [
  { value: 0.75, label: "Slow" },
  { value: 1, label: "Normal" },
  { value: 1.5, label: "Fast" },
  { value: 2, label: "Very Fast" },
];

interface SettingsProps {
  selectedPersona: ChatPersona;
  onPersonaChange: (persona: ChatPersona) => void;
  speechRate: number;
  onSpeechRateChange: (rate: number) => void;
}

export function Settings({
  selectedPersona,
  onPersonaChange,
  speechRate,
  onSpeechRateChange,
}: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { availableVoices, selectedVoice, setVoice, supported } = useSpeech();

  const handleSave = () => {
    setIsOpen(false);
  };

  const getCurrentRateLabel = () => {
    const rate = SPEECH_RATES.find((r) => r.value === speechRate);
    return rate?.label || "Normal";
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
        aria-label="Settings"
      >
        <Cog6ToothIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Chat Settings
            </h3>

            <div className="mb-4">
              <label
                htmlFor="persona"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                AI Persona
              </label>
              <select
                id="persona"
                value={selectedPersona}
                onChange={(e) => onPersonaChange(e.target.value as ChatPersona)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {PERSONAS.map((persona) => (
                  <option key={persona} value={persona}>
                    {persona}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Choose how you want the AI to respond to your messages.
              </p>
            </div>

            <div className="mb-4">
              <label
                htmlFor="voice"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Voice
              </label>
              <select
                id="voice"
                value={selectedVoice?.name || ""}
                onChange={(e) => {
                  const voice = availableVoices.find(
                    (v) => v.name === e.target.value
                  );
                  if (voice) setVoice(voice);
                }}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled={!supported || availableVoices.length === 0}
              >
                {availableVoices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Select the voice for speech synthesis.
              </p>
            </div>

            <div className="mb-4">
              <label
                htmlFor="speechRate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Speech Rate: {getCurrentRateLabel()}
              </label>
              <input
                type="range"
                id="speechRate"
                min="0"
                max="3"
                step="1"
                value={SPEECH_RATES.findIndex((r) => r.value === speechRate)}
                onChange={(e) =>
                  onSpeechRateChange(
                    SPEECH_RATES[parseInt(e.target.value)].value
                  )
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                {SPEECH_RATES.map((rate) => (
                  <span key={rate.value}>{rate.label}</span>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
