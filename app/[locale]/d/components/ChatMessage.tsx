"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ChatMessageProps } from "@/app/interface/type";
import { cn } from "@/app/lib/utils";
import { ChevronDown } from "lucide-react";
import { Fragment, useRef, useState, useEffect } from "react";

import Image from "next/image";
import {
  renderAttachment,
  renderFilePreview,
  renderAudioBubble,
  type AudioPlayerApi,
} from "./message-renderers";
import MessageActions from "../components/MessageActions";
import parseMarkdown from "@/app/lib/parseMarkdown";
import { useEditMessage } from "@/app/hooks/messages/useEditMessage";
import { useTtsStore } from "@/app/store/useTtsStore";
import { useTtsSpeak } from "@/app/hooks/tts/useTtsSpeak";

export default function ChatMessage({ message }: ChatMessageProps) {
  const t = useTranslations();
  const isUser = message.sender === "user";
  const hasAudio =
    message.type === "audio" ||
    message.attachments?.some((att) => att.type === "audio");
  const hasImage = message.attachments?.some((att) => att.type === "image");
  const isUserMediaOnly = isUser && (hasAudio || hasImage) && !message.text;
  const imageAttachments = (message.attachments ?? []).filter(
    (a) => a.type === "image",
  );
  const otherAttachments = (message.attachments ?? []).filter(
    (a) => a.type !== "image",
  );
  const hasBubbleContent =
    !!message.text || otherAttachments.length > 0 || message.type === "audio";
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text || "");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { editMessage } = useEditMessage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  // AUDIO PLAYER
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeSrc, setActiveSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDurations, setAudioDurations] = useState<Record<string, number>>(
    {},
  );

  const audioSrc =
    message.audioUrl ??
    message.attachments?.find((a) => a.type === "audio")?.url;

  // Preload metadata so the total duration is known before playback
  useEffect(() => {
    if (!audioSrc) return;
    const audio = new Audio(audioSrc);
    audio.preload = "metadata";
    const capture = () => {
      if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        setAudioDurations((prev) => ({ ...prev, [audioSrc]: audio.duration }));
      }
    };
    audio.addEventListener("loadedmetadata", capture);
    audio.addEventListener("durationchange", capture);
    return () => {
      audio.removeEventListener("loadedmetadata", capture);
      audio.removeEventListener("durationchange", capture);
      audio.src = "";
    };
  }, [audioSrc]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const handleAudio = (src: string) => {
    if (!src) return;

    // Same bubble: toggle play/pause (resume from position, restart if finished)
    if (activeSrc === src && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        return;
      }
      if (audioRef.current.ended) {
        audioRef.current.currentTime = 0;
      }
      audioRef.current.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
      return;
    }

    // New bubble: fresh audio element wired to real playback events
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => {
      setIsPlaying(false);
      if (isFinite(audio.duration)) {
        setCurrentTime(audio.duration);
      }
    };
    audio.onerror = () => {
      setIsPlaying(false);
      setActiveSrc(null);
    };
    audio.ontimeupdate = () => {
      if (audioRef.current === audio) {
        setCurrentTime(audio.currentTime);
      }
    };
    audio.ondurationchange = () => {
      if (isFinite(audio.duration)) {
        setAudioDurations((prev) => ({ ...prev, [src]: audio.duration }));
      }
    };
    setActiveSrc(src);
    setCurrentTime(0);
    audio.play().catch(() => setIsPlaying(false));
  };

  const audioPlayerApi: AudioPlayerApi = {
    audioDurations,
    activeSrc,
    isPlaying,
    currentTime,
    onTogglePlay: handleAudio,
  };

  // AUTO-READ
  const ttsEnabled = useTtsStore((s) => s.enabled);
  const ttsAutoRead = useTtsStore((s) => s.autoRead);
  const { speak, currentMessageId } = useTtsSpeak();

  useEffect(() => {
    if (
      ttsAutoRead &&
      ttsEnabled &&
      message.sender === "ai" &&
      message.id !== "ai-temp" &&
      message.text &&
      currentMessageId !== message.id
    ) {
      speak(message.id);
    }
  }, [
    message.id,
    message.text,
    message.sender,
    ttsAutoRead,
    ttsEnabled,
    speak,
    currentMessageId,
  ]);

  // Auto-resize textarea
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [isEditing]);

  const handleEditStart = () => {
    setEditText(message.text || "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditText(message.text || "");
    setIsEditing(false);
  };

  const handleSendEdit = () => {
    const trimmed = editText.trim();
    if (!trimmed || trimmed === message.text) return;
    editMessage(message.id, trimmed);
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendEdit();
    }
  };

  const handleEditInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  // Overflow detection for "Show more"
  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setOverflows(el.scrollHeight > el.clientHeight);
    }
  }, [message.text]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full"
    >
      <div className="max-w-3xl mx-auto py-2 group">
        <div className={cn("flex items-start gap-4", isUser && "justify-end")}>
          {/* Message */}
          <div
            className={cn(
              "flex flex-col gap-1 min-w-0",
              isUser ? "items-end" : "items-start",
            )}
          >
            {imageAttachments.length > 0 && (
              <div className="flex flex-row gap-2 overflow-x-auto w-full max-w-[130px] sm:max-w-[300px] pb-1 justify-start snap-x snap-mandatory">
                {imageAttachments.map((att) => (
                  <Fragment key={att.id}>
                    {renderAttachment(att)}
                  </Fragment>
                ))}
              </div>
            )}

            {/* MESSAGE BUBBLE */}
            {hasBubbleContent && (
            <div
              className={cn(
                "flex gap-3 rounded-2xl min-w-0 select-text outline-none focus:ring-0 caret-transparent",
                isUser
                  ? "py-2 max-w-sm wrap-break-words [word-break:break-word] wrap-anywhere px-4 bg-slate-100 dark:bg-slate-700/40 text-slate-900 dark:text-white"
                  : "w-full text-slate-900 dark:text-white",
              )}
            >
              {/* AI Avatar */}
              {!isUser && (
                <div className="shrink-0 mt-0.5">
                  <Image
                    src="/logo.png"
                    alt="RealMe AI"
                    width={32}
                    height={32}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-gray-300 dark:border-white/20"
                  />
                </div>
              )}

              {/* message container */}
              <div className="min-w-0 w-full">
                {otherAttachments.length > 0
                  ? // eslint-disable-next-line react-hooks/refs -- playback handler only fires on user click
                    otherAttachments.map((att) => (
                      <Fragment key={att.id}>
                        {renderAttachment(att, audioPlayerApi)}
                      </Fragment>
                    ))
                  : message.type === "file" && renderFilePreview(message)}
                {message.type === "audio" &&
                  !message.attachments?.length &&
                  // eslint-disable-next-line react-hooks/refs -- playback handler only fires on user click
                  renderAudioBubble(message.audioUrl || "", audioPlayerApi)}

                {message.text &&
                  (isUser && isEditing ? (
                    <div className="relative">
                      <textarea
                        ref={textareaRef}
                        value={editText}
                        onChange={handleEditInput}
                        onKeyDown={handleEditKeyDown}
                        className="w-full text-sm leading-relaxed text-slate-800 dark:text-slate-200 bg-transparent resize-none outline-none overflow-hidden caret-slate-800 dark:caret-slate-200"
                        rows={1}
                      />
                      <div className="flex items-center gap-1 mt-2 justify-end">
                        <button
                          onClick={handleCancel}
                          className="px-2 py-1 text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/40 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                        >
                          {t("dashboard.delete_modal.cancel")}
                        </button>
                        <button
                          onClick={handleSendEdit}
                          disabled={
                            !editText.trim() || editText.trim() === message.text
                          }
                          className="px-2 py-1 text-sm font-medium text-indigo-200 bg-slate-500 dark:bg-slate-60 rounded-md transition disabled:opacity-40"
                        >
                          {t("chat.send_button")}
                        </button>
                      </div>
                    </div>
                  ) : isUser ? (
                    <div>
                      <div
                        ref={textRef}
                        className={cn(
                          !isExpanded && "max-h-[300px] overflow-hidden",
                        )}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                          {message.text}
                        </p>
                      </div>
                      {overflows && !isExpanded && (
                        <button
                          onClick={() => setIsExpanded(true)}
                          className="mt-1 flex items-center gap-1 font-semibold text-sm text-black dark:text-white"
                        >
                          {t("chat.show_more")}
                          <ChevronDown size={18} />
                        </button>
                      )}
                      {overflows && isExpanded && (
                        <button
                          onClick={() => setIsExpanded(false)}
                          className="mt-1 flex items-center gap-1 font-semibold text-sm text-black dark:text-white"
                        >
                          {t("chat.show_less")}
                          <ChevronDown size={18} className="rotate-180" />
                        </button>
                  )}
                  </div>
                  ) : (
                    <div className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                      {parseMarkdown(message.text)}
                    </div>
                  ))}
              </div>
            </div>
            )}

            {!isEditing && !isUserMediaOnly && (
              <div
                className={cn(
                  "flex w-full text-[10px] opacity-60 px-1 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity",
                  isUser ? "justify-end" : "justify-start",
                )}
              >
                <MessageActions
                  sender={message.sender}
                  text={message.text}
                  onEdit={handleEditStart}
                  message={message}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
