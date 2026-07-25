"use client";

import { Plus, Mic, FileIcon, FileText, ArrowUp, Square, Play, Trash2 } from "lucide-react";
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
  isAudioRecorded,
  audioDuration,
  audioUrl,
  isAudioPlaying,
  onMicClick,
  onDeleteAudio,
  onPlayAudio,
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
        {(hasAttachmentsOrUploading || audioUrl || isRecording) && (
          <div className="flex gap-2 overflow-x-auto py-2 items-center">
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

            {(isRecording || audioUrl) && (
              <div className="ml-auto flex items-center gap-2 bg-white/50 dark:bg-slate-700/50 rounded-xl shadow-sm px-3 py-2 shrink-0">
                {isRecording ? (
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5 h-6">
                      {[1, 2, 3, 4].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ height: [6, 16, 10, 20, 6][i % 5] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                          className="w-0.5 bg-indigo-500 rounded-full"
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 min-w-[32px] tabular-nums">
                      {`${Math.floor(audioDuration / 60)}:${(audioDuration % 60).toString().padStart(2, "0")}`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={onPlayAudio}
                      className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition shrink-0"
                    >
                      {isAudioPlaying ? (
                        <Square size={10} fill="currentColor" className="text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <Play size={12} className="text-indigo-600 dark:text-indigo-400 ml-0.5" />
                      )}
                    </button>
                    <div className="flex items-center gap-0.5 h-6">
                      {[8, 12, 10, 14, 8].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: h }}
                          className="w-0.5 bg-indigo-400/60 rounded-full"
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 min-w-[32px] tabular-nums">
                      {`${Math.floor(audioDuration / 60)}:${(audioDuration % 60).toString().padStart(2, "0")}`}
                    </span>
                    <button
                      onClick={onDeleteAudio}
                      className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition shrink-0"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                )}
              </div>
            )}
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

          {isRecording ? (
            <div
              onClick={onMicClick}
              className="rounded-full hover:bg-white/30 
                         dark:hover:bg-slate-600/30 relative cursor-pointer flex items-center justify-center shrink-0 w-8 h-8"
            >
              <div className="flex items-center justify-center shrink-0 w-9 h-9 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900">
                <Square size={16} fill="currentColor" />
              </div>
            </div>
          ) : input.trim() === "" && !hasAttachmentsOrUploading && !audioUrl && !isLoading ? (
            <div
              onClick={onMicClick}
              className="rounded-full hover:bg-white/30 
                         dark:hover:bg-slate-600/30 relative cursor-pointer flex items-center justify-center shrink-0 w-8 h-8"
            >
              <Mic
                size={27}
                className="text-indigo-600 dark:text-indigo-300"
              />
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