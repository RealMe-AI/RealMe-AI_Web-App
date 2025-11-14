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
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showVoicePopup, setShowVoicePopup] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, fileMessages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isSmallScreen = window.innerWidth < 768;
    if (e.key === "Enter" && (!e.shiftKey || isSmallScreen)) {
      e.preventDefault();
      handleSend();
    }
  };

  // Merge and normalize messages for ChatMessage
  const allMessages = [...chatMessages, ...fileMessages]
    .map((msg) => {
      // If it's a regular chat message
      if ("text" in msg) return msg;
      // If it's a file message, normalize to chat shape
      if (msg.type === "file") {
        return {
          id: String(msg.id),
          sender: msg.sender,
          text: `📎 ${msg.fileName} (${Math.round(msg.fileSize / 1024)} KB)`,
          time: new Date(msg.id).toLocaleTimeString(),
        };
      }
      return msg; // fallback
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

      {/* Input Row */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 mt-2"
      >
        {/* ➕ Upload Icon */}
        <div
          className="p-2 rounded-full hover:bg-white/30 dark:hover:bg-slate-700/30 cursor-pointer transition relative"
          onClick={() => setShowUploadPopup(true)}
        >
          <Plus size={20} />
          {showUploadPopup && (
            <FileUploadPopup close={() => setShowUploadPopup(false)} />
          )}
        </div>

        {/* Textarea */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
          className="flex-1 px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded-xl bg-white/60 dark:bg-slate-700/60 
                     placeholder:text-slate-400 focus:outline-none focus:ring-2 
                     focus:ring-indigo-500 transition resize-none"
        />

        {/* 🎤 Voice Icon */}
        <div
          className="p-2 rounded-full hover:bg-white/30 dark:hover:bg-slate-700/30 cursor-pointer transition relative"
          onClick={() => setShowVoicePopup(true)}
        >
          <Mic size={20} />
          {showVoicePopup && (
            <VoiceInput close={() => setShowVoicePopup(false)} />
          )}
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="px-3 py-2 sm:px-4 sm:py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 
                     text-white text-sm sm:text-base font-medium transition disabled:opacity-50"
        >
          {isLoading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}
