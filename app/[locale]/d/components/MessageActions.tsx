"use client";

import { useTranslations } from "next-intl";
import { Copy, Pencil, Check, Volume2, Square } from "lucide-react";
import { useCopyToClipboard } from "@/app/hooks/copyToClipboard/useCopyToClipboard";
import Tooltip from "@/app/[locale]/components/ui/Tooltip";
import { Message } from "@/app/interface/type";
import { useEffect } from "react";
import { useTtsStore } from "@/app/store/useTtsStore";
import {
  isLanguageSupported,
  useTextToSpeech,
} from "@/app/hooks/useTextToSpeech";
import { useLanguageStore } from "@/app/store/useLanguageStore";

export default function MessageActions({
  sender,
  text,
  onEdit,
  message,
}: {
  sender: "user" | "ai";
  text?: string;
  onEdit?: () => void;
  message: Message;
}) {
  const t = useTranslations();
  const { copied, copy } = useCopyToClipboard();

  // READ ALOUD
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const ttsEnabled = useTtsStore((s) => s.enabled);
  const autoRead = useTtsStore((s) => s.autoRead);
  const language = useLanguageStore((s) => s.language);
  const voiceSupported = isLanguageSupported(language);

  const isUser = message.sender === "user";

  const handleReadAloud = () => {
    if (isSpeaking) {
      stop();
    } else if (message.text) {
      speak(message.text);
    }
  };

  useEffect(() => {
    if (autoRead && !isUser && message.text && ttsEnabled && voiceSupported) {
      speak(message.text);
    }
  }, [
    message.text,
    message.id,
    autoRead,
    isUser,
    ttsEnabled,
    voiceSupported,
    speak,
  ]);

  return (
    <div className="flex flex-row gap-1 bg-white/70 dark:bg-slate-800/80 backdrop-blur-md rounded-lg p-1 shadow-md border border-white/20">
      <Tooltip content={t("message_actions.copy")}>
        <button
          onClick={() => text && copy(text)}
          className="p-1.5 rounded-md hover:bg-indigo-100 dark:hover:bg-slate-700 transition"
        >
          {copied ? (
            <Check size={14} className="text-slate-700 dark:text-slate-200" />
          ) : (
            <Copy size={14} className="text-slate-700 dark:text-slate-200" />
          )}
        </button>
      </Tooltip>

      {ttsEnabled && !isUser && (
        <Tooltip
          content={
            isSpeaking
              ? t("dashboard.voice.button.stop")
              : t("message_actions.read_aloud")
          }
        >
          <button
            onClick={handleReadAloud}
            className="w-6 h-6 rounded-full flex items-center justify-center
                                 lg:bg-white/60 dark:bg-slate-600 lg:dark:bg-slate-700/60 bg-indigo-100
                                 lg:hover:bg-indigo-100 dark:hover:bg-slate-600
                                 transition lg:opacity-0 lg:group-hover:opacity-100
                                 text-slate-700 dark:text-slate-200"
          >
            {isSpeaking ? (
              <Square size={12} fill="currentColor" />
            ) : (
              <Volume2 size={12} />
            )}
          </button>
        </Tooltip>
      )}

      {sender === "user" && (
        <Tooltip content={t("message_actions.edit")}>
          <button
            onClick={onEdit}
            className="p-1.5 rounded-md hover:bg-indigo-100 dark:hover:bg-slate-700 transition"
          >
            <Pencil size={14} className="text-slate-700 dark:text-slate-200" />
          </button>
        </Tooltip>
      )}
    </div>
  );
}
