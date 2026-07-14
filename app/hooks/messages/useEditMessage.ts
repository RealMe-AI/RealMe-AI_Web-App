import { useCallback } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { useChatStore } from "@/app/store/useChatStore";
import { authFetch } from "@/app/lib/apiClient";
import { parseSSEStream } from "@/app/lib/parseSSEStream";
import { useTypewriter } from "./useTypewriter";
import { Message } from "@/app/interface/type";

function now() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const useEditMessage = () => {
  const {
    messages,
    setMessages,
    updateMessage,
    setIsLoading,
    setAbortController,
  } = useChatStore();
  const typewriter = useTypewriter((text) => updateMessage("ai-temp", { text }));

  const editMessage = useCallback(
    async (messageId: string, newContent: string) => {
      if (!newContent.trim()) return;

      const msgIndex = messages.findIndex((m) => m.id === messageId);
      if (msgIndex === -1) return;

      // Find the AI response immediately after the edited user message
      const nextMsg = messages
        .slice(msgIndex + 1)
        .find((m) => m.sender === "ai");

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
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`Failed to edit message: ${res.status}`);
        if (!res.body) throw new Error("No response body received");

        // Reset typewriter — ensures no leaked text from previous aborted stream
        typewriter.reset();

        // Parse SSE stream with typewriter pacing
        const reader = res.body.getReader();
        await parseSSEStream(reader, (chunk) => typewriter.push(chunk));
        typewriter.flush();
        typewriter.stop();

        // Finalize AI message with real ID
        updateMessage(tempId, {
          id: (Date.now() + 1).toString(),
          text: typewriter.getShown(),
        });
        setIsLoading(false);
      } catch (err: unknown) {
        typewriter.stop();
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setIsLoading(false);
      } finally {
        typewriter.stop();
        setAbortController(null);
      }
    },
    [messages, setMessages, updateMessage, setIsLoading, setAbortController, typewriter],
  );

  return { editMessage };
};
