"use client";

import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../../zustand/useChatStore";
import ChatMessage from "./ChatMessage";
import VoiceInput from "./VoiceInput"; 
import FileUploadPopup from "./FileUploadPopup"; 
import { Plus, Mic } from "lucide-react";

export default function ChatWindow() {
  const { messages, sendMessage, isLoading } = useChatStore();
  const [input, setInput] = useState("");
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isSmallScreen = window.innerWidth < 768; // md breakpoint

    if (e.key === "Enter") {
      if (!e.shiftKey || isSmallScreen) {
        e.preventDefault();
        handleSend();
      }
      // shift + enter on large screen -> newline
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-white/30 dark:bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 transition max-w-full">
      {/* Messages */}
      <div className="flex-1 space-y-5 pb-4 scrollbar-thin scrollbar-thumb-indigo-400/40 overflow-y-auto">
        {messages.map((msg) => (
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

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 mt-2"
      >
        {/* Left Plus Icon */}
        <div
          className="p-2 rounded-full hover:bg-white/30 dark:hover:bg-slate-700/30 cursor-pointer transition relative"
          onClick={() => setShowUploadPopup(true)}
        >
          <Plus size={20} />
          {showUploadPopup && (
            <FileUploadPopup close={() => setShowUploadPopup(false)} />
          )}
        </div>

        {/* Input */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded-xl bg-white/60 dark:bg-slate-700/60 
                     placeholder:text-slate-400 focus:outline-none focus:ring-2 
                     focus:ring-indigo-500 transition resize-none"
          rows={1}
        />

        {/* Voice Icon */}
        <div className="p-2 rounded-full hover:bg-white/30 dark:hover:bg-slate-700/30 cursor-pointer transition">
          <VoiceInput />
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
