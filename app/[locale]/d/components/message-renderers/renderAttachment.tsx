import Image from "next/image";
import { FileIcon, FileText } from "lucide-react";
import { Attachment } from "@/app/interface/type";
import { isAudioAttachment, formatFileSize } from "./utils";
import { renderAudioBubble, AudioPlayerApi } from "./renderAudioBubble";
import { useLightboxStore } from "@/app/store/useLightboxStore";

export function renderAttachment(att: Attachment, api?: AudioPlayerApi | null) {
  if (isAudioAttachment(att)) {
    if (!api) return null;
    return renderAudioBubble(att.url, api);
  }

  const ext = att.fileName?.split(".").pop()?.toLowerCase();
  const isImage = ["png", "jpg", "jpeg", "webp"].includes(ext || "");

  if (isImage) {
    return (
      <button
        type="button"
        key={att.id}
        onClick={() => useLightboxStore.getState().open(att.url)}
        className="group block rounded-xl overflow-hidden mb-2 cursor-zoom-in max-w-[320px]"
      >
        <Image
          src={att.url}
          alt={att.fileName}
          width={0}
          height={0}
          sizes="(max-width: 768px) 70vw, 320px"
          className="w-auto h-auto max-w-[100px] max-h-[100px] object-contain rounded-xl transition-transform group-hover:scale-[1.02]"
          unoptimized
        />
      </button>
    );
  }

  const isPdf = ext === "pdf";
  return (
    <div
      key={att.id}
      className="flex items-center gap-3 p-3 bg-white/20 dark:bg-slate-700/20 rounded-xl mb-2"
    >
      {isPdf ? (
        <FileText className="w-5 h-5 text-red-500 shrink-0" />
      ) : (
        <FileIcon className="w-5 h-5 text-indigo-500 shrink-0" />
      )}
      <div className="min-w-0">
        <span className="text-sm font-medium block truncate max-w-[200px]">
          {att.fileName}
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">
          {formatFileSize(att.fileSize)}
        </span>
      </div>
    </div>
  );
}
