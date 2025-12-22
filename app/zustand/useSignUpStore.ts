"use client";

import { create } from "zustand";

type Method = "email" | "phone";

interface SignUpStore {
  contact: string | null; // email OR phone (top-level)
  method: Method | null; // "email" or "phone"
  userId: string | null; // userId from registration response

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
