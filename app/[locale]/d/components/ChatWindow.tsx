"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useChatStore } from "@/app/store/useChatStore";
import { useMessageStream } from "@/app/hooks/messages/useMessageStream";
import { useStopMessageStream } from "@/app/hooks/messages/useStopMessageStream";
import { useAttachmentUpload } from "@/app/hooks/attachments/useAttachmentUpload";
import { useAttachmentDelete } from "@/app/hooks/attachments/useAttachmentDelete";
import { useAudioRecorder } from "@/app/hooks/useAudioRecorder";
import { useUserStore } from "@/app/store/useUserStore";
import type { Attachment } from "@/app/interface/type";
import { IMAGE_RESET_HOURS, MAX_IMAGE_ATTACHMENTS } from "@/app/lib/constants";
import { showToast } from "@/app/lib/toast";
import OfflineBanner from "./OfflineBanner";
import ClipboardPasteModal from "./clipboard/ClipboardPasteModal";
import { getDismissedClipboard, dismissClipboard } from "./clipboard/dismiss";
import { ChatMessageList, ChatInput } from "./chat";
import Lightbox from "@/app/[locale]/components/Lightbox";
import markdownToPlainText from "@/app/lib/markdownToPlainText";
import { placeCursorAtEnd, placeCursorAtStart } from "./chat/cursorUtils";
import { useImageLimitStore } from "@/app/store/useImageLimitStore";
import { useSingleAttachmentGuard } from "@/app/hooks/attachments/useSingleAttachmentGuard";

export default function ChatWindow() {
  const { user } = useUserStore();
  const t = useTranslations();

  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [clipboardText, setClipboardText] = useState<string | null>(null);
  const { imageUploadTimes, addImage, addImages, removeImage, pruneExpired } = useImageLimitStore();
  const [tick, setTick] = useState(0);

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
    abortController,
    inputFocusSignal,
    triggerInputFocus,
  } = useChatStore();
  const isStreaming = isLoading && abortController !== null;
  const { sendMessage, isOnline } = useMessageStream();
  const { stopStream } = useStopMessageStream();
  const { uploadFile, uploadFiles, uploadingFiles } = useAttachmentUpload();
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

  const pendingImagesRef = useRef(0);

  const formatHours = (ms: number): string => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const hoursRemaining = useMemo(() => {
    if (imageUploadTimes.size === 0) return 0;
    const earliest = Math.min(...imageUploadTimes.values());
    // eslint-disable-next-line react-hooks/purity
    const elapsed = Date.now() - earliest;
    const totalLimit = IMAGE_RESET_HOURS * 3600 * 1000;
    return Math.max(0, totalLimit - elapsed);
  }, [imageUploadTimes, tick]);

  const handleFileSelected = async (file: File) => {
    const isImage = file.type.startsWith("image/");
    const currentImages =
      attachments.filter((a) => a.type === "image").length +
      pendingImagesRef.current;
    const isOverLimit = currentImages >= MAX_IMAGE_ATTACHMENTS;
    const isWithinResetWindow = hoursRemaining > 0;
    if (isImage && isOverLimit && isWithinResetWindow) {
      const timeStr = formatHours(hoursRemaining);
      showToast.error(
        t("fileupload.hourly_reset", {
          count: MAX_IMAGE_ATTACHMENTS,
          time: timeStr,
        }),
      );
      return;
    }
    if (isImage && isOverLimit) {
      showToast.error(
        t("fileupload.max_images", { count: MAX_IMAGE_ATTACHMENTS }),
      );
      return;
    }
    if (isImage) pendingImagesRef.current += 1;
    const result = await uploadFile(file);
    if (result) {
      if (isImage) pendingImagesRef.current -= 1;
      setAttachments((prev) => [...prev, result]);
      if (result.type === "image") addImage(result.id);
    } else if (isImage) {
      pendingImagesRef.current -= 1;
    }
  };

  const handleMultipleFilesSelected = async (files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    const currentImages =
      attachments.filter((a) => a.type === "image").length +
      pendingImagesRef.current;
    if (
      imageFiles.length > 0 &&
      currentImages + imageFiles.length > MAX_IMAGE_ATTACHMENTS
    ) {
      if (hoursRemaining > 0) {
        showToast.error(
          t("fileupload.hourly_reset", {
            count: MAX_IMAGE_ATTACHMENTS,
            time: formatHours(hoursRemaining),
          }),
        );
      } else {
        showToast.error(
          t("fileupload.max_images", { count: MAX_IMAGE_ATTACHMENTS }),
        );
      }
      return;
    }
    if (imageFiles.length > 0) pendingImagesRef.current += imageFiles.length;
    const result = await uploadFiles(files);
    if (result) {
      if (imageFiles.length > 0) pendingImagesRef.current -= imageFiles.length;
      setAttachments((prev) => [...prev, ...result]);
      const imageIds = result.filter((a) => a.type === "image").map((a) => a.id);
      if (imageIds.length > 0) addImages(imageIds);
    } else {
      if (imageFiles.length > 0) pendingImagesRef.current -= imageFiles.length;
    }
  };

  // TEMP: 1-attachment guard — remove when backend supports multi-attachment
  const { guardedFileSelected, guardedMultipleSelected } =
    useSingleAttachmentGuard({
      attachmentsLength: attachments.length,
      onFileSelected: handleFileSelected,
      onMultipleFilesSelected: handleMultipleFilesSelected,
    });

  const imageCount = imageUploadTimes.size;
  const imagesAtLimit = imageCount >= MAX_IMAGE_ATTACHMENTS;

  const handleRemoveAttachment = async (attachmentId: string) => {
    await deleteAttachment(attachmentId);
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
    removeImage(attachmentId);
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

  useEffect(() => {
    if (imageUploadTimes.size === 0) return;
    const id = setInterval(() => {
      pruneExpired();
      setTick((t) => t + 1);
    }, 60000);
    return () => clearInterval(id);
  }, [imageUploadTimes.size, pruneExpired]);

  return (
    <div
      className="relative flex flex-col flex-1 bg-white/30 dark:bg-black 
                 backdrop-blur-xl rounded-2xl shadow-xl p-3 sm:p-4 md:p-4 max-w-full h-full min-h-0"
      style={{ paddingBottom: "max(1rem, var(--keyboard-height, 0px))" }}
    >
      <OfflineBanner />

      <ChatMessageList
        chatMessages={chatMessages}
        user={user}
        isLoading={isStreaming}
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
        isLoading={isStreaming}
        attachments={attachments}
        uploadingFiles={uploadingFiles}
        imageCount={imageCount}
        imagesAtLimit={imagesAtLimit}
        hoursRemaining={hoursRemaining}
        attachmentCount={attachments.length}
        showUploadPopup={showUploadPopup}
        setShowUploadPopup={setShowUploadPopup}
        onFileSelected={guardedFileSelected}
        onMultipleFilesSelected={guardedMultipleSelected}
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

      <Lightbox />
    </div>
  );
}
