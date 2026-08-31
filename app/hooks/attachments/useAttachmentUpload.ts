"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { baseUrl } from "@/app/lib/baseUrl";
import { useAuthStore } from "@/app/store/useAuthStore";
import { showToast } from "@/app/lib/toast";
import type { Attachment } from "@/app/interface/type";

function xhrUpload(
  url: string,
  formData: FormData,
  onProgress: (pct: number) => void,
): Promise<Attachment | Attachment[]> {
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
  const t = useTranslations();
  const [uploadingFiles, setUploadingFiles] = useState<
    Map<string, { file: File; progress: number; kind: "file" | "audio" }>
  >(new Map());

  const UPLOAD_URL = `${baseUrl}/attachments/upload`;

  async function doUpload(files: File[], kind: "file" | "audio"): Promise<Attachment[] | null> {
    if (files.length === 0) return null;
    const validFiles = files.filter((f) => {
      if (f.type.startsWith("video/")) {
        showToast.error(t("fileupload.unsupported_video"));
        return false;
      }
      return true;
    });
    if (validFiles.length === 0) return null;
    const tempIds = validFiles.map(() => `upload-${Date.now()}-${crypto.randomUUID()}`);
    setUploadingFiles((prev) => {
      const next = new Map(prev);
      validFiles.forEach((f, i) => next.set(tempIds[i], { file: f, progress: 0, kind }));
      return next;
    });
    try {
      const formData = new FormData();
      validFiles.forEach((f) => formData.append("file", f));
      const result = await xhrUpload(UPLOAD_URL, formData, (pct) => {
        setUploadingFiles((prev) => {
          const next = new Map(prev);
          tempIds.forEach((id) => {
            const entry = next.get(id);
            if (entry) next.set(id, { ...entry, progress: pct });
          });
          return next;
        });
      });
      const arr: Attachment[] = Array.isArray(result) ? result : [result as Attachment];
      return arr;
    } catch (err) {
      console.error("Upload error:", err);
      // showToast.error("Upload failed");
      return null;
    } finally {
      setUploadingFiles((prev) => {
        const next = new Map(prev);
        tempIds.forEach((id) => next.delete(id));
        return next;
      });
    }
  }

  async function upload(input: File | File[], kind: "file" | "audio" = "file"): Promise<Attachment | Attachment[] | null> {
    const files = Array.isArray(input) ? input : [input];
    const arr = await doUpload(files, kind);
    if (!arr) return null;
    return Array.isArray(input) ? arr : arr[0];
  }

  const uploadFile = async (file: File, kind: "file" | "audio" = "file"): Promise<Attachment | null> =>
    (await upload(file, kind)) as Attachment | null;

  const uploadFiles = async (files: File[], kind: "file" | "audio" = "file"): Promise<Attachment[] | null> =>
    (await upload(files, kind)) as Attachment[] | null;

  return { upload, uploadFile, uploadFiles, uploadingFiles };
}
