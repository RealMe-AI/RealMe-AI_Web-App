import { useCallback } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { useChatStore } from "@/app/store/useChatStore";
import { authFetch } from "@/app/lib/apiClient";
import { Message } from "@/app/interface/type";

function now() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const useEditMessage = () => {
  const { messages, setMessages, updateMessage, setIsLoading, setAbortController } =
    useChatStore();

  const editMessage = useCallback(
    async (messageId: string, newContent: string) => {
      if (!newContent.trim()) return;

      const msgIndex = messages.findIndex((m) => m.id === messageId);
      if (msgIndex === -1) return;

      // Find the AI response immediately after the edited user message
      const nextMsg = messages.slice(msgIndex + 1).find((m) => m.sender === "ai");

      const tempId = "ai-temp";
      const tempMsg: Message = {
        id: tempId,
        sender: "ai",
        type: "text",
        text: "",
        time: now(),
      };

      // Batch update: update user message text, remove old AI response,
      // and insert temp AI message at the correct position
      setMessages((prev) => {
        const withEdit = prev.map((m) =>
          m.id === messageId ? { ...m, text: newContent } : m,
        );
        const filtered = nextMsg
          ? withEdit.filter((m) => m.id !== nextMsg.id)
          : withEdit;
        const insertIdx = filtered.findIndex((m) => m.id === messageId);
        filtered.splice(insertIdx + 1, 0, tempMsg);
        return filtered;
      });

      // Set up abort controller
      const controller = new AbortController();
      setIsLoading(true);
      setAbortController(controller);

      try {
        const res = await authFetch(`${baseUrl}/messages/${messageId}/stream`, {
          method: "PATCH",
          body: JSON.stringify({ content: newContent }),
        });

        if (!res.ok) throw new Error(`Failed to edit message: ${res.status}`);
        if (!res.body) throw new Error("No response body received");

        // Parse SSE stream
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let aiText = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;

            const data = trimmed.slice(6);

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
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          console.log("Edit generation stopped by user");
          return;
        }

        console.error("Edit stream error:", err);
        setIsLoading(false);
      } finally {
        setAbortController(null);
      }
    },
    [
      messages,
      setMessages,
      updateMessage,
      setIsLoading,
      setAbortController,
    ],
  );

  return { editMessage };
};
