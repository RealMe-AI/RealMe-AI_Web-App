"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

interface Props {
  text: string;
  onSend: () => void;
  onCancel: () => void;
}

export default function ClipboardPasteModal({ text, onSend, onCancel }: Props) {

  useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === "Enter") onSend();
    if (e.key === "Escape") onCancel();
  };
  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}, [onSend, onCancel]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-black/20 dark:bg-black/50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 rounded-xl p-5 max-w-sm w-[90%]
                   shadow-xl border border-gray-200 dark:border-slate-700"
      >
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-6">
          Do you want to send this to the chat?
        </p>

        <div className="max-h-40 overflow-y-auto text-sm text-gray-800 dark:text-gray-200
                        bg-gray-50 dark:bg-slate-900/50 rounded-lg p-3 my-4
                        border border-gray-100 dark:border-slate-700/50 whitespace-pre-wrap wrap-break-word">
          {text}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onSend}
            className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700
                       text-white text-sm font-medium transition"
          >
            Send
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg bg-gray-100 dark:bg-slate-700
                       hover:bg-gray-200 dark:hover:bg-slate-600
                       text-gray-700 dark:text-gray-300 text-sm font-medium transition"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
