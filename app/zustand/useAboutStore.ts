import { create } from "zustand";
import { type AboutStore } from "../types/type";


export const useAboutStore = create<AboutStore>((set) => ({
   isOpen: false,

  openAbout: () => set({ isOpen: true }),
  closeAbout: () => set({ isOpen: false }),
}));
