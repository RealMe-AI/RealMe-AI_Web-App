
import { useEffect, useRef, useState } from "react";
import { useLanguageStore } from "../store/useLanguageStore";

function getSpeechRecognition(): any {
  if (typeof window === "undefined") return null;
  return (
    (window as any).SpeechRecognition ??
    (window as any).webkitSpeechRecognition ??
    null
  );
}

export const useVoiceInput = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setIsSupported(!!getSpeechRecognition());
  }, []);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startRecording = () => {
    setError(null);
    setTranscript(null);
    setSeconds(0);
    setIsTranscribing(false);

    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    const speechLangMap: Record<string, string> = {
      en: "en-US",
      ha: "ha-NG",
      ig: "ig-NG",
      yo: "yo-NG",
    };

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      const { language } = useLanguageStore.getState();
      recognition.lang = speechLangMap[language] || "en-US";

      recognition.onresult = (event: any) => {
        let finalText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalText += event.results[i][0].transcript;
          }
        }
        if (finalText) {
          setTranscript((prev) => (prev || "") + finalText);
        }
      };

      recognition.onerror = (event: any) => {
        setError(`Speech recognition error: ${event.error}`);
      };

      recognition.onend = () => {
        setIsRecording(false);
        stopTimer();
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
      startTimer();
    } catch (err) {
      console.error("Speech recognition error:", err);
      setError("Failed to start speech recognition.");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
    stopTimer();
    setIsTranscribing(true);
    setTimeout(() => setIsTranscribing(false), 400);
  };

  const cleanup = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsRecording(false);
    setSeconds(0);
    setTranscript(null);
    setError(null);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return {
    isSupported,
    isRecording,
    isTranscribing,
    seconds,
    transcript,
    error,
    startRecording,
    stopRecording,
    cleanup,
    formatTime,
  };
};
