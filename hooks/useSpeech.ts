import { useCallback, useEffect, useState, useRef } from "react";

interface UseSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
}

// Get the global speech rate from localStorage or default to 1
const getGlobalSpeechRate = () => {
  if (typeof window === "undefined") return 1;
  return parseFloat(localStorage.getItem("speechRate") || "1");
};

// Get the global voice from localStorage
const getGlobalVoice = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("selectedVoice") || null;
};

// Set the global voice in localStorage
const setGlobalVoice = (voiceName: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("selectedVoice", voiceName);
  }
};

export function useSpeech(options: UseSpeechOptions = {}) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  const defaultOptions = {
    rate: getGlobalSpeechRate(),
    pitch: 1,
    volume: 1,
    ...options,
  };

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthesisRef.current = window.speechSynthesis;
      setSupported(!!window.speechSynthesis);
    }
  }, []);

  // Find and set voices
  useEffect(() => {
    if (!supported || !synthesisRef.current) return;

    const synthesis = synthesisRef.current;

    const handleVoicesChanged = () => {
      const voices = synthesis.getVoices();
      // Filter for English voices
      const englishVoices = voices.filter((v) => v.lang.startsWith("en-"));
      setAvailableVoices(englishVoices);

      // Try to restore previously selected voice
      const savedVoiceName = getGlobalVoice();
      if (savedVoiceName) {
        const savedVoice = englishVoices.find((v) => v.name === savedVoiceName);
        if (savedVoice) {
          setSelectedVoice(savedVoice);
          return;
        }
      }

      // Default to Microsoft voice or first English voice if no saved voice
      const defaultVoice =
        englishVoices.find((v) => v.name.includes("Microsoft")) ||
        englishVoices[0];
      if (defaultVoice) {
        setSelectedVoice(defaultVoice);
        setGlobalVoice(defaultVoice.name);
      }
    };

    // Try to get voices immediately
    handleVoicesChanged();

    // Set up the event listener for voice loading
    synthesis.addEventListener("voiceschanged", handleVoicesChanged);

    return () => {
      synthesis.removeEventListener("voiceschanged", handleVoicesChanged);
    };
  }, [supported]);

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
    setGlobalVoice(voice.name);
  }, []);

  const speakText = useCallback(
    (text: string) => {
      if (!supported || !synthesisRef.current) {
        console.warn("Speech synthesis is not supported in this browser");
        return;
      }

      const synthesis = synthesisRef.current;

      // Cancel any ongoing speech
      synthesis.cancel();

      try {
        const utterance = new SpeechSynthesisUtterance(text);

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        utterance.rate = getGlobalSpeechRate();
        utterance.pitch = defaultOptions.pitch;
        utterance.volume = defaultOptions.volume;

        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
          console.error("Speech synthesis error:", event.error);
          setSpeaking(false);
        };

        synthesis.speak(utterance);
      } catch (error) {
        console.error("Failed to initialize speech:", error);
        setSpeaking(false);
      }
    },
    [supported, selectedVoice, defaultOptions]
  );

  const stopSpeaking = useCallback(() => {
    if (supported && speaking && synthesisRef.current) {
      synthesisRef.current.cancel();
      setSpeaking(false);
    }
  }, [supported, speaking]);

  return {
    speakText,
    stopSpeaking,
    speaking,
    supported,
    selectedVoice,
    availableVoices,
    setVoice,
  };
}
