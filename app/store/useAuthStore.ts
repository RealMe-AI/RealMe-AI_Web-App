"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  setTokens: (tokens: { accessToken: string; refreshToken?: string }) => void;
  clearAuth: () => void;
  isTokenExpired: () => boolean;
}

function decodeTokenPayload(token: string): Record<string, unknown> | null {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

function decodeTokenExpiry(token: string): number | null {
  const payload = decodeTokenPayload(token);
  return payload?.exp ? (payload.exp as number) * 1000 : null;
}

export function getUserIdFromToken(): string | null {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) return null;
  const payload = decodeTokenPayload(accessToken);
  return (payload?.sub as string) || (payload?.id as string) || null;
}


export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      expiresAt: null,

      setTokens: (tokens) =>
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken ?? get().refreshToken,
          expiresAt: decodeTokenExpiry(tokens.accessToken),
        }),

      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
        }),

      isTokenExpired: () => {
        const { expiresAt } = get();
        if (!expiresAt) return true;
        return Date.now() >= expiresAt - 30_000;
      },
    }),
    {
      name: "ah",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
