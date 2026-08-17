"use client";

import { create } from "zustand";
import { baseUrl } from "@/app/lib/baseUrl";
import { authFetch } from "@/app/lib/apiClient";
import { useTtsStore, mapSpeed } from "@/app/store/useTtsStore";
import { getCachedBlob, cacheAudio } from "@/app/store/ttsPrefetch";

let currentAudio: HTMLAudioElement | null = null;
let currentAbort: AbortController | null = null;
let currentObjectUrl: string | null = null;
let requestToken = 0;

function revokeObjectUrl(url: string | null) {
  if (url) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // no-op
    }
  }
}

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
    revokeObjectUrl(currentObjectUrl);
    currentObjectUrl = null;
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

    const finish = () => {
      if (token === requestToken) {
        currentAudio = null;
        currentAbort = null;
        set({ isLoading: false, isSpeaking: false, messageId: null });
      }
    };

    // (1) Cached audio -> play instantly, no network round-trip
    const cachedBlob = getCachedBlob(messageId);
    if (cachedBlob) {
      const url = URL.createObjectURL(cachedBlob);
      const audio = new Audio(url);
      currentAudio = audio;
      currentObjectUrl = url;

      const { speed } = useTtsStore.getState();
      audio.playbackRate = mapSpeed(speed);

      audio.onended = () => {
        revokeObjectUrl(currentObjectUrl);
        currentObjectUrl = null;
        finish();
      };
      audio.onerror = () => {
        console.error("TTS audio playback failed for message", messageId);
        revokeObjectUrl(currentObjectUrl);
        currentObjectUrl = null;
        finish();
      };

      try {
        await audio.play();
      } catch (err) {
        console.error("TTS audio playback failed for message", messageId, err);
        revokeObjectUrl(currentObjectUrl);
        currentObjectUrl = null;
        finish();
        return;
      }

      if (token === requestToken) {
        set({ isLoading: false, isSpeaking: true });
      }
      return;
    }

    // (2) Not cached -> request from server, cache for next time
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

      // Fire-and-forget cache fill so the NEXT click is instant
      await cacheAudio(messageId, audioUrl);

      const audio = new Audio(audioUrl);
      currentAudio = audio;

      const { speed } = useTtsStore.getState();
      audio.playbackRate = mapSpeed(speed);

      audio.onended = finish;
      audio.onerror = () => {
        console.error("TTS audio playback failed for message", messageId);
        finish();
      };

      await audio.play();

      if (token === requestToken) {
        set({ isLoading: false, isSpeaking: true });
      }
    } catch (err) {
      if (token === requestToken) {
        console.error("TTS error:", err);
        finish();
      }
    }
  },
}));