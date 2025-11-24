import { create } from "zustand";

interface UserData {
  fullName: string;
  username: string;
  email: string;
  provider: "Google" | "Email" | "Phone";
  avatar?: string;
}

interface UserStore {
  user: UserData | null;
  setUser: (data: Partial<UserData>) => void;

  isEditProfileOpen: boolean;
  openEditProfile: () => void;
  closeEditProfile: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,

  setUser: (data) =>
    set((state) => ({ user: state.user ? { ...state.user, ...data } : null })),

  isEditProfileOpen: false,
  openEditProfile: () => set({ isEditProfileOpen: true }),
  closeEditProfile: () => set({ isEditProfileOpen: false }),
}));
