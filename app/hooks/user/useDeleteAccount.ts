"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { baseUrl } from "@/app/lib/baseUrl";
import { authFetch } from "@/app/lib/apiClient";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useUserStore } from "@/app/store/useUserStore";

function requestGoogleAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    const g = (window as { google?: { accounts: { oauth2: Record<string, unknown> } } }).google;
    if (!g?.accounts?.oauth2) {
      reject(new Error("Google OAuth is not available. Are you signed into Google?"));
      return;
    }
    const initTokenClient = g.accounts.oauth2.initTokenClient as (
      config: Record<string, unknown>,
    ) => { requestAccessToken: () => void };
    const client = initTokenClient({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      scope: "https://www.googleapis.com/auth/userinfo.email",
      callback: (res: { access_token?: string }) => {
        if (res.access_token) resolve(res.access_token);
        else reject(new Error("Failed to get Google access token"));
      },
      error_callback: (err: { message?: string }) =>
        reject(new Error(err?.message || "Google authorization was denied")),
    });
    client.requestAccessToken();
  });
}

export default function useDeleteAccount() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);

      const user = useUserStore.getState().user;
      const isGoogleUser = user?.provider === "auth.identifier.google";

      const body: Record<string, string> = {};
      if (isGoogleUser) {
        body.googleAccessToken = await requestGoogleAccessToken();
      }

      const res = await authFetch(`${baseUrl}/users/profile`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        let errorMsg = "Failed to delete account";
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || errorData.error || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      useAuthStore.getState().clearAuth();
      router.push("/auth");
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return { handleDeleteAccount, isDeleting };
}
