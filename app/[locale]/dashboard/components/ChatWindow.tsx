"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useChatStore } from "../../../zustand/useChatStore";
import { useSendMessage } from "@/app/hooks/useSendMessage";
import { useSendFileMessage } from "../../../zustand/sendFileMessage";
import { Plus, Mic, FileIcon, ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";

import Image from "next/image";
import ChatMessage from "./ChatMessage";
import VoiceInput from "./VoiceInput";
import FileUploadPopup from "./FileUploadPopup";

interface ChatWindowProps {
  onConversationCreated?: (conversation: { id: number; title: string }) => void;
}

export default function ChatWindow({ onConversationCreated }: ChatWindowProps) {
  const t = useTranslations();

  /* -------------------- STATE -------------------- */
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showVoicePopup, setShowVoicePopup] = useState(false);

  /* -------------------- REFS -------------------- */
  const inputRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  /* -------------------- STORES -------------------- */
  const { messages: chatMessages, isLoading } = useChatStore();

  const { sendMessage } = useSendMessage(onConversationCreated);

  const {
    pendingFiles,
    removePendingFile,
    sendFilesWithText,
    messages: fileMessages,
  } = useSendFileMessage();

  /* -------------------- HANDLE SEND -------------------- */
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
    if (e.key === "Enter" && (!e.shiftKey || isSmallScreen)) {
      e.preventDefault();
      handleSend();
    }
  };

  /* -------------------- MERGE MESSAGES (FIXED SORTING) -------------------- */
  const allMessages = useMemo(() => {
    const merged = [...chatMessages, ...fileMessages];

    // Sort by timestamp (oldest first, newest last)
    return merged.sort((a, b) => {
      // Try to parse IDs as timestamps
      const aTime = a.id === "ai-temp" ? Infinity : parseInt(a.id) || 0;
      const bTime = b.id === "ai-temp" ? Infinity : parseInt(b.id) || 0;

      return bTime - aTime; // Ascending order (oldest to newest)
    });
  }, [chatMessages, fileMessages]);

  /* -------------------- AUTO SCROLL -------------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages.length, isLoading]);

  /* -------------------- UI -------------------- */
  return (
    <div
      className="relative flex flex-col flex-1 bg-white/30 dark:bg-slate-800/40 
                 backdrop-blur-xl rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 max-w-full"
    >
      {/* Chat Messages */}
      <div className="flex-1 space-y-5 pb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-400/40">
        {allMessages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {isLoading && (
        <div className="text-sm text-slate-600 dark:text-slate-400 mb-3 animate-pulse">
          RealMe {t("dashboard.realMeThinking")}…
        </div>
      )}

      {/* Input Container */}
      <div
        className={`flex flex-col gap-1 mt-2 bg-white/90 dark:bg-slate-700/60 
                    rounded-full px-3 py-2 sm:px-4 sm:py-3 border border-slate-300 
                    dark:border-0 backdrop-blur-xl transition
                    ${isFocused ? "ring-2 ring-indigo-500" : ""}`}
      >
        {/* Pending Files Preview */}
        {pendingFiles.length > 0 && (
          <div className="flex gap-2 overflow-x-auto py-1">
            {pendingFiles.map((file, index) => {
              const ext = file.name.split(".").pop()?.toLowerCase();
              const isImage = ["png", "jpg", "jpeg", "webp"].includes(
                ext || ""
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
        <div className="flex items-center gap-2">
          {/* Upload Button */}
          <div
            onClick={() => setShowUploadPopup(true)}
            className="mr-2 p-1 rounded-full hover:bg-white/30 
                       dark:hover:bg-slate-600/30 relative cursor-pointer"
          >
            <Plus size={22} className="text-indigo-500 dark:text-white/40" />
            {showUploadPopup && (
              <FileUploadPopup close={() => setShowUploadPopup(false)} />
            )}
          </div>

          {/* Text Input */}
          <div
            ref={inputRef}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => setInput(e.currentTarget.textContent ?? "")}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            className="flex-1 outline-none text-sm sm:text-base 
                       text-slate-800 dark:text-slate-100 min-h-[22px]"
            data-placeholder="Type a message..."
          />

          {/* Mic or Send */}
          {input.trim() === "" && pendingFiles.length === 0 ? (
            <div
              onClick={() => setShowVoicePopup(true)}
              className="p-2 rounded-full hover:bg-white/30 
                         dark:hover:bg-slate-600/30 relative cursor-pointer"
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
              onClick={handleSend}
              disabled={isLoading}
              className="p-2 rounded-full bg-indigo-500 hover:bg-indigo-600 
                         text-white font-medium text-sm transition disabled:opacity-50
                         disabled:cursor-not-allowed"
            >
              {isLoading ? "…" : <ArrowUp size={20} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
