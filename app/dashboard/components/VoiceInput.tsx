"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Send } from "lucide-react";
import { useRef, useEffect } from "react";
import { useVoiceInput } from "../../hooks/useVoiceInput";

interface VoiceInputProps {
  close: () => void;
}

export default function VoiceInput({ close }: VoiceInputProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  const {
    isRecording,
    seconds,
    isTranscribing,
    transcript,
    error,
    startRecording,
    stopRecording,
    handleSendTranscript,
    cleanup,
    formatTime,
  } = useVoiceInput();

  // 🔹 Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        cleanup();
        close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [cleanup, close]);

  return (
    <AnimatePresence>
      <motion.div
        ref={popupRef}
        initial={{ opacity: 0, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.96 }}
        transition={{ duration: 0.18 }}
        className="absolute bottom-full right-0 mb-3 w-[260px] rounded-2xl p-4
                   bg-white/30 dark:bg-slate-800/50 backdrop-blur-xl border border-white/20 
                   shadow-xl flex flex-col items-center z-50"
      >
        {/* Arrow pointer */}
        <div className="absolute -bottom-2 right-8 w-3 h-3 rotate-45 bg-white/30 dark:bg-slate-800/50 border-r border-b border-white/20"></div>

        <motion.div
          animate={
            isRecording ? { scale: [1, 1.08, 1], opacity: [1, 0.9, 1] } : {}
          }
          transition={{ duration: 1, repeat: isRecording ? Infinity : 0 }}
          className="p-3 rounded-full bg-indigo-500/20 border border-indigo-400/30"
        >
          <Mic size={18} className="text-indigo-600 dark:text-indigo-300" />
        </motion.div>

        <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
          {isRecording
            ? `Recording… (${formatTime(seconds)})`
            : "Start recording"}
        </p>

        {/* error */}
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

        {/* Buttons */}
        <div className="mt-4 flex items-center gap-3">
          {/* Start / Stop */}
          <button
            onClick={async () => {
              if (isRecording) {
                stopRecording();
              } else {
                await startRecording();
              }
            }}
            className={`px-3 py-2 rounded-lg font-medium text-white transition text-sm
              ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-indigo-500 hover:bg-indigo-600"
              }`}
          >
            {isRecording ? (
              <>
                <Square size={14} className="inline mr-2" /> Stop
              </>
            ) : (
              <>
                <Mic size={14} className="inline mr-2" /> Start
              </>
            )}
          </button>

          {/* If transcribing in progress */}
          {isTranscribing && (
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Transcribing…
            </div>
          )}

          {/* If transcript ready, show Send -> button and a small preview */}
          {!isRecording && transcript && !isTranscribing && (
            <div className="flex items-center gap-2">
              <div className="text-sm text-slate-700 dark:text-slate-200 px-2 py-1 rounded bg-white/30 dark:bg-slate-700/40 max-w-[140px] truncate">
                {transcript}
              </div>

              <button
                onClick={handleSendTranscript}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
              >
                Send <Send size={14} />
              </button>
            </div>
          )}

          {/* If not recording and no transcript, show a Cancel/Close */}
          {!isRecording && !transcript && !isTranscribing && (
            <button
              onClick={() => {
                cleanup();
                close();
              }}
              className="px-3 py-2 rounded-lg text-sm bg-gray-200 dark:bg-slate-700/40"
            >
              Close
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
