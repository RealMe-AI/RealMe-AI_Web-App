import Image from "next/image";
import { FileIcon, FileText } from "lucide-react";
import { Message } from "@/app/interface/type";

export function renderFilePreview(
  message: Pick<Message, "fileUrl" | "fileName">,
) {
  if (!message.fileUrl || !message.fileName) return null;

  const ext = message.fileName.split(".").pop()?.toLowerCase();

  if (["png", "jpg", "jpeg", "webp"].includes(ext || "")) {
    return (
      <div className="rounded-xl overflow-hidden mb-2 max-w-[280px]">
        <Image
          src={message.fileUrl}
          alt={message.fileName}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-auto rounded-xl"
          unoptimized
        />
      </div>
    );
  }

  if (ext === "pdf") {
    return (
      <div className="flex items-center gap-3 p-3 bg-white/20 dark:bg-slate-700/20 rounded-xl mb-2">
        <FileText className="text-red-500" />
        <span className="text-sm font-medium">{message.fileName}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-white/20 dark:bg-slate-700/20 rounded-xl mb-2">
      <FileIcon className="text-indigo-500" />
      <span className="text-sm font-medium">{message.fileName}</span>
    </div>
  );
}
