"use client";

import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../../zustand/useChatStore";
import { useSendFileMessage } from "../../zustand/sendFileMessage";
import ChatMessage from "./ChatMessage";
import VoiceInput from "./VoiceInput";
import FileUploadPopup from "./FileUploadPopup";
import { Plus, Mic, FileIcon } from "lucide-react";
import Image from "next/image";

export default function ChatWindow() {
  const { messages: chatMessages, isLoading } = useChatStore();
  const { pendingFiles, removePendingFile, sendFilesWithText } =
    useSendFileMessage();

  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showVoicePopup, setShowVoicePopup] = useState(false);

  const inputRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, pendingFiles]);

  const handleSend = async () => {
    if (!input.trim() && pendingFiles.length === 0) return;

    sendFilesWithText(input.trim() || undefined);
    setInput("");
    if (inputRef.current) inputRef.current.textContent = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isSmallScreen = window.innerWidth < 768;
    if (e.key === "Enter" && (!e.shiftKey || isSmallScreen)) {
      e.preventDefault();
      handleSend();
    }
  };

  // Merge messages (chat + files already sent)
  const { messages: fileMessages } = useSendFileMessage();
  const allMessages = [...chatMessages, ...fileMessages].sort(
    (a, b) => Number(a.id) - Number(b.id)
  );

  return (
    <div className="relative flex flex-col flex-1 bg-white/30 dark:bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 transition max-w-full">
      {/* Messages */}
      <div className="flex-1 space-y-5 pb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-400/40">
        {allMessages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {isLoading && (
        <div className="text-sm text-slate-500 dark:text-slate-400 mb-3 animate-pulse">
          RealMe is thinking<span className="animate-pulse">...</span>
        </div>
      )}

      {/* Input Container */}
      <div
        className={`flex flex-col gap-1 mt-2 bg-white/90 dark:bg-slate-700/60 
                    rounded-2xl px-3 py-2 sm:px-4 sm:py-3 border border-slate-300 dark:border-0 backdrop-blur-xl
                    transition ${isFocused ? "ring-2 ring-indigo-500" : ""}`}
      >
        {/* Pending Files Preview */}
        {pendingFiles.length > 0 && (
          <div className="flex gap-2 overflow-x-auto py-1">
            {pendingFiles.map((file, index) => {
              const ext = file.name.split(".").pop()?.toLowerCase();
              return (
                <div
                  key={index}
                  className="relative shrink-0 w-12 h-12 bg-white/40 dark:bg-slate-700/40 rounded-lg shadow"
                >
                  {/* Cancel Button */}
                  <button
                    onClick={() => removePendingFile(index)}
                    className="absolute -top-1 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs hover:bg-red-600"
                  >
                    ×
                  </button>

                  {/* File / Image */}
                  {["png", "jpg", "jpeg", "webp"].includes(ext || "") ? (
                    <Image
                      src={URL.createObjectURL(file)}
                      alt=""
                      width={40}
                      height={40}
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
          {/* ➕ Upload Icon */}
          <div
            className="mr-2 p-1 rounded-full hover:bg-white/30 dark:hover:bg-slate-600/30 cursor-pointer relative"
            onClick={() => setShowUploadPopup(true)}
          >
            <Plus size={22} className="text-indigo-500 dark:text-white/40" />
            {showUploadPopup && (
              <FileUploadPopup close={() => setShowUploadPopup(false)} />
            )}
          </div>

          {/* Editable Input */}
          <div
            ref={inputRef}
            contentEditable
            onInput={(e) => setInput(e.currentTarget.textContent ?? "")}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            className="flex-1 outline-none text-sm sm:text-base text-slate-800 dark:text-slate-100 min-h-[22px]"
            suppressContentEditableWarning
          />

          {/* Mic OR Send */}
          {input.trim().length === 0 && pendingFiles.length === 0 ? (
            <div
              className="p-2 rounded-full hover:bg-white/30 dark:hover:bg-slate-600/30 cursor-pointer relative"
              onClick={() => setShowVoicePopup(true)}
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
              className="px-4 py-2 sm:px-4 sm:py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 
                         text-white font-medium text-sm transition disabled:opacity-50"
            >
              {isLoading ? "..." : "Send"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
