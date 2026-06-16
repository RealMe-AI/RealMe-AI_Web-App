"use client";

import { useState } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { authFetch } from "@/app/lib/apiClient";
import type { Attachment } from "@/app/interface/type";

export function useAttachmentUpload() {
  const [uploadingFiles, setUploadingFiles] = useState<Map<string, File>>(
    new Map(),
  );

  const uploadFile = async (file: File): Promise<Attachment | null> => {
    const tempId = `upload-${Date.now()}-${file.name}`;
    setUploadingFiles((prev) => new Map(prev).set(tempId, file));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await authFetch(`${baseUrl}/attachments/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      return await res.json();
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    } finally {
      setUploadingFiles((prev) => {
        const next = new Map(prev);
        next.delete(tempId);
        return next;
      });
    }
  };

  return { uploadFile, uploadingFiles };
}
