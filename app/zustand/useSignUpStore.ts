"use client";

import { create } from "zustand";

type Method = "email" | "phone";

interface SignUpStore {
  contact: string | null;      // email OR phone (top-level)
  method: Method | null;       // "email" or "phone"

  setSignUpData: (payload: { contact: string; method: Method }) => void;
  clearSignUpData: () => void;
}

export const useSignUpStore = create<SignUpStore>((set) => ({
  contact: null,
  method: null,

  setSignUpData: ({ contact, method }) =>
    set(() => ({
      contact,
      method,
    })),

  clearSignUpData: () =>
    set(() => ({
      contact: null,
      method: null,
    })),
}));
