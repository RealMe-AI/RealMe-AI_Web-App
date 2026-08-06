"use client";

import { useTranslations } from "next-intl";
import { Copy, Pencil, Check, Square, Mic, Volume2 } from "lucide-react";
import { useCopyToClipboard } from "@/app/hooks/copyToClipboard/useCopyToClipboard";
import Tooltip from "@/app/[locale]/components/ui/Tooltip";
import { Message } from "@/app/interface/type";
import { useTtsStore } from "@/app/store/useTtsStore";
import { useTtsSpeak } from "@/app/hooks/tts/useTtsSpeak";

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
  const ttsEnabled = useTtsStore((s) => s.enabled);
  const { speak, stop, isSpeaking, currentMessageId } = useTtsSpeak();

  const handleReadAloud = () => {
    if (isSpeaking && currentMessageId === message.id) {
      stop();
    } else if (message.text) {
      speak(message.id);
    }
  };



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

      {ttsEnabled && message.sender === "ai" && (
        <Tooltip
          content={
            isSpeaking && currentMessageId === message.id
              ? t("dashboard.voice.button.stop")
              : t("message_actions.read_aloud")
          }
        >
          <button
            onClick={handleReadAloud}
            className="p-1.5 rounded-md hover:bg-indigo-100 dark:hover:bg-slate-700 transition"
          >
            {isSpeaking && currentMessageId === message.id ? (
              <Square size={14} className="text-slate-700 dark:text-slate-200" fill="currentColor" />
            ) : (
              <Volume2 size={14} className="text-slate-700 dark:text-slate-200" />
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
