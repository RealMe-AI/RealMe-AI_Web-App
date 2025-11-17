"use client";

import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../../zustand/useChatStore";
import { useSendFileMessage } from "../../zustand/sendFileMessage";
import ChatMessage from "./ChatMessage";
import VoiceInput from "./VoiceInput";
import FileUploadPopup from "./FileUploadPopup";
import { Plus, Mic } from "lucide-react";

export default function ChatWindow() {
  const { messages: chatMessages, sendMessage, isLoading } = useChatStore();
  const { messages: fileMessages } = useSendFileMessage();

  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showVoicePopup, setShowVoicePopup] = useState(false);

  const inputRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, fileMessages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
    if (inputRef.current) inputRef.current.textContent = "";
  };

  // Merge and normalize messages
  const allMessages = [...chatMessages, ...fileMessages]
    .map((msg) => {
      if ("text" in msg) return msg;

      if (msg.type === "file") {
        return {
          id: String(msg.id),
          sender: msg.sender,
          text: `📎 ${msg.fileName} (${Math.round(msg.fileSize / 1024)} KB)`,
          time: new Date(msg.id).toLocaleTimeString(),
        };
      }

      return msg;
    })
    .sort((a, b) => Number(a.id) - Number(b.id));

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
        className="flex items-center gap-2 mt-2 bg-white/60 dark:bg-slate-700/60 
                   rounded-xl px-3 py-2 sm:px-4 sm:py-3 backdrop-blur-xl 
                   focus-within:ring-2 focus-within:ring-indigo-500 transition"
      >

        {/* ➕ Upload Icon inside */}
        <div
          className="mr-2 p-1 rounded-full hover:bg-white/30 dark:hover:bg-slate-600/30 cursor-pointer relative"
          onClick={() => setShowUploadPopup(true)}
        >
          <Plus size={22} className="text-indigo-500 dark:text-white/40" />
          {showUploadPopup && <FileUploadPopup close={() => setShowUploadPopup(false)} />}
        </div>

        {/* Editable Input */}
        <div
          ref={inputRef}
          contentEditable
          onInput={(e) => setInput(e.currentTarget.textContent ?? "")}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 outline-none text-sm sm:text-base text-slate-800 dark:text-slate-100 min-h-[22px]"
          suppressContentEditableWarning
        />

        {/* Mic OR Send (dynamic inside input bar) */}
        {input.trim().length === 0 ? (
          // 📢 Show MIC when no text
          <div
            className="p-2 rounded-full hover:bg-white/30 dark:hover:bg-slate-600/30 cursor-pointer relative"
            onClick={() => setShowVoicePopup(true)}
          >
            <Mic size={22} className="text-indigo-500 dark:text-white/40" />
            {showVoicePopup && <VoiceInput close={() => setShowVoicePopup(false)} />}
          </div>
        ) : (
          // 📨 Show SEND when typing
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
  );
}
