"use client";

import { motion } from "framer-motion";
import { Upload, X, File } from "lucide-react";
import { useRef } from "react";

interface FileUploadPopupProps {
  close: () => void;
}

export default function FileUploadPopup({ close }: FileUploadPopupProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Uploaded file:", file.name);
      close();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
      onClick={close}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[90%] sm:w-[400px] p-6 rounded-3xl bg-white/30 dark:bg-slate-800/40 backdrop-blur-2xl border border-white/20 shadow-2xl text-center"
      >
        {/* Close Button */}
        <button
          onClick={close}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-white/20 transition"
        >
          <X size={18} />
        </button>

        <File size={40} className="mx-auto text-indigo-500 mb-3" />
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
          Upload a File
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          Choose an image, audio, or document file.
        </p>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition"
        >
          <Upload size={16} className="inline mr-1" /> Choose File
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />
      </motion.div>
    </motion.div>
  );
}
