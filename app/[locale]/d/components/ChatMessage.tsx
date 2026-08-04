"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ChatMessageProps, Attachment } from "@/app/interface/type";
import { cn } from "@/app/lib/utils";
import { FileIcon, FileText, ChevronDown, Play, Square } from "lucide-react";
import { Fragment, useRef, useState, useEffect } from "react";

import Image from "next/image";
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
  const isUserAudioOnly = isUser && hasAudio && !message.text;
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

  const formatAudioTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const isAudioAttachment = (att: Attachment) =>
    att.type === "audio" ||
    att.mimeType?.startsWith("audio/") ||
    ["webm", "wav", "ogg", "mp3", "m4a", "flac", "mp4", "aac"].includes(
      att.fileName?.split(".").pop()?.toLowerCase() || "",
    );

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

  // FILE / ATTACHMENT RENDERER
  const formatFileSize = (bytes?: number) => {
    if (bytes === undefined || bytes === null || isNaN(bytes)) return "";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderAttachment = (att: Attachment) => {
    if (isAudioAttachment(att)) {
      return renderAudioBubble(att.url);
    }

    const ext = att.fileName?.split(".").pop()?.toLowerCase();
    const isImage = ["png", "jpg", "jpeg", "webp"].includes(ext || "");

    if (isImage) {
      return (
        <div
          key={att.id}
          className="rounded-xl overflow-hidden mb-2 max-w-[280px]"
        >
          <Image
            src={att.url}
            alt={att.fileName}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto rounded-xl"
            unoptimized
          />
        </div>
      );
    }

    const isPdf = ext === "pdf";
    return (
      <div
        key={att.id}
        className="flex items-center gap-3 p-3 bg-white/20 dark:bg-slate-700/20 rounded-xl mb-2"
      >
        {isPdf ? (
          <FileText className="w-5 h-5 text-red-500 shrink-0" />
        ) : (
          <FileIcon className="w-5 h-5 text-indigo-500 shrink-0" />
        )}
        <div className="min-w-0">
          <span className="text-sm font-medium block truncate max-w-[200px]">
            {att.fileName}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            {formatFileSize(att.fileSize)}
          </span>
        </div>
      </div>
    );
  };

  // LEGACY FILE PREVIEW (for messages without attachments array)
  const renderFilePreview = () => {
    if (!message.fileUrl || !message.fileName) return null;

    const ext = message.fileName.split(".").pop()?.toLowerCase();

    if (["png", "jpg", "jpeg", "webp"].includes(ext || "")) {
      return (
        <div className="rounded-xl overflow-hidden mb-2 max-w-[280px]">
          <Image
            src={message.fileUrl}
            alt={message.fileName}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto rounded-xl"
            unoptimized
          />
        </div>
      );
    }

    if (ext === "pdf") {
      return (
        <div className="flex items-center gap-3 p-3 bg-white/20 dark:bg-slate-700/20 rounded-xl mb-2">
          <FileText className="text-red-500" />
          <span className="text-sm font-medium">{message.fileName}</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3 p-3 bg-white/20 dark:bg-slate-700/20 rounded-xl mb-2">
        <FileIcon className="text-indigo-500" />
        <span className="text-sm font-medium">{message.fileName}</span>
      </div>
    );
  };

  // AUDIO BUBBLE
  const renderAudioBubble = (src: string) => {
    if (!src) return null;

    const duration = audioDurations[src] ?? 0;
    const isBubbleActive = activeSrc === src;
    const isBubblePlaying = isBubbleActive && isPlaying;
    const shownTime = isBubbleActive ? currentTime : duration;

    const barCount = 8;

    return (
      <div
        className={cn(
          "p-3 bg-white/20 dark:bg-slate-700/20 rounded-xl mb-2 flex items-center justify-between gap-3",
          "max-w-[150px] w-[150px]"
        )}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            onClick={() => handleAudio(src)}
            className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white shrink-0"
          >
            {isBubblePlaying ? (
              <Square size={14} fill="currentColor" />
            ) : (
              <Play size={16} className="ml-0.5" />
            )}
          </button>

          {/* Wave animation — only animates while this bubble is playing */}
          <motion.div className="flex gap-1 items-center flex-1 justify-between min-w-0 pr-2">
            {Array.from({ length: barCount }).map((_, idx) => {
              const i = idx + 1;
              return isBubblePlaying ? (
                <motion.div
                  key={i}
                  className="w-[3px] h-1.5 rounded-full bg-indigo-400 shrink-0"
                  animate={{ height: [6, 18, 10, 16, 8][i % 5] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.7,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                />
              ) : (
                <div
                  key={i}
                  className="w-[3px] h-1.5 rounded-full bg-indigo-400/60 shrink-0"
                />
              );
            })}
          </motion.div>
        </div>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums shrink-0">
          {formatAudioTime(shownTime)}
        </span>
      </div>
    );
  };

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
            {/* MESSAGE BUBBLE */}
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
                    className="w-8 h-8 rounded-full border border-gray-300 dark:border-white/20"
                  />
                </div>
              )}

              {/* message container */}
              <div className="min-w-0 w-full">
                {message.attachments?.length
                  ? message.attachments.map((att) => (
                      <Fragment key={att.id}>{renderAttachment(att)}</Fragment>
                    ))
                  : message.type === "file" && renderFilePreview()}
                {message.type === "audio" &&
                  !message.attachments?.length &&
                  renderAudioBubble(message.audioUrl || "")}

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

            {!isEditing && !isUserAudioOnly && (
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
