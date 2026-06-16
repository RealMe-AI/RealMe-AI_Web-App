"use client";

import { useState } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { useAuthStore } from "@/app/store/useAuthStore";
import type { Attachment } from "@/app/interface/type";

function xhrUpload(
  url: string,
  formData: FormData,
  onProgress: (pct: number) => void,
): Promise<Attachment> {
  return new Promise((resolve, reject) => {
    const token = useAuthStore.getState().accessToken;
    if (!token) {
      reject(new Error("No auth token"));
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error("Invalid JSON response"));
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error"));
    xhr.onabort = () => reject(new Error("Upload aborted"));

    xhr.send(formData);
  });
}

export function useAttachmentUpload() {
  const [uploadingFiles, setUploadingFiles] = useState<
    Map<string, { file: File; progress: number }>
  >(new Map());

  const uploadFile = async (file: File): Promise<Attachment | null> => {
    const tempId = `upload-${Date.now()}-${file.name}`;
    setUploadingFiles((prev) => new Map(prev).set(tempId, { file, progress: 0 }));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const attachment = await xhrUpload(
        `${baseUrl}/attachments/upload`,
        formData,
        (pct) => {
          setUploadingFiles((prev) => {
            const next = new Map(prev);
            const entry = next.get(tempId);
            if (entry) next.set(tempId, { ...entry, progress: pct });
            return next;
          });
        },
      );

      return attachment;
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
