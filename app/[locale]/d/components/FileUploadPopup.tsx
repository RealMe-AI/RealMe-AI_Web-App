"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Upload, File } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

interface FileUploadPopupProps {
  close: () => void;
  onFileSelected: (file: File) => void;
}

export default function FileUploadPopup({ close, onFileSelected }: FileUploadPopupProps) {
  const t = useTranslations();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
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
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.22 }}
        className="absolute bottom-full mb-3 left-0 w-44 p-4 rounded-2xl
                   bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl
                   border border-white/20 shadow-xl text-center z-50"
      >
        {/* Arrow Pointer */}
        <div
          className="absolute -bottom-2 left-6 w-3 h-3 rotate-45 
                        bg-white/30 dark:bg-slate-800/50 border-r border-b border-white/20"
        />

        <File size={36} className="mx-auto text-indigo-500 mb-2" />

        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
          {t("fileupload.upload_title")}
        </h3>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-lg text-sm transition flex items-center justify-center mx-auto bg-indigo-500 hover:bg-indigo-600 text-white shadow"
        >
          <Upload size={14} className="mr-1" />
          {t("fileupload.button_label")}
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
