"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";
import { useChats } from "@/app/hooks/messages/useChats";
import { useFetchMessages } from "@/app/hooks/messages/useFetchMessages";
import { sortPinnedFirst } from "@/app/utils/pin";
import SidebarItem from "../SidebarItem";
import { useChatStore } from "@/app/store/useChatStore";
import { BodySkeleton } from "@/app/[locale]/components/ui/accountInfoLoader/Skeleton";
import { useTranslations } from "next-intl";

interface ConversationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRect: DOMRect | null;
  onShareChat?: (chatId: number, title: string, preview?: string) => void;
}

export default function ConversationsModal({
  isOpen,
  onClose,
  anchorRect,
  onShareChat,
}: ConversationsModalProps) {
  const { chats, isLoading } = useChats();
  const { fetchMessages } = useFetchMessages();
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const setActiveConversationId = useChatStore(
    (s) => s.setActiveConversationId,
  );

  const recentChats = sortPinnedFirst(chats).slice(0, 10);
  const t = useTranslations();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-60 bg-white/20 dark:bg-slate-800/20"
          />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={
              anchorRect
                ? {
                    top: anchorRect.bottom + 8,
                    right: window.innerWidth - anchorRect.right + 55,
                  }
                : undefined
            }
            className="
              fixed w-72 z-70
              bg-white/60 dark:bg-slate-800/90
              backdrop-blur-xl shadow-lg rounded-lg
              flex flex-col
            "
          >
            <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <MessageCircle size={16} />
                {t("dashboard.sidebar.chats")}
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                <X size={14} />
              </button>
            </div>

            <div className="max-h-[475px] overflow-y-hidden p-2 space-y-0.5">
              {recentChats.map((chat) => (
                <SidebarItem
                  key={chat.id}
                  chat={chat}
                  isActive={activeConversationId === chat.id}
                  onClick={() => {
                    setActiveConversationId(chat.id);
                    fetchMessages(chat.id);
                    onClose();
                  }}
                  onShareChat={onShareChat}
                />
              ))}

              {isLoading && <BodySkeleton />}

              {!isLoading && recentChats.length === 0 && (
                <p className="text-sm text-slate-500 italic text-center py-4 caret-transparent">
                  {t("dashboard.search.no_chat")}
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
