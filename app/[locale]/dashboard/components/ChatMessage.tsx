"use client";

import { motion } from "framer-motion";
import { ChatMessageProps } from "../../../types/type";
import { cn } from "../../../lib/utils";
import { FileIcon, Mic, FileText } from "lucide-react";
import { useRef, useState, useEffect } from "react";

import Image from "next/image";
import MessageActions from "../components/MessageActions";

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === "user";

   //AUDIO PLAYER
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (message.audioUrl) {
      audioRef.current = new Audio(message.audioUrl);

      audioRef.current.onended = () => setIsPlaying(false);
    }

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [message.audioUrl]);

  const handleAudio = () => {
    if (!audioRef.current) return;

    if (!isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

   // FILE PREVIEW
  
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
            width={280}
            height={280}
            className="object-cover rounded-xl"
          />
        </div>
      );
    }

    // PDF
    if (ext === "pdf") {
      return (
        <div className="flex items-center gap-3 p-3 bg-white/20 dark:bg-slate-700/20 rounded-xl mb-2">
          <FileText className="text-red-500" />
          <span className="text-sm font-medium">{message.fileName}</span>
        </div>
      );
    }

    // OTHERS (ZIP, DOCX, TXT, PPTX, etc.)
    return (
      <div className="flex items-center gap-3 p-3 bg-white/20 dark:bg-slate-700/20 rounded-xl mb-2">
        <FileIcon className="text-indigo-500" />
        <span className="text-sm font-medium">{message.fileName}</span>
      </div>
    );
  };

  /** --------------------------
   * AUDIO BUBBLE
   * -------------------------- */
  const renderAudioBubble = () => {
    if (!message.audioUrl) return null;

    return (
      <div className="p-3 bg-white/20 dark:bg-slate-700/20 rounded-xl mb-2 flex items-center gap-3">
        <button
          onClick={handleAudio}
          className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white"
        >
          {isPlaying ? <span>⏸</span> : <Mic size={16} />}
        </button>

        {/* Wave animation */}
        <motion.div
          className="flex gap-1"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-4 bg-indigo-500 rounded-full"
              animate={{
                height: isPlaying ? ["6px", "18px", "8px"] : "6px",
              }}
              transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut" }}
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
      transition={{ duration: 0.25 }}
      className={cn(
        "flex w-full items-start gap-3 group relative",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* AI Avatar */}
      {!isUser && (
        <Image
          src="/logo.png"
          alt="RealMe AI"
          width={32}
          height={32}
          className="w-8 h-8 rounded-full border border-white/20"
        />
      )}

      {/* Bubble */}
      <div
        className={cn(
          "px-4 py-3 rounded-2xl text-sm shadow-md backdrop-blur-md wrap-break-word transition-all",
          isUser
            ? "bg-indigo-500 text-white rounded-br-sm max-w-[80%] sm:max-w-[70%] ml-auto"
            : "bg-white/50 dark:bg-slate-700/60 text-slate-900 dark:text-slate-200 rounded-bl-sm max-w-[80%] sm:max-w-[70%]"
        )}
      >
        {message.type === "file" && renderFilePreview()}
        {message.type === "audio" && renderAudioBubble()}

        {message.text && (
          <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
        )}

        <span className="block text-[10px] mt-1 opacity-60 text-right">
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