"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useAuthStore } from "@/app/zustand/useAuthStore";
import { baseUrl } from "@/app/lib/baseUrl";

export default function useLogout() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const { accessToken, clearAuth } = useAuthStore.getState();

      if (accessToken) {
        fetch(`${baseUrl}/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
        }).catch(() => {});
      }

      clearAuth();
      router.push("/auth");
    } catch {
      useAuthStore.getState().clearAuth();
      router.push("/auth");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return { handleLogout, isLoggingOut };
}
