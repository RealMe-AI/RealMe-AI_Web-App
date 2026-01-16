"use client";

import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../../../zustand/useChatStore";
import { useSendFileMessage } from "../../../zustand/sendFileMessage";
import { useFetchMessages } from "../../../hooks/useFetchMessages";
import { useSendMessage } from "../../../hooks/useSendMessage";
import { Plus, Mic, FileIcon, ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";

import Image from "next/image";
import ChatMessage from "./ChatMessage";
import VoiceInput from "./VoiceInput";
import FileUploadPopup from "./FileUploadPopup";

export default function ChatWindow() {
  const t = useTranslations();

  /* -------------------- STATE -------------------- */
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showVoicePopup, setShowVoicePopup] = useState(false);

  /* -------------------- REFS -------------------- */
  const inputRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  /* -------------------- STORES & HOOKS -------------------- */
  const {
    messages: chatMessages,
    isLoading,
    activeConversationId,
    setMessages,
    setIsLoading,
    addUserMessage,
    updateAIMessage,
    finalizeAIMessage,
  } = useChatStore();

  const {
    pendingFiles,
    removePendingFile,
    sendFilesWithText,
    messages: fileMessages,
  } = useSendFileMessage();

  const { fetchMessages } = useFetchMessages();
  const { sendMessage: sendMessageAPI, isSending } = useSendMessage();

  /* -------------------- FETCH MESSAGES ON CONVERSATION CHANGE -------------------- */
  useEffect(() => {
    if (activeConversationId) {
      const loadMessages = async () => {
        setIsLoading(true);
        const msgs = await fetchMessages(activeConversationId);
        setMessages(msgs);
        setIsLoading(false);
      };
      loadMessages();
    }
  }, [activeConversationId, fetchMessages, setMessages, setIsLoading]);

  /* -------------------- HANDLERS -------------------- */
  const handleSend = async () => {
    const textContent = input.trim();
    if (!textContent && pendingFiles.length === 0) return;

    if (!activeConversationId) {
      console.error("No active conversation selected.");
      return;
    }

    // Handle text message
    if (textContent) {
      // Add user message to UI immediately
      addUserMessage(textContent);
      setIsLoading(true);

      // Clear input
      setInput("");
      if (inputRef.current) inputRef.current.textContent = "";

      // Send message with streaming
      await sendMessageAPI(
        {
          conversationId: activeConversationId,
          content: textContent,
          model: "llama-3.1-8b-instant",
        },
        {
          onChunk: (text) => {
            updateAIMessage(text);
          },
          onComplete: (fullText) => {
            finalizeAIMessage(fullText);
            setIsLoading(false);
          },
          onError: (error) => {
            console.error("Message error:", error);
            setIsLoading(false);
          },
        }
      );
    }

    // Handle file uploads
    if (pendingFiles.length > 0) {
      sendFilesWithText(undefined);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isSmallScreen = window.innerWidth < 768;

    if (e.key === "Enter" && (!e.shiftKey || isSmallScreen)) {
      e.preventDefault();
      handleSend();
    }
  };

  /* -------------------- MERGE MESSAGES -------------------- */
  const allMessages = [...chatMessages, ...fileMessages].sort(
    (a, b) => Number(a.id) - Number(b.id)
  );

  /* -------------------- AUTO SCROLL -------------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages.length]);

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
              const isImage = ["png", "jpg", "jpeg", "webp"].includes(ext || "");

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
                       dark:hover:bg-slate-600/30 cursor-pointer relative"
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
          />

          {/* Mic or Send */}
          {input.trim() === "" && pendingFiles.length === 0 ? (
            <div
              onClick={() => setShowVoicePopup(true)}
              className="p-2 rounded-full hover:bg-white/30 
                         dark:hover:bg-slate-600/30 cursor-pointer relative"
            >
              <Mic size={20} className="text-indigo-500 dark:text-white/40" />
              {showVoicePopup && (
                <VoiceInput
                  close={() => setShowVoicePopup(false)}
                  onTranscript={(text) => {
                    setInput(text);
                    if (inputRef.current)
                      inputRef.current.textContent = text;
                    setShowVoicePopup(false);
                  }}
                />
              )}
            </div>
          ) : (
            <button
              onClick={handleSend}
              disabled={isLoading || isSending}
              className="p-2 rounded-full bg-indigo-500 hover:bg-indigo-600 
                         text-white font-medium text-sm transition disabled:opacity-50"
            >
              {isLoading || isSending ? "…" : <ArrowUp size={20} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}