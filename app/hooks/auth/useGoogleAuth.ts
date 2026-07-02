"use client";

import { useState } from "react";
import type { CredentialResponse } from "@react-oauth/google";
import { useRouter } from "@/i18n/routing";
import { baseUrl } from "@/app/lib/baseUrl";
import { useAuthStore } from "@/app/store/useAuthStore";

export default function useGoogleAuth() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleCredentialResponse = async (
    credentialResponse: CredentialResponse,
  ) => {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      setError("No credential received");
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
  };

  return { handleCredentialResponse, error, clearError: () => setError(null) };
}
