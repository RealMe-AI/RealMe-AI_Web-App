"use client";

import { create } from "zustand";

interface LightboxState {
  src: string | null;
  open: (src: string) => void;
  close: () => void;
}

export const useLightboxStore = create<LightboxState>((set) => ({
  src: null,
  open: (src) => set({ src }),
  close: () => set({ src: null }),
}));
