"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square } from "lucide-react";
import { useRef, useEffect } from "react";
import { useVoiceInput } from "../../../hooks/useVoiceInput";
import { useTranslations } from "next-intl";

interface VoiceInputProps {
  close: () => void;
  onTranscript: (text: string) => void; // callback to send text to ChatWindow input
}

export default function VoiceInput({ close, onTranscript }: VoiceInputProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const onTranscriptRef = useRef(onTranscript);
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  const {
    isRecording,
    seconds,
    isTranscribing,
    transcript,
    error,
    startRecording,
    stopRecording,
    cleanup,
    formatTime,
  } = useVoiceInput();

  // 🔹 Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        cleanup();
        close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [cleanup, close]);

  // 🔹 Whenever transcription is ready and valid, send it to ChatWindow input
  useEffect(() => {
    if (!isRecording && transcript && !isTranscribing && !error) {
      const safeText = transcript.trim();
      if (safeText.length > 0) {
        onTranscriptRef.current(safeText);
      }
    }
  }, [isRecording, transcript, isTranscribing, error]);

  const t = useTranslations();

  return (
    <AnimatePresence>
      <motion.div
        ref={popupRef}
        initial={{ opacity: 0, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.96 }}
        transition={{ duration: 0.18 }}
        className="absolute bottom-full right-0 mb-3 w-50 rounded-2xl p-4
                   bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 
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
            ? `${t("dashboard.record_voice.in_process")} (${formatTime(
                seconds,
              )})`
            : t("dashboard.voice_input.start_recording")}
        </p>

        {/* Error */}
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

        {/* Buttons */}
        <div className="mt-4 flex flex-col items-center gap-2">
          {/* Start / Stop Button (hidden when transcribing) */}
          {!isTranscribing && (
            <button
              onClick={async () => {
                if (isRecording) {
                  await stopRecording();
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
                  <Square size={14} className="inline mr-2" />{" "}
                  {t("dashboard.voice.button.stop")}
                </>
              ) : (
                <>
                  <Mic size={14} className="inline mr-2" />{" "}
                  {t("dashboard.voice.button.start")}
                </>
              )}
            </button>
          )}

          {/* Transcribing Status */}
          {isTranscribing && (
            <div className="text-sm text-slate-600 dark:text-slate-300">
              {t("dashboard.transcribing")}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
