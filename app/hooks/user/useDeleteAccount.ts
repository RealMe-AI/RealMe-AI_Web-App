"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { baseUrl } from "@/app/lib/baseUrl";
import { authFetch } from "@/app/lib/apiClient";
import { useAuthStore, getUserIdFromToken } from "@/app/zustand/useAuthStore";

export default function useDeleteAccount() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);

      const userId = getUserIdFromToken();
      if (!userId) throw new Error("User ID not found");

      const res = await authFetch(`${baseUrl}/users/profile`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
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
