"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SquarePen } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslations } from "use-intl";

import ProfileFooter from "./ProfileFooter";
import Image from "next/image";
import Link from "next/link";
import useModalStore from "../../../zustand/modalStore";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSelectChat: (chat: Chat) => void;
}

export interface Chat {
  id: number;
  title: string;
  lastMessage: string;
}

export default function Sidebar({
  isOpen,
  setIsOpen,
  onSelectChat,
}: SidebarProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [activeChatId, setActiveChatId] = useState<number | null>(null);

  const { closeAll } = useModalStore();
  const t = useTranslations();

  useEffect(() => {
    const saved = localStorage.getItem("realme_chats");
    if (saved) {
      Promise.resolve().then(() => setChats(JSON.parse(saved)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("realme_chats", JSON.stringify(chats));
  }, [chats]);

  const handleNewChat = () => {
    closeAll();
    const newChat: Chat = {
      id: Date.now(),
      title: t("dashboard.search.new_conversation_title", {
        chatNumber: chats.length + 1,
      }),
      lastMessage: t("dashboard.search.new_conversation_started"),
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    onSelectChat(newChat);
  };

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
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
    setActiveChatId(chat.id);
    onSelectChat(chat);
    // close sidebar on mobile after selecting chat
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
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
            <div className="flex justify-end mb-3 ">
              <button
                onClick={handleNewChat}
                className=" flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-500 transition"
              >
                <SquarePen size={13} /> {t("dashboard.sidebar.chat_button")}
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
                  <div
                    key={chat.id}
                    className={`relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition group
                  ${
                    activeChatId === chat.id
                      ? "bg-indigo-500 text-white"
                      : "text-slate-700 dark:text-white bg-slate-100 dark:bg-slate-700/40 hover:bg-white/60 dark:hover:bg-slate-600/50"
                  }`}
                    onClick={() => handleSelectChat(chat)}
                  >
                    {/* Chat info */}
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{chat.title}</p>
                      <p className="text-xs truncate">{chat.lastMessage}</p>
                    </div>

                    {/* Action button */}
                    <Link
                      href={`/chat-actions/${chat.id}`} 
                      className="
                      ml-2 text-slate-400 dark:text-slate-300
                      opacity-100 md:opacity-0 md:group-hover:opacity-100
                      transition-opacity duration-200
                      "
                      onClick={(e) => e.stopPropagation()} // prevent chat select
                    >
                      ...
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 italic text-center">
                  {t("dashboard.search.no_chat")}
                </p>
              )}
            </div>

            <ProfileFooter />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
