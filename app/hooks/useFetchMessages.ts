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

        // Case 1: API returns array directly
        if (Array.isArray(data)) {
          messages = data.map(mapRaw);
        }
        // Case 2: API returns object with messages array
        else if (data.messages && Array.isArray(data.messages)) {
          messages = data.messages.map(mapRaw);
        }
        // Case 3: API returns single user + assistant messages
        else if (data.userMessage && data.assistantMessage) {
          messages = [mapRaw(data.userMessage), mapRaw(data.assistantMessage)];
        }
        // Case 4: fallback for items array
        else if (data.items && Array.isArray(data.items)) {
          messages = data.items.map(mapRaw);
        }

        // FIXED SORTING: Sort by ID (timestamp-based) in ascending order
        messages.sort((a, b) => {
          const aTime = parseInt(a.id) || 0;
          const bTime = parseInt(b.id) || 0;
          return aTime - bTime;
        });

        setMessages(messages);
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [setMessages, setIsLoading]
  );

  return { fetchMessages };
};
