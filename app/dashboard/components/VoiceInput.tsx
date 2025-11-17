"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square,} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface VoiceInputProps {
  close: () => void;
}

export default function VoiceInput({ close }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
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
        className="absolute bottom-full right-0 mb-3 w-40 sm:w-40 rounded-2xl p-4
                   bg-white/30 dark:bg-slate-800/50 backdrop-blur-xl border border-white/20 
                   shadow-xl flex flex-col items-center z-50"
      >
        {/* Arrow pointer */}
        <div className="absolute -bottom-2 right-6 w-3 h-3 rotate-45 bg-white/30 dark:bg-slate-800/50 border-r border-b border-white/20"></div>

        <motion.div
          animate={
            isRecording ? { scale: [1, 1.2, 1], opacity: [1, 0.8, 1] } : {}
          }
          transition={{ duration: 1.2, repeat: Infinity }}
          className="p-3 rounded-full bg-indigo-500/30 border border-indigo-400/40 mt-3"
        >
          <Mic size={16} className="text-indigo-600 dark:text-indigo-400" />
        </motion.div>

        <p className="mt-3 text-xs text-slate-700 dark:text-slate-300">
          {isRecording ? "Recording..." : "Start recording"}
        </p>

        <button
          onClick={() => setIsRecording(!isRecording)}
          className={`mt-4 px-2 py-2 rounded-lg font-medium text-white transition text-sm ${
            isRecording
              ? "bg-red-500 hover:bg-red-600"
              : "bg-indigo-500 hover:bg-indigo-600"
          }`}
        >
          {isRecording ? (
            <>
              <Square size={14} className="inline mr-1" /> Stop
            </>
          ) : (
            <>
              <Mic size={14} className="inline mr-1" /> Start
            </>
          )}
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
