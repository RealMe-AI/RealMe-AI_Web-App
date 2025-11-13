"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

export default function Page() {
  // Sidebar state (persistent)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebarOpen");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  // Save sidebar visibility in localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarOpen", JSON.stringify(isSidebarOpen));
    }
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen w-full flex bg-linear-to-br from-indigo-50 via-white to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden relative">
      {/* Toggle Button */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 right-4 z-50 p-3 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg transition"
        >
          <LayoutDashboard size={22} />
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

      {/* Sidebar (now takes props) */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
    </div>
  );
}
