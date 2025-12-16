// src/
import { useEffect, useRef, useState } from "react";

interface TranscriptionResponse {
  text: string;
}

export const useVoiceInput = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
    stopTimer();
  };

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

      const contentType = res.headers.get("content-type") || "";
      if (!res.ok || !contentType.includes("application/json")) {
        const txt = await res.text();
        throw new Error(txt || `Transcription failed with status ${res.status}`);
      }

      const data: TranscriptionResponse = await res.json();

      if (!data?.text || typeof data.text !== "string") {
        throw new Error("Invalid transcription result.");
      }

      setTranscript(data.text.trim());
    } catch (err) {
      const e = err instanceof Error ? err.message : "Transcription failed.";
      console.error("Transcribe error:", e);
      setError(e);
    } finally {
      setIsTranscribing(false);
    }
  };

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

  useEffect(() => {
    if (!isRecording && chunks.length > 0 && !isTranscribing && !transcript) {
      transcribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chunks]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return {
    isRecording,
    seconds,
    isTranscribing,
    transcript,
    error,
    startRecording,
    stopRecording,
    cleanup,
    formatTime,
  };
};
