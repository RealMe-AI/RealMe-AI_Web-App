import { create } from "zustand";

// zustand/dashboard
interface ModalState {
  isProfileOpen: boolean;
  isAccountInfoOpen: boolean;
  isSettingsOpen: boolean;
  openProfile: () => void;
  closeProfile: () => void;
  openAccountInfo: () => void;
  closeAccountInfo: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  closeAll: () => void;
}

const useModalStore = create<ModalState>((set) => ({
  isProfileOpen: false,
  isAccountInfoOpen: false,
  isSettingsOpen: false,

  openProfile: () =>
    set(() => ({
      isProfileOpen: true,
      isAccountInfoOpen: false,
      isSettingsOpen: false,
    })),
  closeProfile: () => set({ isProfileOpen: false }),

  openAccountInfo: () =>
    set(() => ({
        isAccountInfoOpen: true,
      isProfileOpen: false,
      isSettingsOpen: false,
    })),
  closeAccountInfo: () => set({ isAccountInfoOpen: false }),

  openSettings: () =>
    set(() => ({
      isSettingsOpen: true,
      isProfileOpen: false,
      isAccountInfoOpen: false,
    })),
  closeSettings: () => set({ isSettingsOpen: false }),

  closeAll: () =>
    set({
      isProfileOpen: false,
      isAccountInfoOpen: false,
      isSettingsOpen: false,
    }),
}));

export default useModalStore;
