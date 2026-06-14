import { useCallback } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { useChatStore } from "@/app/store/useChatStore";
import { authFetch } from "@/app/lib/apiClient";
import { useCreateConversation } from "./useCreateConversation";
import { useUpdateConversation } from "./useUpdateConversation";
import { Message } from "@/app/interface/type";

function now() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function errorMessage(): Message {
  return {
    id: (Date.now() + 1).toString(),
    sender: "ai",
    type: "text",
    text: "Sorry, something went wrong. Please try again.",
    time: now(),
  };
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

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      let currentConversationId = activeConversationId;

      // Auto-create conversation if none active
      if (!currentConversationId) {
        const title =
          content.substring(0, 50) + (content.length > 50 ? "..." : "");
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
        type: "text",
        text: content,
        time: now(),
      };
      addMessage(userMsg);

      // Set up abort controller
      const controller = new AbortController();
      setIsLoading(true);
      setAbortController(controller);

      try {
        const res = await authFetch(`${baseUrl}/messages/stream`, {
          method: "POST",
          body: JSON.stringify({
            conversationId: currentConversationId,
            content,
            model: "llama-3.1-8b-instant",
          }),
        });

        if (!res.ok) throw new Error(`Failed to send message: ${res.status}`);
        if (!res.body) throw new Error("No response body received");

        // Parse SSE stream
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let aiText = "";
        let buffer = "";

        // Create temp AI message
        const tempId = "ai-temp";
        const tempMsg: Message = {
          id: tempId,
          sender: "ai",
          type: "text",
          text: "",
          time: now(),
        };
        addMessage(tempMsg);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process SSE lines
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;

            const data = trimmed.slice(6);

            // Handle end-of-stream sentinel
            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data);
              const chunk =
                parsed.content || parsed.text || parsed.delta?.content || "";
              if (chunk) {
                aiText += chunk;
                updateMessage(tempId, { text: aiText });
              }
            } catch {
              // Plain text chunk, not JSON
              aiText += data;
              updateMessage(tempId, { text: aiText });
            }
          }
        }

        // Finalize AI message with real ID
        updateMessage(tempId, {
          id: (Date.now() + 1).toString(),
          text: aiText,
        });
        setIsLoading(false);

        // Update conversation metadata
        if (currentConversationId) {
          await updateConversation(currentConversationId, {
            lastMessage: content,
            updatedAt: new Date().toISOString(),
          });
          triggerChatsRefresh();
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          console.log("Chat generation stopped by user");
          return;
        }

        console.error("Stream error:", err);
        addMessage(errorMessage());
        setIsLoading(false);
      } finally {
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
    ],
  );

  return { sendMessage };
};
