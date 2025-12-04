"use client";

import { create } from "zustand";

interface SignUpData {
  contact: string;          // the email OR phone number
  method: "email" | "phone";  
}

interface SignUpStore {
  data: SignUpData | null;
  setSignUpData: (payload: SignUpData) => void;
  clearSignUpData: () => void;
}

export const useSignUpStore = create<SignUpStore>((set) => ({
  data: null,

  setSignUpData: (payload) => set({ data: payload }),

  clearSignUpData: () => set({ data: null }),
}));
