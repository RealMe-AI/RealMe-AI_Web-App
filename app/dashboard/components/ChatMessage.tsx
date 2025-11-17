"use client";

import { motion } from "framer-motion";
import MessageActions from "../components/MessageActions";
import { ChatMessageProps } from "../../types/type";
import { cn } from "../../lib/utils";
import Image from "next/image";
import { FileIcon, ImageIcon, Mic, FileText } from "lucide-react";
import { useState } from "react";

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === "user";

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const audio = typeof Audio !== "undefined" ? new Audio(message?.audioUrl) : null;

  const handleAudio = () => {
    if (!audio) return;

    if (!isPlaying) {
      audio.play();
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  /** --------------------------
   * FILE TYPE DETECTION
   * --------------------------
   */
  const renderFilePreview = () => {
    if (!message.fileUrl || !message.fileName) return null;

    const ext = message.fileName.split(".").pop()?.toLowerCase();

    // IMAGES
    if (["png", "jpg", "jpeg", "webp"].includes(ext || "")) {
      return (
        <div className="rounded-xl overflow-hidden mb-2">
          <Image
            src={message.fileUrl}
            alt={message.fileName}
            width={250}
            height={250}
            className="object-cover rounded-lg"
          />
        </div>
      );
    }

    // PDF
    if (ext === "pdf") {
      return (
        <div className="flex items-center gap-3 p-3 bg-white/20 rounded-xl mb-1">
          <FileText className="text-red-500" />
          <span className="text-sm font-medium">{message.fileName}</span>
        </div>
      );
    }

    // OTHER FILES (DOC, ZIP, PPT, etc.)
    return (
      <div className="flex items-center gap-3 p-3 bg-white/20 rounded-xl mb-1">
        <FileIcon className="text-indigo-500" />
        <span className="text-sm font-medium">{message.fileName}</span>
      </div>
    );
  };

  /** --------------------------
   * AUDIO BUBBLE UI
   * --------------------------
   */
  const renderAudioBubble = () => {
    if (!message.audioUrl) return null;

    return (
      <div className="p-3 bg-white/20 rounded-xl mb-1 flex items-center gap-3">
        <button
          onClick={handleAudio}
          className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white"
        >
          {isPlaying ? <span>⏸</span> : <Mic size={16} />}
        </button>

        {/* Wave Animation */}
        <motion.div
          className="flex gap-1"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.15 },
            },
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-4 bg-indigo-500 rounded-full"
              animate={{ height: isPlaying ? ["5px", "20px", "8px"] : "6px" }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
            />
          ))}
        </motion.div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex w-full items-start gap-3 group relative",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Avatar only for AI */}
      {!isUser && (
        <Image
          src="/logo.png"
          alt="RealMe AI"
          className="w-8 h-8 rounded-full border border-white/20 shrink-0"
          width={20}
          height={20}
        />
      )}

      {/* Message Bubble */}
      <div
        className={cn(
          "px-4 py-3 rounded-2xl text-sm shadow-md backdrop-blur-md transition-all wrap-break-word",
          isUser
            ? "bg-indigo-500 text-white rounded-br-sm max-w-[80%] sm:max-w-[70%] ml-auto"
            : "bg-white/60 dark:bg-slate-700/60 text-slate-800 dark:text-slate-200 rounded-bl-sm max-w-[80%] sm:max-w-[70%]"
        )}
      >
        {/* FILE PREVIEW */}
        {message.type === "file" && renderFilePreview()}

        {/* AUDIO WAVEFORM */}
        {message.type === "audio" && renderAudioBubble()}

        {/* TEXT */}
        {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}

        {/* Time */}
        <span className="block text-[10px] mt-1 opacity-70 text-right">
          {message.time}
        </span>
      </div>

      {/* Hover Actions */}
      <div
        className={cn(
          "absolute sm:relative opacity-0 group-hover:opacity-100 transition-all z-10",
          isUser
            ? "left-0 -translate-x-10 sm:translate-x-0 mt-1"
            : "right-0 translate-x-10 sm:translate-x-0 mt-1"
        )}
      >
        <MessageActions />
      </div>
    </motion.div>
  );
}
