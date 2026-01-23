"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { baseUrl } from "@/app/lib/baseUrl";

interface UseAvatarEditorProps {
  onChange: (imgUrl: string) => void;
  onSuccess?: () => void;
}

export function useAvatarEditor({ onChange, onSuccess }: UseAvatarEditorProps) {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);

  const uploadAvatar = async (croppedImg: string) => {
    setLoading(true);

    try {
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
        } catch {
          // ignore JSON parse errors
        }
        throw new Error(errorMsg);
      }

      const data = await res.json();

      onChange(data.pictureUrl);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert(
        err instanceof Error ? err.message : t("modal.avatar_upload_failed")
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadAvatar,
    loading,
  };
}
