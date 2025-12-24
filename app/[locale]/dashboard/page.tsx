"use client";

import { motion } from "framer-motion";
import { PanelLeft } from "lucide-react";
import { useSidebarStore } from "../../zustand/useSidebarStore";

import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

export default function Page() {
  const isSidebarOpen = useSidebarStore((s) => s.isOpen);
  const setIsSidebarOpen = useSidebarStore((s) => s.setIsOpen);

  return (
    <div className="min-h-screen w-full flex bg-linear-to-br from-indigo-50 via-white to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden relative">
      
      {/* Toggle Button */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 right-4 z-50  hover:text-slate-700 text-slate-500 shadow-lg transition"
        >
          <PanelLeft size={20} />
        </button>
      )}

      {/* Chat Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className={`flex-1 flex flex-col transition-all duration-500 ${
          isSidebarOpen ? "md:mr-[360px]" : "md:mx-auto md:max-w-4xl"
        } p-2 md:p-6`}
      >
        <ChatWindow />
      </motion.div>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onSelectChat={(chatId) => {
          console.log("Selected chat:", chatId);
        }}
      />
    </div>
  );
}
