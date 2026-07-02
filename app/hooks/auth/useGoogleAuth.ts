"use client";

import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "@/i18n/routing";
import { baseUrl } from "@/app/lib/baseUrl";
import { useAuthStore } from "@/app/store/useAuthStore";

interface TokenResponseWithIdToken {
  access_token: string;
  expires_in: number;
  prompt: string;
  token_type: string;
  scope: string;
  id_token?: string;
}

export default function useGoogleAuth() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = useGoogleLogin({
    flow: "implicit",
    scope: "openid email profile",
    onSuccess: async (tokenResponse) => {
      const { id_token: idToken } =
        tokenResponse as TokenResponseWithIdToken;

      if (!idToken) {
        setError("No ID token received");
        return;
      }

      const res = await fetch(`${baseUrl}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        setError("Login failed");
        return;
      }

      const data = await res.json();
      useAuthStore.getState().setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      router.replace("/d");
    },
    onError: () => setError("Google sign-in failed"),
  });

  return { signInWithGoogle, error };
}
