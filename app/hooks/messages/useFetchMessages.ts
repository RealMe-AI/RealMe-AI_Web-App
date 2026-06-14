import { useCallback } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { useChatStore } from "@/app/store/useChatStore";
import { authFetch } from "@/app/lib/apiClient";
import { RawMessage, Message, MessageResponse } from "@/app/types/type";

export const useFetchMessages = () => {
  const { setMessages, setIsLoading } = useChatStore();

  const fetchMessages = useCallback(
    async (conversationId: number) => {
      setIsLoading(true);
      useChatStore.setState({ activeConversationId: conversationId });

      try {
        const res = await authFetch(
          `${baseUrl}/conversations/${conversationId}`,
          {
            method: "GET",
          },
        );

        if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`);
        const data: MessageResponse = await res.json();

        let messages: Message[] = [];

        const getSenderType = (m: RawMessage): "user" | "ai" => {
          const senderValue = m.sender || m.role || "";
          if (
            senderValue === "assistant" ||
            senderValue === "assistantMessage" ||
            senderValue === "ai"
          ) {
            return "ai";
          }
          return "user";
        };

        const mapRaw = (m: RawMessage): Message => ({
          id: m.id ?? Date.now().toString(),
          sender: getSenderType(m),
          type: "text",
          text:
            getSenderType(m) === "ai"
              ? m.content || m.text || ""
              : m.text || m.content || "",
          time: m.createdAt
            ? new Date(m.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
        });

        const sortRawMessages = (rawMsgs: RawMessage[]): RawMessage[] => {
          return [...rawMsgs].sort((a, b) => {
            const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return aTime - bTime;
          });
        };

        if (Array.isArray(data)) {
          messages = sortRawMessages(data).map(mapRaw);
        } else if (data.messages && Array.isArray(data.messages)) {
          messages = sortRawMessages(data.messages).map(mapRaw);
        } else if (data.userMessage && data.assistantMessage) {
          const sorted = sortRawMessages([
            data.userMessage,
            data.assistantMessage,
          ]);
          messages = sorted.map(mapRaw);
        } else if (data.items && Array.isArray(data.items)) {
          messages = sortRawMessages(data.items).map(mapRaw);
        }

        setMessages(messages);
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [setMessages, setIsLoading],
  );

  return { fetchMessages };
};
