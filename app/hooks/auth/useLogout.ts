"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useAuthStore } from "@/app/store/useAuthStore";
import { resetDashboardUi } from "@/app/store/useResetDashboardUi";
import { baseUrl } from "@/app/lib/baseUrl";

export default function useLogout() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      const { accessToken } = useAuthStore.getState();

      if (accessToken) {
        try {
          await fetch(`${baseUrl}/auth/logout`, {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        } catch {
          // Server-side logout is best-effort; local state is cleared regardless
        }
      }
    } finally {
      useAuthStore.getState().clearAuth();
      resetDashboardUi();
      router.replace("/auth");
      setIsLoggingOut(false);
    }
  };

  return { handleLogout, isLoggingOut };
}