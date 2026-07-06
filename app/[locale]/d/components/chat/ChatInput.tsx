"use client";

import { Plus, Mic, FileIcon, FileText, ArrowUp, Square } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/app/lib/utils";
import { CustomLoader } from "@/app/[locale]/components/ui/CustomLoader";
import Image from "next/image";
import FileUploadPopup from "../FileUploadPopup";
import type { ChatInputProps } from "@/app/interface/chatInput";

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function ChatInput({
  input,
  setInput,
  inputRef,
  isFocused,
  setIsFocused,
  isOnline,
  isLoading,
  attachments,
  uploadingFiles,
  showUploadPopup,
  setShowUploadPopup,
  onFileSelected,
  onRemoveAttachment,
  isRecording,
  isTranscribing,
  onMicClick,
  onAbort,
  onSend,
  onKeyDown,
}: ChatInputProps) {
  const t = useTranslations();
  const isUploading = uploadingFiles.size > 0;
  const hasAttachmentsOrUploading = attachments.length > 0 || isUploading;

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div
        className={`flex flex-col gap-1 bg-white/90 dark:bg-slate-700/60 
                    rounded-2xl mt-5 px-3 py-1 sm:py-2 border border-slate-300 
                    dark:border-0 backdrop-blur-xl transition
                    ${isFocused ? "ring-1 ring-slate-300 dark:ring-slate-600" : ""}`}
      >
        {hasAttachmentsOrUploading && (
          <div className="flex gap-2 overflow-x-auto py-2">
            {Array.from(uploadingFiles.entries()).map(
              ([tempId, { file, progress }]) => (
                <div
                  key={tempId}
                  className="flex items-center gap-3 bg-white/50 dark:bg-slate-700/50 
                           rounded-xl shadow-sm p-2 shrink-0"
                >
                  <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-white/40 dark:bg-slate-700/40 flex items-center justify-center">
                    <CustomLoader size={20} progress={progress} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate max-w-[120px] leading-tight">
                      {file.name}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {progress < 100
                        ? `${t("modal.uploading")} ${progress}%`
                        : t("chat.file.processing")}
                    </span>
                  </div>
                </div>
              ),
            )}

            {attachments.map((att) => {
              const ext = att.fileName.split(".").pop()?.toLowerCase();
              const isImage = ["png", "jpg", "jpeg", "webp"].includes(ext || "");
              const isPdf = ext === "pdf";
              return (
                <div
                  key={att.id}
                  className="relative flex items-center gap-3 bg-white/50 dark:bg-slate-700/50 
                           rounded-xl shadow-sm p-2 pr-7 shrink-0"
                >
                  <button
                    onClick={() => onRemoveAttachment(att.id)}
                    className="absolute -top-2 -right-2 z-10 w-4 h-4 flex items-center 
                             justify-center rounded-full bg-red-500 text-white text-sm 
                             hover:bg-red-600 shadow"
                  >
                    ×
                  </button>

                  <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-white/40 dark:bg-slate-700/40 flex items-center justify-center">
                    {isImage ? (
                      <Image
                        src={att.url}
                        alt={att.fileName}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : isPdf ? (
                      <FileText className="w-6 h-6 text-red-500" />
                    ) : (
                      <FileIcon className="w-6 h-6 text-indigo-500" />
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate max-w-[120px] leading-tight">
                      {att.fileName}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {formatFileSize(att.fileSize)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-2 w-full py-1">
          <div
            onClick={() => setShowUploadPopup(true)}
            className="rounded-full hover:bg-white/30 
                       dark:hover:bg-slate-600/30 relative cursor-pointer flex items-center justify-center shrink-0 w-8 h-8"
          >
            <Plus size={27} className="text-indigo-500 dark:text-white/40" />
            {showUploadPopup && (
              <FileUploadPopup
                close={() => setShowUploadPopup(false)}
                onFileSelected={onFileSelected}
              />
            )}
          </div>

          <div className="flex-1 relative">
            {!input && (
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 md:text-sm text-base">
                {t("chat.input.placeholder")}
              </div>
            )}
            <div
              ref={inputRef}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => setInput(e.currentTarget.textContent ?? "")}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={onKeyDown}
              className="w-full outline-none md:text-sm text-base text-slate-800 dark:text-slate-100 min-h-[24px] max-h-[160px] overflow-y-auto wrap-break-words [word-break:break-word] wrap-anywhere whitespace-pre-wrap leading-relaxed"
            />
          </div>

          {input.trim() === "" && !hasAttachmentsOrUploading && !isLoading ? (
            <div
              onClick={onMicClick}
              className="rounded-full hover:bg-white/30 
                         dark:hover:bg-slate-600/30 relative cursor-pointer flex items-center justify-center shrink-0 w-8 h-8"
            >
              {isTranscribing ? (
                <div className="flex items-center justify-center shrink-0 w-9 h-9 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900">
                  <Square size={16} fill="currentColor" />
                </div>
              ) : isRecording ? (
                <motion.div
                  animate={{ scale: [1, 1.08, 1], opacity: [1, 0.9, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="p-2 rounded-full bg-indigo-500/20 border border-indigo-400/30"
                >
                  <Mic
                    size={27}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                </motion.div>
              ) : (
                <Mic
                  size={27}
                  className="text-indigo-600 dark:text-indigo-300"
                />
              )}
            </div>
          ) : (
            <button
              onClick={isLoading ? onAbort : isOnline ? onSend : undefined}
              className={cn(
                "flex items-center justify-center shrink-0 w-9 h-9 rounded-full transition-all duration-200",
                !isOnline
                  ? "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  : isLoading
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-95"
                    : "bg-indigo-500 hover:bg-indigo-600 text-white",
              )}
            >
              {isLoading ? (
                <Square size={16} fill="currentColor" />
              ) : (
                <ArrowUp size={28} />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}