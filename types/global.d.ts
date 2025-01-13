interface SpeechSynthesisVoice {
  default: boolean;
  lang: string;
  localService: boolean;
  name: string;
  voiceURI: string;
}

interface SpeechSynthesisUtterance extends EventTarget {
  lang: string;
  pitch: number;
  rate: number;
  text: string;
  voice: SpeechSynthesisVoice | null;
  volume: number;
  onstart: (event: Event) => void;
  onend: (event: Event) => void;
  onerror: (event: Event) => void;
  onpause: (event: Event) => void;
  onresume: (event: Event) => void;
}

interface SpeechSynthesis {
  paused: boolean;
  pending: boolean;
  speaking: boolean;
  getVoices(): SpeechSynthesisVoice[];
  speak(utterance: SpeechSynthesisUtterance): void;
  cancel(): void;
  pause(): void;
  resume(): void;
  onvoiceschanged: ((this: SpeechSynthesis, ev: Event) => any) | null;
}

interface Window {
  speechSynthesis: SpeechSynthesis;
  SpeechSynthesisUtterance: {
    prototype: SpeechSynthesisUtterance;
    new (text?: string): SpeechSynthesisUtterance;
  };
}
