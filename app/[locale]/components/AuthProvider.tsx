"use client";

import { useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useAuthStore } from "@/app/store/useAuthStore";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const { accessToken, refreshToken, isTokenExpired, clearAuth } =
      useAuthStore.getState();

    if (accessToken && isTokenExpired() && !refreshToken) {
      clearAuth();
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
