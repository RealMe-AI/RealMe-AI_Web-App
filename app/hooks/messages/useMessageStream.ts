import { useCallback } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { useChatStore } from "@/app/store/useChatStore";
import { authFetch } from "@/app/lib/apiClient";
import { parseSSEStream } from "@/app/lib/parseSSEStream";
import { useTypewriter } from "./useTypewriter";
import sanitizeAsterisks from "@/app/lib/sanitizeMarkdown";
import { useCreateConversation } from "./useCreateConversation";
import { useUpdateConversation } from "./useUpdateConversation";
import { useNetworkStatus } from "@/app/hooks/useNetworkStatus";
import { useTranslations } from "next-intl";
import { Message, Attachment } from "@/app/interface/type";
import { prefetchAudio } from "@/app/store/ttsPrefetch";

function now() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getConversationLabel(
  content: string,
  attachments?: Attachment[],
  truncate = true,
) {
  if (attachments?.some((a) => a.type === "audio")) {
    return "Voice message";
  }
  const text = content.trim();
  if (text) {
    if (truncate) {
      return text.substring(0, 50) + (text.length > 50 ? "..." : "");
    }
    return text;
  }
  return attachments?.[0]?.fileName ?? "File message";
}

export const useMessageStream = () => {
  const {
    setActiveConversationId,
    addMessage,
    updateMessage,
    removeMessage,
    setIsLoading,
    triggerChatsRefresh,
    setAbortController,
  } = useChatStore();

  const { createConversation } = useCreateConversation();
  const { updateConversation } = useUpdateConversation();
  const { isOnline } = useNetworkStatus();
  const t = useTranslations();
  const typewriter = useTypewriter((text) => updateMessage("ai-temp", { text: sanitizeAsterisks(text) }));

  const sendMessage = useCallback(
    async (content: string, attachmentIds?: string[], attachments?: Attachment[]) => {
      if (!isOnline) return;
      if (!content.trim() && (!attachmentIds || attachmentIds.length === 0)) return;

      let currentConversationId = useChatStore.getState().activeConversationId;

      // Add user message optimistically — render immediately, before any API calls
      const audioAtt = attachments?.find((a) => a.type === "audio");
      const userMsg: Message = {
        id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        sender: "user",
        type: audioAtt ? "audio" : attachments?.length ? "file" : "text",
        text: content,
        time: now(),
        audioUrl: audioAtt?.url,
        attachments: attachments && attachments.length > 0 ? attachments : undefined,
      };
      addMessage(userMsg);

      // Auto-create conversation if none active
      if (!currentConversationId) {
        const title = getConversationLabel(content, attachments);
        const newConv = await createConversation(title);
        if (!newConv) {
          console.error("Failed to create conversation");
          removeMessage(userMsg.id);
          return;
        }
        currentConversationId = newConv.id;
        setActiveConversationId(newConv.id);
        triggerChatsRefresh();
      }

      // Set up abort controller
      const controller = new AbortController();
      setIsLoading(true);
      setAbortController(controller);

      try {
        const body: Record<string, unknown> = {
          conversationId: currentConversationId,
          content
        };
        if (attachmentIds?.length) {
          body.attachmentIds = attachmentIds;
        }

        const res = await authFetch(`${baseUrl}/messages/stream`, {
          method: "POST",
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`Failed to send message: ${res.status}`);
        if (!res.body) throw new Error("No response body received");

        const isMediaOnly =
          !content.trim() &&
          (attachments ?? []).some(
            (a) => a.type === "image" || a.type === "audio",
          );

        // Reset typewriter — ensures no leaked text from previous aborted stream
        typewriter.reset();

        // Create temp AI message
        const tempMsg: Message = {
          id: "ai-temp",
          sender: "ai",
          type: "text",
          text: "",
          time: now(),
        };
        addMessage(tempMsg);

        // Parse SSE stream with typewriter pacing
        const reader = res.body.getReader();
        const { messageId } = await parseSSEStream(
          reader,
          (chunk) => typewriter.push(chunk),
          (meta) => {
            if (meta.type === "message_created" && meta.userMessageId) {
              const text = (meta.content || meta.userMessageContent || "") as string;
              const displayText = text && !isMediaOnly ? text : "";
              updateMessage(userMsg.id, {
                id: meta.userMessageId as string,
                ...(displayText ? { text: displayText } : {}),
              });
            }
          },
        );
        typewriter.flush();
        typewriter.stop();

        // Finalize AI message with real ID (fallback keeps a stable id)
        updateMessage("ai-temp", {
          id: messageId ?? `ai-${Date.now()}`,
          text: sanitizeAsterisks(typewriter.getShown()),
        });
        setIsLoading(false);

        // Prefetch TTS audio in the background so playback is instant later
        if (messageId) {
          prefetchAudio(messageId);
        }

        // Update conversation
        if (currentConversationId) {
          const lastMessage = getConversationLabel(content, attachments, false);
          await updateConversation(currentConversationId, {
            lastMessage,
            updatedAt: new Date().toISOString(),
          });
          triggerChatsRefresh();
        }
      } catch (err: unknown) {
        typewriter.stop();
        if (err instanceof Error && err.name === "AbortError") {
          updateMessage("ai-temp", {
            id: (Date.now() + 1).toString(),
            text: sanitizeAsterisks(typewriter.getShown()),
          });
          setIsLoading(false);
          return;
        }

        addMessage({
          id: (Date.now() + 1).toString(),
          sender: "ai",
          type: "text",
          text: t("error.message.failed"),
          time: now(),
        });
        setIsLoading(false);
      } finally {
        typewriter.stop();
        setAbortController(null);
      }
    },
    [
      setActiveConversationId,
      addMessage,
      removeMessage,
      updateMessage,
      setIsLoading,
      triggerChatsRefresh,
      setAbortController,
      createConversation,
      updateConversation,
      isOnline,
      t,
      typewriter,
    ],
  );

  return { sendMessage, isOnline };
};
