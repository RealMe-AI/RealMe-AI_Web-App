"use client";

import { useCallback, useRef, useState } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { authFetch } from "@/app/lib/apiClient";
import { useTtsStore, mapSpeed } from "@/app/store/useTtsStore";

let currentAudio: HTMLAudioElement | null = null;

export function useTtsSpeak() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const currentIdRef = useRef<string | null>(null);

  const stop = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    currentIdRef.current = null;
    setIsSpeaking(false);
    setCurrentMessageId(null);
  }, []);

  const speak = useCallback(
    async (messageId: string) => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }

      currentIdRef.current = messageId;
      setCurrentMessageId(messageId);
      setIsSpeaking(true);
      setError(null);

      try {
        const res = await authFetch(
          `${baseUrl}/tts/messages/${messageId}/speak`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: "{}",
          },
        );

        if (!res.ok) throw new Error(`TTS request failed: ${res.status}`);

        const { audioUrl } = await res.json();

        // updateMessage(messageId, { audioUrl });

        const audio = new Audio(audioUrl);
        currentAudio = audio;

        const { speed } = useTtsStore.getState();
        audio.playbackRate = mapSpeed(speed);

        audio.onended = () => {
          if (currentIdRef.current === messageId) {
            currentAudio = null;
            currentIdRef.current = null;
            // updateMessage(messageId, { audioUrl: undefined });
            setIsSpeaking(false);
            setCurrentMessageId(null);
          }
        };

        audio.onerror = () => {
          console.error("TTS audio playback failed for message", messageId);
          if (currentIdRef.current === messageId) {
            currentAudio = null;
            currentIdRef.current = null;
            // updateMessage(messageId, { audioUrl: undefined });
            setIsSpeaking(false);
            setCurrentMessageId(null);
          }
        };

        await audio.play();
      } catch (err) {
        console.error("TTS error:", err);
        if (currentIdRef.current === messageId) {
          currentAudio = null;
          currentIdRef.current = null;
          // updateMessage(messageId, { audioUrl: undefined });
          setIsSpeaking(false);
          setCurrentMessageId(null);
        }
      }
    },
    [],
  );

  return { speak, stop, isSpeaking, currentMessageId, error };
}
