import { useCallback } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { useChatStore } from "@/app/store/useChatStore";
import { authFetch } from "@/app/lib/apiClient";
import { parseSSEStream } from "@/app/lib/parseSSEStream";
import { useTypewriter } from "./useTypewriter";
import { useCreateConversation } from "./useCreateConversation";
import { useUpdateConversation } from "./useUpdateConversation";
import { useNetworkStatus } from "@/app/hooks/useNetworkStatus";
import { useTranslations } from "next-intl";
import { Message, Attachment } from "@/app/interface/type";

function now() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const useMessageStream = () => {
  const {
    activeConversationId,
    setActiveConversationId,
    addMessage,
    updateMessage,
    setIsLoading,
    triggerChatsRefresh,
    setAbortController,
  } = useChatStore();

  const { createConversation } = useCreateConversation();
  const { updateConversation } = useUpdateConversation();
  const { isOnline } = useNetworkStatus();
  const t = useTranslations();
  const typewriter = useTypewriter((text) => updateMessage("ai-temp", { text }));

  const sendMessage = useCallback(
    async (content: string, attachmentIds?: string[], attachments?: Attachment[]) => {
      if (!isOnline) return;
      if (!content.trim() && (!attachmentIds || attachmentIds.length === 0)) return;

      let currentConversationId = activeConversationId;

      // Auto-create conversation if none active
      if (!currentConversationId) {
        const title = content.trim()
          ? content.substring(0, 50) + (content.length > 50 ? "..." : "")
          : attachments?.[0]?.fileName ?? "File message";
        const newConv = await createConversation(title);
        if (!newConv) {
          console.error("Failed to create conversation");
          return;
        }
        currentConversationId = newConv.id;
        setActiveConversationId(newConv.id);
        triggerChatsRefresh();
      }

      // Add user message optimistically
      const userMsg: Message = {
        id: Date.now().toString(),
        sender: "user",
        type: attachments?.length ? "file" : "text",
        text: content,
        time: now(),
        attachments: attachments && attachments.length > 0 ? attachments : undefined,
      };
      addMessage(userMsg);

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
        await parseSSEStream(
          reader,
          (chunk) => typewriter.push(chunk),
          (meta) => {
            if (meta.type === "message_created" && meta.userMessageId) {
              updateMessage(userMsg.id, { id: meta.userMessageId as string });
            }
          },
        );
        typewriter.flush();
        typewriter.stop();

        // Finalize AI message with real ID
        updateMessage("ai-temp", {
          id: (Date.now() + 1).toString(),
          text: typewriter.getShown(),
        });
        setIsLoading(false);

        // Update conversation metadata
        if (currentConversationId) {
          await updateConversation(currentConversationId, {
            lastMessage: content || attachments?.[0]?.fileName || "File message",
            updatedAt: new Date().toISOString(),
          });
          triggerChatsRefresh();
        }
      } catch (err: unknown) {
        typewriter.stop();
        if (err instanceof Error && err.name === "AbortError") {
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
      activeConversationId,
      setActiveConversationId,
      addMessage,
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
