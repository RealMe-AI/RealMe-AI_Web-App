"use client";

import { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useAuthStore } from "@/app/store/useAuthStore";
import { ensureFreshToken } from "@/app/lib/apiClient";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!useAuthStore.persist.hasHydrated()) {
        await new Promise<void>((resolve) => {
          const unsub = useAuthStore.persist.onFinishHydration(() => {
            unsub();
            resolve();
          });
        });
      }

      const { accessToken, isTokenExpired } = useAuthStore.getState();

      if (accessToken && !isTokenExpired()) {
        setIsReady(true);
        return;
      }

      await ensureFreshToken();

      setIsReady(true);
    };

    init();
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== "au" || !e.newValue) return;
      try {
        const state = JSON.parse(e.newValue).state;
        if (state?.accessToken) {
          useAuthStore.getState().setTokens({
            accessToken: state.accessToken,
            refreshToken: state.refreshToken,
          });
        }
      } catch {
        // ignore malformed storage payloads
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {isReady ? (
        children
      ) : (
        <div className="h-dvh w-full flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </GoogleOAuthProvider>
  );
}
