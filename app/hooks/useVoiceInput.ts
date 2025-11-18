// src/hooks/useVoiceInput.ts
import { useEffect, useRef, useState } from "react";

interface TranscriptionResponse {
  text: string;
}

export const useVoiceInput = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Timer
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Start Recording
  const startRecording = async () => {
    setError(null);
    setTranscript(null);
    setChunks([]);
    setSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      const localChunks: Blob[] = [];

      mr.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) localChunks.push(e.data);
      };

      mr.onstop = () => setChunks(localChunks);

      mr.start();
      setMediaRecorder(mr);
      setIsRecording(true);
      startTimer();
    } catch (err) {
      console.error("Microphone access error:", err);
      setError("Microphone access denied or unavailable.");
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
    stopTimer();
  };

  // Transcription
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

      const res = await fetch("/api/transcribe", { method: "POST", body: fd });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Transcription failed");
      }

      const data: TranscriptionResponse = await res.json();
      setTranscript(data.text ?? "");
    } catch (err) {
      const e = err instanceof Error ? err.message : "Transcription failed.";
      console.error("Transcribe error:", e);
      setError(e);
    } finally {
      setIsTranscribing(false);
    }
  };

  // Cleanup
  const cleanup = () => {
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

  // Auto-transcribe when recording stops
  useEffect(() => {
    if (!isRecording && chunks.length > 0 && !isTranscribing && !transcript) {
      transcribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chunks]);

  // Format timer
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return {
    isRecording,
    seconds,
    isTranscribing,
    transcript, // this can now be sent to ChatWindow automatically
    error,
    startRecording,
    stopRecording,
    cleanup,
    formatTime,
  };
};
