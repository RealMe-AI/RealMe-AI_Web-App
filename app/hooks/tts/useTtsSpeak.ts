"use client";

import { useTtsPlayerStore } from "@/app/store/useTtsPlayerStore";

export function useTtsSpeak() {
  const isLoading = useTtsPlayerStore((s) => s.isLoading);
  const isSpeaking = useTtsPlayerStore((s) => s.isSpeaking);
  const currentMessageId = useTtsPlayerStore((s) => s.messageId);
  const speak = useTtsPlayerStore((s) => s.speak);
  const stop = useTtsPlayerStore((s) => s.stop);

  return { speak, stop, isSpeaking, currentMessageId, isLoading };
}
