import { create } from "zustand";

interface UserData {
  fullName: string;
  email: string;
  accountType: "Free" | "Pro";
  plan: string;
  provider: string;
  avatar?: string;
  dateJoined: string;
  lastLogin: string;
}

interface UserStore {
  user: UserData | null;
  setUser: (data: Partial<UserData>) => void;
  setFetchedUser: (data: UserData) => void;

  editProfileName: string;
  setEditProfileName: (name: string) => void;

  isEditProfileOpen: boolean;
  openEditProfile: () => void;
  closeEditProfile: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,

  setUser: (data) =>
    set((state) => ({ user: state.user ? { ...state.user, ...data } : null })),

  setFetchedUser: (data) => set({ user: data }),

  editProfileName: "",
  setEditProfileName: (name) => set({ editProfileName: name }),

  isEditProfileOpen: false,
  openEditProfile: () =>
    set((state) => ({
      isEditProfileOpen: true,
      editProfileName: state.user?.fullName || "",
    })),
  closeEditProfile: () => set({ isEditProfileOpen: false, editProfileName: "" }),
}));
