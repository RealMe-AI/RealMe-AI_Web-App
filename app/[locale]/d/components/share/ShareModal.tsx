"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useShareConversation } from "@/app/hooks/chatModal/useShareConversation";
import { SocialButton } from "./SocialButton";
import { authFetch } from "@/app/lib/apiClient";
import { baseUrl } from "@/app/lib/baseUrl";
import { RawMessage } from "@/app/interface/type";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: number;
  title: string;
}

export function ShareModal({
  isOpen,
  onClose,
  chatId,
  title,
}: ShareModalProps) {
  const { shareConversation, isSharing } = useShareConversation();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [userPreview, setUserPreview] = useState("");
  const [aiPreview, setAiPreview] = useState("");

  useEffect(() => {
    if (isOpen && !shareUrl && !error) {
      shareConversation(chatId).then((url) => {
        if (url) {
          setShareUrl(url);
        } else {
          setError(true);
        }
      });
    }
  }, [isOpen, chatId, shareConversation, shareUrl, error]);

  useEffect(() => {
    if (!isOpen || !chatId) return;
    const fetchMessages = async () => {
      try {
        const res = await authFetch(`${baseUrl}/conversations/${chatId}`, {
          method: "GET",
        });
        if (!res.ok) return;
        const data = await res.json();

        let rawMessages: RawMessage[] = [];
        if (Array.isArray(data)) {
          rawMessages = data;
        } else if (data.messages && Array.isArray(data.messages)) {
          rawMessages = data.messages;
        } else if (data.items && Array.isArray(data.items)) {
          rawMessages = data.items;
        }

        rawMessages.sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return aTime - bTime;
        });

        const firstUser = rawMessages.find((m) => {
          const sender = m.sender || m.role || "";
          return sender !== "assistant" && sender !== "assistantMessage" && sender !== "ai";
        });
        const firstAi = rawMessages.find((m) => {
          const sender = m.sender || m.role || "";
          return sender === "assistant" || sender === "assistantMessage" || sender === "ai";
        });

        setUserPreview(firstUser?.text || firstUser?.content || "");
        setAiPreview(firstAi?.text || firstAi?.content || "");
      } catch {
        // preview falls back to title
      }
    };
    fetchMessages();
  }, [isOpen, chatId]);

  const previewFallback = userPreview || title;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-60 flex items-center justify-center pointer-events-none p-4 sm:p-6">
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 sm:p-5 rounded-lg shadow-xl pointer-events-auto border border-slate-200 dark:border-slate-700"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate pr-4">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition text-slate-500"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Preview Area */}
              <div className="relative bg-gray-50 dark:bg-slate-900 rounded-lg p-5 mb-8 overflow-y-auto h-[200px] flex flex-col gap-3">
                <div className="w-full flex justify-end">
                  <div className="bg-gray-200 dark:bg-[#424242] p-3 rounded-2xl rounded-tr-sm max-w-[85%] text-sm text-gray-900 dark:text-gray-100 leading-relaxed shadow-sm overflow-auto">
                    {previewFallback}
                  </div>
                </div>
                {aiPreview && (
                  <div className="w-full flex justify-start">
                    <div className="bg-white dark:bg-slate-700 p-3 rounded-2xl rounded-tl-sm max-w-[85%] text-sm text-gray-900 dark:text-gray-100 leading-relaxed shadow-sm overflow-auto">
                      {aiPreview}
                    </div>
                  </div>
                )}
              </div>

              {/* Social Buttons */}
              <SocialButton shareUrl={shareUrl} isSharing={isSharing} title={title} />

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-center gap-2">
                <Image
                  src="/logo.png"
                  alt="RealMe AI"
                  width={16}
                  height={16}
                  className="w-4 h-4 rounded-full"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  RealMe AI
                </span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
