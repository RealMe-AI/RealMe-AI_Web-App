"use client";

import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import ProfileFooter from "./ProfileFooter";
import Image from "next/image";
import { useState, useEffect } from "react";
import useModalStore from "../../zustand/modalStore";

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

  const { closeAll } = useModalStore(); // close all open modals

  // Load chats from localStorage safely
  useEffect(() => {
    const saved = localStorage.getItem("realme_chats");
    if (saved) {
      // defer state update to avoid synchronous setState in effect
      Promise.resolve().then(() => setChats(JSON.parse(saved)));
    }
  }, []);

  // Save chats whenever they change
  useEffect(() => {
    localStorage.setItem("realme_chats", JSON.stringify(chats));
  }, [chats]);

  // Add new chat
  const handleNewChat = () => {
    closeAll(); // close popovers/modals first
    const newChat: Chat = {
      id: Date.now(),
      title: `Chat ${chats.length + 1}`,
      lastMessage: "New conversation started...",
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    onSelectChat(newChat);
  };

  // Filter chats
  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Error handling
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm && filteredChats.length === 0) {
        setError(`No chat found with the title "${searchTerm}"`);
      } else {
        setError("");
      }
    }, 200);
    return () => clearTimeout(timeout);
  }, [searchTerm, filteredChats]);

  // Select a chat
  const handleSelectChat = (chat: Chat) => {
    closeAll(); // close popovers when selecting a chat
    setActiveChatId(chat.id);
    onSelectChat(chat);
  };

  return (
    <motion.div
      initial={false}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="fixed top-0 right-0 z-40 h-full w-full sm:w-[360px] 
                 bg-white/90 dark:bg-slate-800/95 backdrop-blur-xl shadow-2xl 
                 flex flex-col p-4"
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
          src="/logo.png"
          alt="RealMe AI"
          width={20}
          height={20}
          className="w-8 h-8 rounded-full border border-white/20 shrink-0"
        />
      </div>

      {/* Chats Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Chats
        </h2>

        <button
          onClick={handleNewChat}
          className="text-sm font-medium px-3 py-1.5 rounded-lg 
                     bg-indigo-500 hover:bg-indigo-600 text-white 
                     transition gap-2"
        >
          New Chat
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-2">
        <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            closeAll(); // close modals on typing
            setSearchTerm(e.target.value);
          }}
          onFocus={() => closeAll()} // close modals when focusing
          placeholder="Search chats..."
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg 
                     bg-white/40 dark:bg-slate-700/50 placeholder:text-slate-400 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400 mb-3 text-center animate-pulse">
          {error}
        </p>
      )}

      {/* Chat List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-indigo-400/40"
      >
        {filteredChats.length > 0
          ? filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                className={`p-3 rounded-xl cursor-pointer transition 
                          ${
                            activeChatId === chat.id
                              ? "bg-indigo-500 text-white"
                              : "bg-white/40 dark:bg-slate-700/40 hover:bg-white/60 dark:hover:bg-slate-600/50"
                          }`}
              >
                <p className="text-sm font-medium">{chat.title}</p>
                <p className="text-xs truncate">{chat.lastMessage}</p>
              </div>
            ))
          : !error && (
              <p className="text-sm text-slate-500 dark:text-slate-400 italic text-center">
                No chats yet start one!
              </p>
            )}
      </motion.div>

      {/* Footer */}
      <ProfileFooter />
    </motion.div>
  );
}
