"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { baseUrl } from "@/app/lib/baseUrl";

export function useAvatarEditor() {
  const t = useTranslations();

  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =======================
     GET: fetch user picture
     ======================= */
  const fetchAvatar = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("accessToken");

      const res = await fetch(`${baseUrl}/users/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) {
        let errorMsg = "Failed to fetch avatar";
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || errorData.error || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      const data = await res.json();

      // Only what we care about
      setAvatar(data.picture || "/avatar.png");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unable to load avatar");
    } finally {
      setLoading(false);
    }
  };

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

      const token = localStorage.getItem("accessToken");

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

  /* =======================
     Auto-fetch on mount
     ======================= */
  useEffect(() => {
    fetchAvatar();
  }, []);

  return {
    avatar,
    setAvatar,
    fetchAvatar,
    uploadAvatar,
    loading,
    error,
  };
}
