"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import type { Message } from "@/app/interface/type";
import ChatMessage from "../ChatMessage";

interface ChatMessageListProps {
  chatMessages: Message[];
  user: { fullName?: string; avatar?: string } | null;
  isLoading: boolean;
  showScrollBtn: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatMessageList({
  chatMessages,
  user,
  isLoading,
  showScrollBtn,
  messagesEndRef,
  scrollContainerRef,
}: ChatMessageListProps) {
  const t = useTranslations();

  return (
    <>
      <div
        ref={scrollContainerRef}
        className="flex-1 pb-4 overflow-y-auto caret-transparent relative"
      >
        <div className="max-w-3xl mx-auto h-full">
          {chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="mb-1 flex items-center justify-center gap-3">
                  <Image
                    src="/logo.png"
                    alt="RealMe AI"
                    width={35}
                    height={35}
                    className="w-8 h-8 rounded-full border border-gray-300 dark:border-white/20 object-cover"
                  />
                  <h1 className="text-sm md:text-xl font-bold text-slate-900 dark:text-white">
                    Hi,{" "}
                    {user?.fullName?.split(" ")[0] ||
                      t("dashboard.greeting.fallback_name")}
                  </h1>
                </div>
                <p className="text-[10px] md:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {t("dashboard.greeting.subtitle")}
                </p>
              </motion.div>
            </div>
          ) : (
            chatMessages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {showScrollBtn && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() =>
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
          }
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 w-10 h-10
                     rounded-full bg-white/80 dark:bg-slate-700/80 backdrop-blur-md border border-slate-300 dark:border-white/40 text-slate-900 dark:text-slate-100
                     shadow-lg flex items-center justify-center transition-colors hover:bg-white/10"
        >
          <ArrowDown size={20} />
        </motion.button>
      )}

      {isLoading && (
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          className="max-w-3xl mx-auto w-full flex items-center gap-1 mb-3 animate-bounce"
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{
                delay: i * 0.15,
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      )}
    </>
  );
}
