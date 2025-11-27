import { create } from "zustand";

export const useAboutStore = create((set) => ({
  showAbout: false,
  openAbout: () => set({ showAbout: true }),
  closeAbout: () => set({ showAbout: false }),
}));
