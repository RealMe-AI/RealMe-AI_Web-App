import { Attachment } from "@/app/interface/type";

export const isAudioAttachment = (att: Attachment) =>
  att.type === "audio" ||
  att.mimeType?.startsWith("audio/") ||
  ["webm", "wav", "ogg", "mp3", "m4a", "flac", "mp4", "aac"].includes(
    att.fileName?.split(".").pop()?.toLowerCase() || "",
  );

export const formatFileSize = (bytes?: number) => {
  if (bytes === undefined || bytes === null || isNaN(bytes)) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
