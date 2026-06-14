"use client";

import { useState } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { authFetch } from "@/app/lib/apiClient";
import { useUserStore } from "@/app/store/useUserStore";

interface UpdateProfileResponse {
  name?: string;
  picture?: string;
  preferences?: {
    theme?: string;
    language?: string;
    aiModel?: string;
  };
  message?: string;
}

export default function useUpdateProfile() {
  const { setUser } = useUserStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (name: string) => {
    try {
      setIsUpdating(true);
      setError(null);

      const res = await authFetch(`${baseUrl}/users/profile`, {
        method: "PATCH",
        body: JSON.stringify({ name }),
      });

      const data: UpdateProfileResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setUser({ fullName: data.name || name });
      return true;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to update profile";
      setError(msg);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateProfile, isUpdating, error };
}
