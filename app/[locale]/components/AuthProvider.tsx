"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const { accessToken, refreshToken, isTokenExpired, clearAuth } =
      useAuthStore.getState();

    if (accessToken && isTokenExpired() && !refreshToken) {
      clearAuth();
    }
  }, []);

  return <>{children}</>;
}
