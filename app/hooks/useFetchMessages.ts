// Retrieve all messages in a specific conversation When a user clicks on a chat in the sidebar to view its history

import { useCallback } from "react";
import { baseUrl } from "../lib/baseUrl";
import { useChatStore } from "../zustand/useChatStore";
import { RawMessage, Message, MessageResponse } from "../types/type";

export const useFetchMessages = () => {
  const { setMessages, setIsLoading } = useChatStore();

  const fetchMessages = useCallback(
    async (conversationId: number) => {
      setIsLoading(true);
      useChatStore.setState({ activeConversationId: conversationId }); // Update directly or use setter if available
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No access token found");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${baseUrl}/conversations/${conversationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`);
        const data: MessageResponse = await res.json();

        let messages: Message[] = [];

        // Helper to normalize a raw message - FIXED SENDER MAPPING
        const mapRaw = (m: RawMessage): Message => ({
          id: m.id ?? Date.now().toString(),
          sender:
            m.sender === "assistantMessage" || m.sender === "assistant"
              ? "ai"
              : "user",
          type: "text",
          text:
            m.sender === "assistantMessage" || m.sender === "assistant"
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

        // Helper to sort raw messages by createdAt before mapping
        const sortRawMessages = (rawMsgs: RawMessage[]): RawMessage[] => {
          return [...rawMsgs].sort((a, b) => {
            const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            // Oldest first, newest last
            return aTime - bTime;
          });
        };

        // Case 1: API returns array directly
        if (Array.isArray(data)) {
          messages = sortRawMessages(data).map(mapRaw);
        }
        // Case 2: API returns object with messages array
        else if (data.messages && Array.isArray(data.messages)) {
          messages = sortRawMessages(data.messages).map(mapRaw);
        }
        // Case 3: API returns single user + assistant messages
        else if (data.userMessage && data.assistantMessage) {
          const sorted = sortRawMessages([
            data.userMessage,
            data.assistantMessage,
          ]);
          messages = sorted.map(mapRaw);
        }
        // Case 4: fallback for items array
        else if (data.items && Array.isArray(data.items)) {
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
