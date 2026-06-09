"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { baseUrl } from "@/app/lib/baseUrl";
import { useAuthStore } from "@/app/zustand/useAuthStore";

export function useAvatarEditor() {
  const t = useTranslations();

  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =======================
     POST: upload new avatar
     ======================= */
  const uploadAvatar = async (croppedImg: string): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);

      const blob = await (await fetch(croppedImg)).blob();
      const formData = new FormData();
      formData.append("file", blob, "avatar.png");

      const token = useAuthStore.getState().accessToken;

      const res = await fetch(`${baseUrl}/users/profile/upload-picture`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!res.ok) {
        let errorMsg = t("modal.avatar_upload_failed");
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || errorData.error || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      const data = await res.json();

      // Update local avatar state directly
      // Note: POST /upload-picture returns 'pictureUrl', explicitly different from GET /profile which returns 'picture'
      const newUrl = data.pictureUrl;
      setAvatar(newUrl);
      return newUrl;
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : t("modal.avatar_upload_failed")
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    avatar,
    setAvatar,
    uploadAvatar,
    loading,
    error,
  };
}
