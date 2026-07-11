"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useChatStore } from "@/app/store/useChatStore";
import { useMessageStream } from "@/app/hooks/messages/useMessageStream";
import { useStopMessageStream } from "@/app/hooks/messages/useStopMessageStream";
import { useAttachmentUpload } from "@/app/hooks/attachments/useAttachmentUpload";
import { useAttachmentDelete } from "@/app/hooks/attachments/useAttachmentDelete";
import { useVoiceInput } from "@/app/hooks/useVoiceInput";
import { useUserStore } from "@/app/store/useUserStore";
import type { Attachment } from "@/app/interface/type";
import OfflineBanner from "./OfflineBanner";
import ClipboardPasteModal from "./ClipboardPasteModal";
import { ChatMessageList, ChatInput } from "./chat";

export default function ChatWindow() {
  const { user } = useUserStore();

  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [clipboardText, setClipboardText] = useState<string | null>(null);

  const dismissedTexts = useRef(new Set<string>());
  const inputRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    if (inputFocusSignal > 0 && inputRef.current) {
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
    isTranscribing,
    startRecording,
    stopRecording,
    cleanup,
  } = useVoiceInput((text) => {
    setInput(text);
    if (inputRef.current) inputRef.current.textContent = text;
  });

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const handleMicClick = () => {
    if (isTranscribing) return;
    if (isRecording) stopRecording();
    else startRecording();
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
    if (!textContent && attachments.length === 0) return;

    setInput("");
    if (inputRef.current) inputRef.current.textContent = "";

    const attachmentIds = attachments.map((a) => a.id);
    const attachmentData = [...attachments];
    setAttachments([]);

    await sendMessage(textContent, attachmentIds, attachmentData);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isSmallScreen = window.innerWidth < 768;
    if (e.key === "Enter" && !isSmallScreen && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [chatMessages.length]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const checkClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim() && !dismissedTexts.current.has(text.trim())) {
        setClipboardText(text);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const handleVisible = () => {
      if (document.visibilityState === "visible") checkClipboard();
    };
    document.addEventListener("visibilitychange", handleVisible);
    const handleFocus = () => checkClipboard();
    inputRef.current?.addEventListener("focus", handleFocus);
    return () => {
      document.removeEventListener("visibilitychange", handleVisible);
      inputRef.current?.removeEventListener("focus", handleFocus);
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
    >
      <OfflineBanner />

      <ChatMessageList
        chatMessages={chatMessages}
        user={user}
        isLoading={isLoading}
        showScrollBtn={showScrollBtn}
        messagesEndRef={messagesEndRef}
        scrollContainerRef={scrollContainerRef}
      />

      {clipboardText && (
        <ClipboardPasteModal
          text={clipboardText}
          onPaste={() => {
            dismissedTexts.current.add(clipboardText.trim());
            setInput(clipboardText);
            if (inputRef.current) inputRef.current.textContent = clipboardText;
            setClipboardText(null);
            if (inputFocusSignal > 0) {
              inputRef.current?.focus();
            } else {
              triggerInputFocus();
            }
          }}
          onCancel={() => {
            dismissedTexts.current.add(clipboardText.trim());
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
        isTranscribing={isTranscribing}
        onMicClick={handleMicClick}
        onSend={handleSend}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
