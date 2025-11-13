"use client";

import { motion } from "framer-motion";
import MessageActions from "../components/MessageActions";
import { ChatMessageProps } from "../../types/type";
import { cn } from "../../lib/utils";
import Image from "next/image";

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === "user";

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
      {/* Avatar (AI only) */}
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
        <p>{message.text}</p>
        <span className="block text-[10px] mt-1 opacity-70 text-right">
          {message.time}
        </span>
      </div>

      {/* Message Actions */}
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
