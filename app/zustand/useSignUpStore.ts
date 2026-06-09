"use client";

import { create } from "zustand";

type Method = "email" | "phone";

interface SignUpStore {
  contact: string | null;
  method: Method | null;
  userId: string | null;

  setSignUpData: (payload: {
    contact: string;
    method: Method;
    userId: string;
  }) => void;
  clearSignUpData: () => void;
}

export const useSignUpStore = create<SignUpStore>((set) => ({
  contact: null,
  method: null,
  userId: null,

  setSignUpData: ({ contact, method, userId }) =>
    set(() => ({
      contact,
      method,
      userId,
    })),

  clearSignUpData: () =>
    set(() => ({
      contact: null,
      method: null,
      userId: null,
    })),
}));
