"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SquarePen } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Chat } from "@/app/types/type";
import { useChatStore } from "@/app/zustand/useChatStore";
import { useChats } from "@/app/hooks/useChats";

import LanguageSelect from "./../../setting/LanguageSelect";
import ProfileFooter from "./ProfileFooter";
import Image from "next/image";
import SidebarItem from "./SidebarItem";
import useModalStore from "../../../zustand/modalStore";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSelectChat: (chat: Chat) => void;
}

export default function Sidebar({
  isOpen,
  setIsOpen,
  onSelectChat,
}: SidebarProps) {
  const { chats } = useChats();
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const t = useTranslations();

  const {
    activeConversationId,
    setActiveConversationId,
    setMessages,
    triggerInputFocus,
  } = useChatStore();

  const { closeAll } = useModalStore();

  const handleNewChat = () => {
    closeAll();
    // 1. Reset chat session locally
    setActiveConversationId(null);
    setMessages([]);

    // 2. Trigger focus for chat input
    triggerInputFocus();

    // 3. Close sidebar on mobile
    if (window.innerWidth < 640) {
      setIsOpen(false);
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm && filteredChats.length === 0) {
        setError(t("dashboard.search.no_results", { searchTerm }));
      } else {
        setError("");
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [searchTerm, filteredChats, t]);

  const handleSelectChat = (chat: Chat) => {
    closeAll();
    setActiveConversationId(chat.id);
    onSelectChat(chat);

    // Close sidebar on mobile
    if (window.innerWidth < 640) {
      setIsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="
              fixed inset-0 z-30
              bg-black/10 dark:bg-black/30
              backdrop-blur-[1px]
              sm:hidden
            "
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="
              fixed top-0 right-0 z-40 h-full
              w-[85vw] max-w-[360px]
              bg-white/90 dark:bg-slate-800/95
              backdrop-blur-xl shadow-2xl
              flex flex-col p-4
            "
          >
            {/* Header */}
            <div className="flex justify-between mb-10">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-700 
                           dark:hover:text-slate-300 transition"
              >
                <X size={20} />
              </button>

              <Image
                src="/"
                alt="RealMe AI"
                width={32}
                height={32}
                className="rounded-full border border-white/20"
              />
            </div>

            {/* New Chat */}
            <div className="flex justify-end mb-3">
              <button
                onClick={handleNewChat}
                className="
                  flex items-center gap-1 text-xs font-medium
                  px-2 py-1.5 rounded-lg
                  text-slate-700 hover:bg-slate-100
                  dark:text-white dark:hover:bg-slate-500
                  transition
                "
              >
                <SquarePen size={13} />
                {t("dashboard.sidebar.chat_button")}
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-2">
              <Search
                className="absolute left-3 top-2.5 text-slate-400"
                size={16}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={closeAll}
                placeholder={t("dashboard.search.chats_placeholder")}
                className="
                  w-full pl-9 pr-3 py-2 text-sm rounded-lg
                  text-slate-700 dark:text-white
                  bg-white/40 dark:bg-slate-700/50
                  placeholder:text-slate-400
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                "
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center mb-3 animate-pulse">
                {error}
              </p>
            )}

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto space-y-3">
              {filteredChats.length ? (
                filteredChats.map((chat) => (
                  <SidebarItem
                    key={chat.id}
                    chat={chat}
                    isActive={activeConversationId === chat.id}
                    onClick={() => handleSelectChat(chat)}
                  />
                ))
              ) : (
                <p className="text-sm text-slate-500 italic text-center">
                  {t("dashboard.search.no_chat")}
                </p>
              )}
            </div>

            {/*   */}
            <div className="border-t border-white/20 dark:border-slate-700/40 flex items-center justify-between gap-2">
              <ProfileFooter />
              <div className="shrink-0">
                <LanguageSelect />
              </div>
            </div>

            {/* Credits */}
            <p className="text-[10px] text-center text-slate-500 dark:text-slate-500">
              {t("dashboard.sidebar.footer_full")} OwenVisuels
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
