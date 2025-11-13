"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, File } from "lucide-react";
import { useEffect, useRef } from "react";

interface FileUploadPopupProps {
  close: () => void;
}

export default function FileUploadPopup({ close }: FileUploadPopupProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Uploaded file:", file.name);
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
        className="absolute bottom-full right-0 mb-3 w-64 sm:w-72 rounded-2xl p-4
                   bg-white/30 dark:bg-slate-800/50 backdrop-blur-xl border border-white/20 
                   shadow-xl text-center z-50"
      >
        {/* Arrow pointer */}
        <div className="absolute -bottom-2 right-6 w-3 h-3 rotate-45 bg-white/30 dark:bg-slate-800/50 border-r border-b border-white/20"></div>

        {/* Close Button */}
        <button
          onClick={close}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition"
        >
          <X size={16} />
        </button>

        <File size={36} className="mx-auto text-indigo-500 mb-2" />
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
          Upload a File
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Choose an image, audio, or document file.
        </p>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-sm transition"
        >
          <Upload size={14} className="inline mr-1" /> Choose File
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
