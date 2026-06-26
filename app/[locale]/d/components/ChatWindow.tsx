"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useChatStore } from "@/app/store/useChatStore";
import { useMessageStream } from "@/app/hooks/messages/useMessageStream";
import { useAttachmentUpload } from "@/app/hooks/attachments/useAttachmentUpload";
import { useAttachmentDelete } from "@/app/hooks/attachments/useAttachmentDelete";
import {
  Plus,
  Mic,
  FileIcon,
  FileText,
  ArrowUp,
  Square,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useUserStore } from "@/app/store/useUserStore";
import type { Attachment } from "@/app/interface/type";
import { CustomLoader } from "@/app/[locale]/components/ui/CustomLoader";

import Image from "next/image";
import ChatMessage from "./ChatMessage";
import VoiceInput from "./VoiceInput";
import FileUploadPopup from "./FileUploadPopup";
import ClipboardPasteModal from "./ClipboardPasteModal";
import OfflineBanner from "./OfflineBanner";

export default function ChatWindow() {
  const t = useTranslations();
  const { user } = useUserStore();

  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showVoicePopup, setShowVoicePopup] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [clipboardText, setClipboardText] = useState<string | null>(null);

  const dismissedTexts = useRef(new Set<string>());
  const inputRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const {
    messages: chatMessages,
    isLoading,
    inputFocusSignal,
  } = useChatStore();
  const { sendMessage, isOnline } = useMessageStream();
  const { uploadFile, uploadingFiles } = useAttachmentUpload();
  const { deleteAttachment } = useAttachmentDelete();

  useEffect(() => {
    if (inputFocusSignal > 0 && inputRef.current) {
      inputRef.current.focus();
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(inputRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [inputFocusSignal]);

  const handleFileSelected = async (file: File) => {
    const result = await uploadFile(file);
    if (result) {
      setAttachments((prev) => [...prev, result]);
    }
  };

  const handleRemoveAttachment = async (attachmentId: string) => {
    await deleteAttachment(attachmentId);
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
  };

  const handleSend = async () => {
    if (!isOnline) return;
    const textContent = input.trim();
    if (!textContent && attachments.length === 0) return;

    setInput("");
    if (inputRef.current) inputRef.current.textContent = "";

    const attachmentIds = attachments.map((a) => a.id);
    const attachmentData = [...attachments];
    setAttachments([]);

    await sendMessage(textContent, attachmentIds, attachmentData);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isSmallScreen = window.innerWidth < 768;
    if (e.key === "Enter" && !isSmallScreen && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [chatMessages.length]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const checkClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim() && !dismissedTexts.current.has(text.trim())) {
        setClipboardText(text);
      }
    } catch {}
  }, []);

  useEffect(() => {
    // Factor 2: check when tab becomes visible
    const handleVisible = () => {
      if (document.visibilityState === "visible") checkClipboard();
    };
    document.addEventListener("visibilitychange", handleVisible);
    // Factor 3: check when input is focused
    const handleFocus = () => checkClipboard();
    inputRef.current?.addEventListener("focus", handleFocus);
    return () => {
      document.removeEventListener("visibilitychange", handleVisible);
      inputRef.current?.removeEventListener("focus", handleFocus);
    };
  }, [checkClipboard]);

  useEffect(() => {
    document.body.style.overflow = clipboardText ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [clipboardText]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isUploading = uploadingFiles.size > 0;
  const hasAttachmentsOrUploading = attachments.length > 0 || isUploading;

  return (
    <div
      className="relative flex flex-col flex-1 bg-white/30 dark:bg-slate-800/40 
                 backdrop-blur-xl rounded-2xl shadow-xl p-3 sm:p-4 md:p-4 max-w-full h-full min-h-0"
    >
      <OfflineBanner />

      <div
        ref={scrollContainerRef}
        className="flex-1 pb-4 overflow-y-auto caret-transparent relative"
      >
        <div className="max-w-3xl mx-auto h-full">
          {chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="mb-1 flex items-center justify-center gap-3">
                  <Image
                    src="/logo.png"
                    alt="RealMe AI"
                    width={35}
                    height={35}
                    className="w-8 h-8 rounded-full border border-gray-300 dark:border-white/20 object-cover"
                  />
                  <h1 className="text-sm md:text-xl font-bold text-slate-900 dark:text-white">
                    Hi, {user?.fullName?.split(" ")[0] || "there"}
                  </h1>
                </div>
                <p className="text-[10px] md:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  I&apos;m RealMe, your AI assistant. How can I help you today?
                </p>
              </motion.div>
            </div>
          ) : (
            chatMessages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {clipboardText && (
          <ClipboardPasteModal
            text={clipboardText}
            onSend={() => {
              dismissedTexts.current.add(clipboardText.trim());
              sendMessage(clipboardText, [], []);
              setClipboardText(null);
            }}
            onCancel={() => {
              dismissedTexts.current.add(clipboardText.trim());
              setClipboardText(null);
            }}
          />
        )}
      </div>

      {showScrollBtn && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() =>
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
          }
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 w-10 h-10
                     rounded-full bg-white/80 dark:bg-slate-700/80 backdrop-blur-md border border-slate-300 dark:border-white/40 text-slate-900 dark:text-slate-100
                     shadow-lg flex items-center justify-center transition-colors hover:bg-white/10"
        >
          <ArrowDown size={20} />
        </motion.button>
      )}

      {isLoading && (
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex gap-1"
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{
                delay: i * 0.15,
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      )}

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
                ([tempId, { file, progress }]) => {
                  return (
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
                            ? `Uploading… ${progress}%`
                            : "Processing…"}
                        </span>
                      </div>
                    </div>
                  );
                },
              )}

              {attachments.map((att) => {
                const ext = att.fileName.split(".").pop()?.toLowerCase();
                const isImage = ["png", "jpg", "jpeg", "webp"].includes(
                  ext || "",
                );
                const isPdf = ext === "pdf";
                return (
                  <div
                    key={att.id}
                    className="relative flex items-center gap-3 bg-white/50 dark:bg-slate-700/50 
                               rounded-xl shadow-sm p-2 pr-7 shrink-0"
                  >
                    <button
                      onClick={() => handleRemoveAttachment(att.id)}
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
                  onFileSelected={handleFileSelected}
                />
              )}
            </div>

            <div className="flex-1 relative">
              {!input && (
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 md:text-sm text-base">
                  Type a message...
                </div>
              )}
              <div
                ref={inputRef}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => setInput(e.currentTarget.textContent ?? "")}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                className="w-full outline-none md:text-sm text-base text-slate-800 dark:text-slate-100 min-h-[24px] max-h-[160px] overflow-y-auto wrap-break-words [word-break:break-word] wrap-anywhere whitespace-pre-wrap leading-relaxed"
              />
            </div>

            {input.trim() === "" && !hasAttachmentsOrUploading && !isLoading ? (
              <div
                onClick={() => setShowVoicePopup(true)}
                className="rounded-full hover:bg-white/30 
                           dark:hover:bg-slate-600/30 relative cursor-pointer flex items-center justify-center shrink-0 w-8 h-8"
              >
                <Mic size={27} className="text-indigo-500 dark:text-white/40" />
                {showVoicePopup && (
                  <VoiceInput
                    close={() => setShowVoicePopup(false)}
                    onTranscript={(text) => {
                      setInput(text);
                      if (inputRef.current) inputRef.current.textContent = text;
                      setShowVoicePopup(false);
                    }}
                  />
                )}
              </div>
            ) : (
              <button
                onClick={
                  isLoading
                    ? () => useChatStore.getState().abortMessage()
                    : handleSend
                }
                className={cn(
                  "flex items-center justify-center shrink-0 w-9 h-9 rounded-full transition-all duration-200",
                  isLoading
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
    </div>
  );
}
