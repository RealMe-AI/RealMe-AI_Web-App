"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useChatStore } from "@/app/store/useChatStore";
import { useMessageStream } from "@/app/hooks/messages/useMessageStream";
import { useStopMessageStream } from "@/app/hooks/messages/useStopMessageStream";
import { useAttachmentUpload } from "@/app/hooks/attachments/useAttachmentUpload";
import { useAttachmentDelete } from "@/app/hooks/attachments/useAttachmentDelete";
import { useAudioRecorder } from "@/app/hooks/useAudioRecorder";
import { useUserStore } from "@/app/store/useUserStore";
import type { Attachment } from "@/app/interface/type";
import OfflineBanner from "./OfflineBanner";
import ClipboardPasteModal from "./clipboard/ClipboardPasteModal";
import { getDismissedClipboard, dismissClipboard } from "./clipboard/dismiss";
import { ChatMessageList, ChatInput } from "./chat";
import markdownToPlainText from "@/app/lib/markdownToPlainText";
import { placeCursorAtEnd, placeCursorAtStart } from "./chat/cursorUtils";

export default function ChatWindow() {
  const { user } = useUserStore();

  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [clipboardText, setClipboardText] = useState<string | null>(null);

  const inputRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const isNearBottomRef = useRef(true);
  const touchYRef = useRef<number | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const {
    messages: chatMessages,
    isLoading,
    inputFocusSignal,
    triggerInputFocus,
  } = useChatStore();
  const { sendMessage, isOnline } = useMessageStream();
  const { stopStream } = useStopMessageStream();
  const { uploadFile, uploadingFiles } = useAttachmentUpload();
  const { deleteAttachment } = useAttachmentDelete();

  const focusedOnMountRef = useRef(false);

  // Auto-focus on mount (desktop only)
  useEffect(() => {
    if (!focusedOnMountRef.current && window.innerWidth >= 1024) {
      focusedOnMountRef.current = true;
      triggerInputFocus();
    }
  }, [triggerInputFocus]);

  // Mobile keyboard-aware layout
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const syncKeyboardHeight = () => {
      const gap = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      document.documentElement.style.setProperty(
        "--keyboard-height",
        `${gap}px`,
      );
    };

    syncKeyboardHeight();
    vv.addEventListener("resize", syncKeyboardHeight);
    vv.addEventListener("scroll", syncKeyboardHeight);
    return () => {
      vv.removeEventListener("resize", syncKeyboardHeight);
      vv.removeEventListener("scroll", syncKeyboardHeight);
      document.documentElement.style.setProperty("--keyboard-height", "0px");
    };
  }, []);

  useEffect(() => {
    if (inputFocusSignal > 0 && inputRef.current && window.innerWidth >= 1024) {
      inputRef.current.focus();
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(inputRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [inputFocusSignal]);

  const {
    isRecording,
    isPlaying: isAudioPlaying,
    duration: audioDuration,
    currentTime: audioCurrentTime,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    resetRecording,
    togglePlayback,
  } = useAudioRecorder();

  const isAudioRecorded = audioUrl !== null;

  const handleMicClick = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const handleDeleteAudio = () => {
    resetRecording();
  };

  const handlePlayAudio = () => {
    togglePlayback();
  };

  const handleFileSelected = async (file: File) => {
    const result = await uploadFile(file);
    if (result) {
      setAttachments((prev) => [...prev, result]);
    }
  };

  const handleRemoveAttachment = async (attachmentId: string) => {
    await deleteAttachment(attachmentId);
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
  };

  const handleAbort = () => {
    stopStream();
  };

  const handleSend = async () => {
    if (!isOnline) return;
    const textContent = input.trim();
    if (!textContent && attachments.length === 0 && !audioBlob) return;

    const attachmentIds = attachments.map((a) => a.id);
    const attachmentData = [...attachments];

    setInput("");
    if (inputRef.current) inputRef.current.textContent = "";
    resetRecording();
    setAttachments([]);

    // Keep the input focused after send (desktop only)
    if (window.innerWidth >= 768) {
      placeCursorAtStart(inputRef.current);
    }

    if (audioBlob) {
      const audioFile = new File([audioBlob], `Voice-Message.webm`, {
        type: "audio/webm",
      });
      const result = await uploadFile(audioFile, "audio");
      if (result) {
        attachmentIds.push(result.id);
        attachmentData.push(result);
      }
    }

    // voice-only: clear any typed text so only the audio is sent
    isNearBottomRef.current = true;
    await sendMessage(
      audioBlob ? "" : textContent,
      attachmentIds,
      attachmentData,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isSmallScreen = window.innerWidth < 768;
    if (e.key === "Enter" && !isSmallScreen && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    const content = contentRef.current;
    if (!el || !content) return;

    let rafId: number | null = null;
    let lastScrollTop = el.scrollTop;

    const nearBottom = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      return scrollHeight - scrollTop - clientHeight <= 100;
    };

    const step = () => {
      rafId = null;
      if (!isNearBottomRef.current) return;
      const diff = el.scrollHeight - el.scrollTop - el.clientHeight + 4;
      if (diff <= 1) {
        el.scrollTop = el.scrollHeight;
        return;
      }
      el.scrollTop += diff * 0.35;
      rafId = requestAnimationFrame(step);
    };

    const startFollow = () => {
      if (rafId === null && isNearBottomRef.current) {
        rafId = requestAnimationFrame(step);
      }
    };

    const ro = new ResizeObserver(() => {
      if (isNearBottomRef.current) startFollow();
    });
    ro.observe(content);

    const resumeIfNearBottom = () => {
      if (!isNearBottomRef.current && nearBottom()) {
        isNearBottomRef.current = true;
        startFollow();
      } else if (isNearBottomRef.current) {
        startFollow();
      }
    };

    // Wheel up = user reading history → pause. Wheel down near bottom → resume.
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < 0) {
        isNearBottomRef.current = false;
      } else {
        resumeIfNearBottom();
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchYRef.current = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      const dy = y - (touchYRef.current ?? y);
      touchYRef.current = y;
      if (dy > 0) {
        isNearBottomRef.current = false;
      } else if (dy < 0) {
        resumeIfNearBottom();
      }
    };

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
      const goingUp = scrollTop < lastScrollTop;
      lastScrollTop = scrollTop;
      if (!goingUp && !isNearBottomRef.current && nearBottom()) {
        isNearBottomRef.current = true;
        startFollow();
      }
    };

    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      ro.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  const checkClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const plainText = markdownToPlainText(text);
      const key = plainText.trim();
      if (key && !getDismissedClipboard().has(key)) {
        setClipboardText(plainText);
        inputRef.current?.blur();
      }
    } catch {}
  }, []);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const handleFocus = () => checkClipboard();
    el.addEventListener("focus", handleFocus);
    return () => {
      el.removeEventListener("focus", handleFocus);
    };
  }, [checkClipboard]);

  useEffect(() => {
    document.body.style.overflow = clipboardText ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [clipboardText]);

  return (
    <div
      className="relative flex flex-col flex-1 bg-white/30 dark:bg-slate-800/40 
                 backdrop-blur-xl rounded-2xl shadow-xl p-3 sm:p-4 md:p-4 max-w-full h-full min-h-0"
      style={{ paddingBottom: "max(1rem, var(--keyboard-height, 0px))" }}
    >
      <OfflineBanner />

      <ChatMessageList
        chatMessages={chatMessages}
        user={user}
        isLoading={isLoading}
        showScrollBtn={showScrollBtn}
        messagesEndRef={messagesEndRef}
        scrollContainerRef={scrollContainerRef}
        contentRef={contentRef}
      />

      {clipboardText && (
        <ClipboardPasteModal
          text={clipboardText}
          onPaste={() => {
            dismissClipboard(clipboardText.trim());
            setInput(clipboardText);
            if (inputRef.current) inputRef.current.textContent = clipboardText;
            setClipboardText(null);
            requestAnimationFrame(() => placeCursorAtEnd(inputRef.current));
          }}
          onCancel={() => {
            dismissClipboard(clipboardText.trim());
            setClipboardText(null);
          }}
        />
      )}

      <ChatInput
        input={input}
        setInput={setInput}
        inputRef={inputRef}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
        isOnline={isOnline}
        isLoading={isLoading}
        attachments={attachments}
        uploadingFiles={uploadingFiles}
        showUploadPopup={showUploadPopup}
        setShowUploadPopup={setShowUploadPopup}
        onFileSelected={handleFileSelected}
        onRemoveAttachment={handleRemoveAttachment}
        onAbort={handleAbort}
        isRecording={isRecording}
        isAudioRecorded={isAudioRecorded}
        audioDuration={audioDuration}
        audioCurrentTime={audioCurrentTime}
        audioUrl={audioUrl}
        isAudioPlaying={isAudioPlaying}
        onMicClick={handleMicClick}
        onDeleteAudio={handleDeleteAudio}
        onPlayAudio={handlePlayAudio}
        onSend={handleSend}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
