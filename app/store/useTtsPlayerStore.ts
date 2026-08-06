"use client";

import { create } from "zustand";
import { baseUrl } from "@/app/lib/baseUrl";
import { authFetch } from "@/app/lib/apiClient";
import { useTtsStore, mapSpeed } from "@/app/store/useTtsStore";

let currentAudio: HTMLAudioElement | null = null;
let currentAbort: AbortController | null = null;
let requestToken = 0;

interface TtsPlayerState {
  isLoading: boolean;
  isSpeaking: boolean;
  messageId: string | null;
  speak: (messageId: string) => Promise<void>;
  stop: () => void;
}

export const useTtsPlayerStore = create<TtsPlayerState>((set, get) => ({
  isLoading: false,
  isSpeaking: false,
  messageId: null,

  stop: () => {
    requestToken++;
    if (currentAbort) {
      currentAbort.abort();
      currentAbort = null;
    }
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    set({ isLoading: false, isSpeaking: false, messageId: null });
  },

  speak: async (messageId: string) => {
    get().stop();

    const token = ++requestToken;
    const abort = new AbortController();
    currentAbort = abort;

    set({ isLoading: true, isSpeaking: false, messageId });

    try {
      const res = await authFetch(
        `${baseUrl}/tts/messages/${messageId}/speak`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}",
          signal: abort.signal,
        },
      );

      if (token !== requestToken) return;
      if (!res.ok) throw new Error(`TTS request failed: ${res.status}`);

      const { audioUrl } = await res.json();
      if (token !== requestToken) return;

      const audio = new Audio(audioUrl);
      currentAudio = audio;

      const { speed } = useTtsStore.getState();
      audio.playbackRate = mapSpeed(speed);

      audio.onended = () => {
        if (token === requestToken) {
          currentAudio = null;
          currentAbort = null;
          set({ isLoading: false, isSpeaking: false, messageId: null });
        }
      };

      audio.onerror = () => {
        console.error("TTS audio playback failed for message", messageId);
        if (token === requestToken) {
          currentAudio = null;
          currentAbort = null;
          set({ isLoading: false, isSpeaking: false, messageId: null });
        }
      };

      await audio.play();

      if (token === requestToken) {
        set({ isLoading: false, isSpeaking: true });
      }
    } catch (err) {
      if (token === requestToken) {
        console.error("TTS error:", err);
        currentAudio = null;
        currentAbort = null;
        set({ isLoading: false, isSpeaking: false, messageId: null });
      }
    }
  },
}));
