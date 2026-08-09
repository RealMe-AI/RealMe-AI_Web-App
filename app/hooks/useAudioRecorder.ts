"use client";

import { useState, useRef, useCallback } from "react";

function pickSupportedMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/aac",
  ];
  return candidates.find((t) => MediaRecorder.isTypeSupported(t)) || "";
}

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startTimeRef = useRef<number>(0);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = pickSupportedMimeType();
      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mediaRecorder.mimeType || mimeType || "audio/webm",
        });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      };

      mediaRecorder.start();
      startTimeRef.current = Date.now();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const resetRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    setCurrentTime(0);
    setIsPlaying(false);
  }, [audioUrl]);

  const togglePlayback = useCallback(async () => {
    if (!audioUrl) return;
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    const reset = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };
    audio.ontimeupdate = () => {
      if (audioRef.current === audio) {
        setCurrentTime(audio.currentTime);
      }
    };
    audio.onended = reset;
    audio.onerror = () => {
      console.error("Voice-note preview playback failed", audioUrl);
      reset();
    };
    try {
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Voice-note preview playback rejected", err);
      reset();
    }
  }, [audioUrl, isPlaying]);

  return {
    isRecording,
    isPlaying,
    duration,
    currentTime,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    resetRecording,
    togglePlayback,
  };
}
