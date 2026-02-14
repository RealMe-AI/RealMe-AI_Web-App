"use client";

import { motion } from "framer-motion";
import { ChatMessageProps } from "../../../types/type";
import { cn } from "@/app/lib/utils";
import { FileIcon, Mic, FileText } from "lucide-react";
import { useRef, useState, useEffect } from "react";

import Image from "next/image";
import MessageActions from "../components/MessageActions";

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === "user";

  // AUDIO PLAYER
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

  // AUDIO BUBBLE
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
              transition={{
                repeat: Infinity,
                duration: 0.7,
                ease: "easeInOut",
              }}
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
      className="w-full"
    >
      <div className="max-w-3xl mx-auto px-4 py-2 group">
        <div
          className={cn(
            "flex w-full",
            isUser ? "justify-end" : "justify-start",
          )}
        >
          <div
            className={cn(
              "flex flex-col gap-1",
              isUser ? "items-end" : "items-start",
            )}
          >
            {/* MESSAGE BUBBLE */}
            <div
              className={cn(
                "flex gap-3 rounded-2xl px-4 py-2 min-w-0 select-text outline-none focus:ring-0 caret-transparent",
                isUser
                  ? " max-w-[85%] sm:max-w-[75%] wrap-break-words [word-break:break-word] wrap-anywhere bg-slate-100 dark:bg-slate-700/40 text-slate-900 dark:text-white"
                  : "w-full text-slate-900 dark:text-white",
              )}
            >
              {/* AI Avatar */}
              {!isUser && (
                <div className="shrink-0 mt-0.5">
                  <Image
                    src="/logo.png"
                    alt="RealMe AI"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border border-white/20"
                  />
                </div>
              )}

              {/*   */}
              <div className="min-w-0">
                {message.type === "file" && renderFilePreview()}
                {message.type === "audio" && renderAudioBubble()}

                {message.text && (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.text}
                  </p>
                )}
              </div>
            </div>

            {/* META (outside background) */}
            <div className="flex w-full justify-end text-[10px] opacity-60 px-1 max-md:hidden lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
              {/* <span>{message.time}</span> */}
              <MessageActions />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
