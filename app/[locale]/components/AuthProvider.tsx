"use client";

import { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useAuthStore } from "@/app/store/useAuthStore";
import { doRefresh } from "@/app/lib/apiClient";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { accessToken, refreshToken, isTokenExpired } =
        useAuthStore.getState();

      if (accessToken && !isTokenExpired()) {
        setIsReady(true);
        return;
      }

      if (refreshToken) {
        await doRefresh();
      }

      setIsReady(true);
    };

    init();
  }, []);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {isReady ? children : null}
    </GoogleOAuthProvider>
  );
}
