"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  isOpen: boolean;
  autoFocusSearch: boolean;
  setIsOpen: (state: boolean) => void;
  setAutoFocusSearch: (state: boolean) => void;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: false,
      autoFocusSearch: false,

      setIsOpen: (state) => set({ isOpen: state }),
      setAutoFocusSearch: (state) => set({ autoFocusSearch: state }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),

    {
      name: "s_bar",
      partialize: (state) => ({ isOpen: state.isOpen }),
    }
  )
);
