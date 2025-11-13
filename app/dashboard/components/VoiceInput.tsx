"use client";

import { motion } from "framer-motion";
import { Mic, Square, X } from "lucide-react";
import { useState } from "react";

interface VoiceInputProps {
  close: () => void;
}

export default function VoiceInput({ close }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
    >
      <div className="relative w-[90%] sm:w-[400px] p-6 rounded-3xl bg-white/30 dark:bg-slate-800/40 backdrop-blur-2xl border border-white/20 shadow-2xl flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={close}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-white/20 transition"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center mt-4">
          <motion.div
            animate={
              isRecording
                ? { scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }
                : {}
            }
            transition={{ duration: 1.2, repeat: Infinity }}
            className="p-6 rounded-full bg-indigo-500/30 border border-indigo-400/40"
          >
            <Mic size={42} className="text-indigo-600 dark:text-indigo-400" />
          </motion.div>

          <p className="mt-4 text-slate-700 dark:text-slate-300 text-sm">
            {isRecording ? "Recording..." : "Tap mic to start recording"}
          </p>

          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`mt-6 px-5 py-2.5 rounded-xl font-medium transition ${
              isRecording
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-indigo-500 hover:bg-indigo-600 text-white"
            }`}
          >
            {isRecording ? (
              <>
                <Square size={16} className="inline mr-1" /> Stop
              </>
            ) : (
              <>
                <Mic size={16} className="inline mr-1" /> Start
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
