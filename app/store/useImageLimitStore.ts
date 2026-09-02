"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IMAGE_RESET_HOURS } from "@/app/lib/constants";

interface ImageLimitState {
  imageUploadTimes: Map<string, number>;
  addImage: (id: string) => void;
  addImages: (ids: string[]) => void;
  removeImage: (id: string) => void;
  pruneExpired: () => void;
  clear: () => void;
}

export const useImageLimitStore = create<ImageLimitState>()(
  persist(
    (set) => ({
      imageUploadTimes: new Map<string, number>(),

      addImage: (id) =>
        set((state) => {
          const next = new Map(state.imageUploadTimes);
          next.set(id, Date.now());
          return { imageUploadTimes: next };
        }),

      addImages: (ids) =>
        set((state) => {
          const next = new Map(state.imageUploadTimes);
          const now = Date.now();
          ids.forEach((id) => next.set(id, now));
          return { imageUploadTimes: next };
        }),

      removeImage: (id) =>
        set((state) => {
          const next = new Map(state.imageUploadTimes);
          next.delete(id);
          return { imageUploadTimes: next };
        }),

      pruneExpired: () =>
        set((state) => {
          const now = Date.now();
          const limit = IMAGE_RESET_HOURS * 3600 * 1000;
          const next = new Map(state.imageUploadTimes);
          let changed = false;
          next.forEach((t, key) => {
            if (now - t > limit) {
              next.delete(key);
              changed = true;
            }
          });
          return changed ? { imageUploadTimes: next } : state;
        }),

      clear: () => set({ imageUploadTimes: new Map() }),
    }),
    {
      name: "rm.ipTimes",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        imageUploadTimes: Array.from(state.imageUploadTimes.entries()),
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as unknown as {
          imageUploadTimes?: [string, number][];
        };
        const entries = persisted?.imageUploadTimes ?? [];
        const now = Date.now();
        const limit = IMAGE_RESET_HOURS * 3600 * 1000;
        const pruned = entries.filter(([, t]) => now - t <= limit);
        return {
          ...currentState,
          ...(persistedState as object),
          imageUploadTimes: new Map<string, number>(pruned),
        };
      },
    },
  ),
);
