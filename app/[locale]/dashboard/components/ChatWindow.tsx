"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useChatStore } from "@/app/store/useChatStore";
import { useMessageStream } from "@/app/hooks/messages/useMessageStream";
import { useSendFileMessage } from "@/app/store/sendFileMessage";
import { Plus, Mic, FileIcon, ArrowUp, Square } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useUserStore } from "@/app/store/useUserStore";

import Image from "next/image";
import ChatMessage from "./ChatMessage";
import VoiceInput from "./VoiceInput";
import FileUploadPopup from "./FileUploadPopup";

export default function ChatWindow() {
  const t = useTranslations();
  const { user } = useUserStore();

  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showVoicePopup, setShowVoicePopup] = useState(false);

  const inputRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const {
    messages: chatMessages,
    isLoading,
    inputFocusSignal,
  } = useChatStore();

  const { sendMessage } = useMessageStream();

  // FOCUS INPUT ON SIGNAL
  useEffect(() => {
    if (inputFocusSignal > 0 && inputRef.current) {
      inputRef.current.focus();

      // For contentEditable, move cursor to the end
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(inputRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [inputFocusSignal]);

  const {
    pendingFiles,
    removePendingFile,
    sendFilesWithText,
    messages: fileMessages,
  } = useSendFileMessage();

  const handleSend = async () => {
    const textContent = input.trim();
    if (!textContent && pendingFiles.length === 0) return;

    // Clear input immediately for better UX
    setInput("");
    if (inputRef.current) inputRef.current.textContent = "";

    // Send text message via chat store (handles AI response automatically)
    if (textContent) {
      await sendMessage(textContent);
    }

    // Send pending files (if any)
    if (pendingFiles.length > 0) {
      sendFilesWithText(textContent || undefined);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isSmallScreen = window.innerWidth < 768;
    if (e.key === "Enter" && !isSmallScreen && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const allMessages = useMemo(() => {
    return [...chatMessages, ...fileMessages];
  }, [chatMessages, fileMessages]);

  /* -------------------- AUTO SCROLL -------------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages.length, isLoading]);

  return (
    <div
      className=" relative flex flex-col flex-1 bg-white/30 dark:bg-slate-800/40 
                 backdrop-blur-xl rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 max-w-full h-full min-h-0"
    >
      {/* Chat Messages  */}
      <div className="flex-1 pb-4 overflow-y-auto caret-transparent relative">
        <div className="max-w-3xl mx-auto h-full">
          {allMessages.length === 0 ? (
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
            allMessages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Typing Indicator - Centered */}
      {isLoading && (
        <div className="max-w-3xl mx-auto w-full">
          <div className="text-sm text-slate-600 dark:text-slate-400 mb-3 animate-pulse">
            RealMe {t("dashboard.realMeThinking")}…
          </div>
        </div>
      )}

      {/* Input Container */}
      <div className="max-w-3xl mx-auto w-full">
        <div
          className={`flex flex-col gap-1 bg-white/90 dark:bg-slate-700/60 
                      rounded-2xl px-3 py-1 sm:py-2 border border-slate-300 
                      dark:border-0 backdrop-blur-xl transition
                      ${isFocused ? "ring-1 ring-slate-300 dark:ring-slate-600" : ""}`}
        >
          {/* Pending Files Preview */}
          {pendingFiles.length > 0 && (
            <div className="flex gap-2 overflow-x-auto py-1">
              {pendingFiles.map((file, index) => {
                const ext = file.name.split(".").pop()?.toLowerCase();
                const isImage = ["png", "jpg", "jpeg", "webp"].includes(
                  ext || "",
                );
                return (
                  <div
                    key={index}
                    className="relative shrink-0 w-12 h-12 bg-white/40 dark:bg-slate-700/40 
                               rounded-lg shadow"
                  >
                    <button
                      onClick={() => removePendingFile(index)}
                      className="absolute -top-1 -right-2 w-5 h-5 flex items-center 
                                 justify-center rounded-full bg-red-500 text-white text-xs 
                                 hover:bg-red-600"
                    >
                      ×
                    </button>

                    {isImage ? (
                      <Image
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileIcon className="w-6 h-6 text-indigo-500" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Input Row */}
          <div className="flex items-center gap-2 w-full">
            {/* Upload Button */}
            <div
              onClick={() => setShowUploadPopup(true)}
              className="rounded-full hover:bg-white/30 
                         dark:hover:bg-slate-600/30 relative cursor-pointer flex items-center justify-center shrink-0 w-8 h-8"
            >
              <Plus size={22} className="text-indigo-500 dark:text-white/40" />
              {showUploadPopup && (
                <FileUploadPopup close={() => setShowUploadPopup(false)} />
              )}
            </div>

            {/* Text Input */}
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
                className="
                  w-full outline-none md:text-sm text-base
                  text-slate-800 dark:text-slate-100
                  min-h-[24px] max-h-[160px]
                  overflow-y-auto
                  wrap-break-words [word-break:break-word] wrap-anywhere
                  whitespace-pre-wrap
                  leading-relaxed
                "
              />
            </div>

            {/* Mic or Send/Stop */}
            {input.trim() === "" && pendingFiles.length === 0 && !isLoading ? (
              <div
                onClick={() => setShowVoicePopup(true)}
                className="rounded-full hover:bg-white/30 
                           dark:hover:bg-slate-600/30 relative cursor-pointer flex items-center justify-center shrink-0 w-8 h-8"
              >
                <Mic size={20} className="text-indigo-500 dark:text-white/40" />
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
                  "flex items-center justify-center shrink-0 w-8 h-8 rounded-full transition-all duration-200",
                  isLoading
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-95"
                    : "bg-indigo-500 hover:bg-indigo-600 text-white",
                )}
              >
                {isLoading ? (
                  <Square size={16} fill="currentColor" />
                ) : (
                  <ArrowUp size={20} />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
