"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Settings, User } from "lucide-react";
import Image from "next/image";
import AccountInfoModal from "./AccountInfoModal"; 

export default function ProfileFooter() {
  const [open, setOpen] = useState(false);
  const [showAccountInfo, setShowAccountInfo] = useState(false); // modal state

  return (
    <div className="relative mt-4 border-t border-white/20 dark:border-slate-700/40 pt-4">
      {/* Profile Header */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/30 
                   dark:hover:bg-slate-700/40 cursor-pointer transition"
      >
        <Image
          src="/avatar.png"
          alt="User Avatar"
          width={50}
          height={50}
          className="w-10 h-10 rounded-full border border-white/20"
        />
        <div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
            Owens Visuels
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Signed in with Google
          </p>
        </div>
      </div>

      {/* Popover Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 left-0 w-full bg-white/60 dark:bg-slate-800/90 
                       backdrop-blur-xl shadow-lg rounded-xl p-2"
          >
            <button
              onClick={() => {
                setShowAccountInfo(true);
                setOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm 
                         text-slate-700 dark:text-slate-200 hover:bg-indigo-100/50 
                         dark:hover:bg-slate-700/60 transition"
            >
              <User size={16} /> View Account Info
            </button>

            <button className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-100/50 dark:hover:bg-slate-700/60 transition">
              <Settings size={16} /> Settings
            </button>

            <button className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-100/50 dark:hover:bg-red-800/60 transition">
              <LogOut size={16} /> Log Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Text */}
      <p className="text-[10px] text-center text-slate-500 dark:text-slate-500 mt-3">
        © OwenVisuels — All Rights Reserved
      </p>

      {/* Account Info Modal */}
      <AccountInfoModal open={showAccountInfo} close={() => setShowAccountInfo(false)} />
    </div>
  );
}
