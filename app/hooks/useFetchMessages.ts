// Retrieve all messages in a specific conversation When a user clicks on a chat in the sidebar to view its history

import { useCallback } from "react";
import { baseUrl } from "../lib/baseUrl";
import { useChatStore } from "../zustand/useChatStore";
import { useAuthStore } from "../zustand/useAuthStore";
import { RawMessage, Message, MessageResponse } from "../types/type";

export const useFetchMessages = () => {
  const { setMessages, setIsLoading } = useChatStore();

  const fetchMessages = useCallback(
    async (conversationId: number) => {
      setIsLoading(true);
      useChatStore.setState({ activeConversationId: conversationId }); // Update directly or use setter if available
      const token = useAuthStore.getState().accessToken;
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
        // Check both 'sender' and 'role' fields since backend might use either
        const getSenderType = (m: RawMessage): "user" | "ai" => {
          const senderValue = m.sender || m.role || "";

          // Debug log to see what backend returns
          console.log("Message sender/role:", {
            sender: m.sender,
            role: m.role,
            resolved: senderValue,
          });

          // Check for AI variants
          if (
            senderValue === "assistant" ||
            senderValue === "assistantMessage" ||
            senderValue === "ai"
          ) {
            return "ai";
          }
          // Check for user
          if (senderValue === "user") {
            return "user";
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
