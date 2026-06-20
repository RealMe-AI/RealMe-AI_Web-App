"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface TtsState {
  enabled: boolean;
  speed: number;
  autoRead: boolean;
  setEnabled: (v: boolean) => void;
  setSpeed: (v: number) => void;
  setAutoRead: (v: boolean) => void;
}

export const useTtsStore = create<TtsState>()(
  persist(
    (set) => ({
      enabled: false,
      speed: 5,
      autoRead: false,
      setEnabled: (v) => set({ enabled: v }),
      setSpeed: (v) => set({ speed: v }),
      setAutoRead: (v) => set({ autoRead: v }),
    }),
    {
      name: "realme-tts",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function mapSpeed(level: number): number {
  return 0.5 + (level - 1) * (1.5 / 9);
}
