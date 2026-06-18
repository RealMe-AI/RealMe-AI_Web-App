"use client";

import { baseUrl } from "@/app/lib/baseUrl";
import { authFetch } from "@/app/lib/apiClient";

export function useAttachmentDelete() {
  const deleteAttachment = async (attachmentId: string): Promise<boolean> => {
    try {
      const res = await authFetch(
        `${baseUrl}/attachments/${attachmentId}`,
        { method: "DELETE" },
      );
      return res.ok;
    } catch {
      return false;
    }
  };

  return { deleteAttachment };
}
