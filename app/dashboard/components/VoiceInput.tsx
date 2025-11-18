"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Check, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../zustand/useChatStore";

interface VoiceInputProps {
  close: () => void;
}

export default function VoiceInput({ close }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0); // timer seconds
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const popupRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const sendMessage = useChatStore((s) => s.sendMessage);

  // Format seconds as M:SS (0:00)
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        cleanupEverything();
        close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close]);

  // start the timer
  const startTimer = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Start recording
  const startRecording = async () => {
    setError(null);
    setTranscript(null);
    setChunks([]);
    setSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const options: MediaRecorderOptions = { mimeType: "audio/webm" };

      const mr = new MediaRecorder(stream, options);
      const localChunks: Blob[] = [];

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) localChunks.push(e.data);
      };

      mr.onstop = () => {
        setChunks(localChunks);
      };

      mr.start();
      setMediaRecorder(mr);
      setIsRecording(true);
      startTimer();
    } catch (err: any) {
      console.error("Microphone access error:", err);
      setError("Microphone access denied or unavailable.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (!mediaRecorder) return;
    try {
      mediaRecorder.stop();
    } catch (err) {
      console.warn("stop error", err);
    }
    // stop tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
    stopTimer();
  };

  // Transcribe recorded audio by sending the blob to server
  const transcribe = async () => {
    if (chunks.length === 0) {
      setError("Nothing recorded.");
      return;
    }

    setIsTranscribing(true);
    setError(null);

    try {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const fd = new FormData();
      fd.append("file", blob, "recording.webm");

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Transcription failed");
      }

      const data = await res.json();
      // OpenAI Whisper returns { text: "..." }
      setTranscript(data.text ?? "");
    } catch (err: any) {
      console.error("Transcribe error:", err);
      setError(err?.message || "Transcription failed.");
    } finally {
      setIsTranscribing(false);
    }
  };

  // When user hits Send after transcription: send text message to chat
  const handleSendTranscript = async () => {
    if (!transcript || !transcript.trim()) {
      // nothing to send
      cleanupEverything();
      close();
      return;
    }

    try {
      await sendMessage(transcript.trim()); // uses your chat store sendMessage
    } catch (err) {
      console.error("sendMessage error:", err);
    } finally {
      cleanupEverything();
      close();
    }
  };

  // full cleanup
  const cleanupEverything = () => {
    stopTimer();
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      try {
        mediaRecorder.stop();
      } catch {}
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
    setSeconds(0);
    setChunks([]);
    setMediaRecorder(null);
    setIsTranscribing(false);
    setTranscript(null);
    setError(null);
  };

  // If user stops recording (mediaRecorder.onstop sets chunks), auto-transcribe
  useEffect(() => {
    // when chunks populated and not currently transcribing, start transcription
    if (!isRecording && chunks.length > 0 && !isTranscribing && !transcript) {
      transcribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chunks]);

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
          animate={isRecording ? { scale: [1, 1.08, 1], opacity: [1, 0.9, 1] } : {}}
          transition={{ duration: 1, repeat: isRecording ? Infinity : 0 }}
          className="p-3 rounded-full bg-indigo-500/20 border border-indigo-400/30"
        >
          <Mic size={18} className="text-indigo-600 dark:text-indigo-300" />
        </motion.div>

        <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
          {isRecording ? `Recording… (${formatTime(seconds)})` : "Start recording"}
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
              ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-indigo-500 hover:bg-indigo-600"}`}
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
            <div className="text-sm text-slate-600 dark:text-slate-300">Transcribing…</div>
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
                cleanupEverything();
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
