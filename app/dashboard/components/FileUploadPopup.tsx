"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Upload, File } from "lucide-react";
import { useEffect, useRef } from "react";
import { useSendFileMessage } from "../../zustand/sendFileMessage";

interface FileUploadPopupProps {
  close: () => void;
}

export default function FileUploadPopup({ close }: FileUploadPopupProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const addPendingFile = useSendFileMessage((state) => state.addPendingFile);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      addPendingFile(file); // Add to pending files instead of sending immediately
      close();
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close]);

  return (
    <AnimatePresence>
      <motion.div
        ref={popupRef}
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.9 }}
        transition={{ duration: 0.25 }}
        className="absolute bottom-full mb-3 w-40 sm:w-40 rounded-2xl p-4
                   bg-white/30 dark:bg-slate-800/50 backdrop-blur-xl border border-white/20
                   shadow-xl text-center z-50 left-0"
      >
        {/* Arrow pointer */}
        <div className="absolute -bottom-2 left-6 w-3 h-3 rotate-45 bg-white/30 dark:bg-slate-800/50 border-r border-b border-white/20"></div>

        <File size={36} className="mx-auto text-indigo-500 mb-2" />
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
          Upload a File
        </h3>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-1 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-sm transition"
        >
          <Upload size={14} className="inline" /> Choose File
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />
      </motion.div>
    </AnimatePresence>
  );
}
