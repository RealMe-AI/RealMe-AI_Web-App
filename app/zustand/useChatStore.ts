"use client";

import { create } from "zustand";
import { ChatState, Message } from "../types/type";
import { baseUrl } from "../lib/baseUrl";

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  activeConversationId: null,

  setActiveConversationId: (id) => set({ activeConversationId: id }),

  fetchMessages: async (conversationId: number) => {
    set({ isLoading: true });
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No access token found");
      set({ isLoading: false });
      // Optionally redirect or handle error
      return;
    }

    try {
      console.log(`Fetching messages for conversation ${conversationId}...`);
      // USER SPECIFIED: GET /conversations/{id} fetches messages (or conversation details including messages)
      const res = await fetch(`${baseUrl}/conversations/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`);

      const data = await res.json();
      // Assuming data structure. If it returns the conversation object with a 'messages' array:
      // Adjust based on actual API response structure if needed.
      // For now assuming data.messages exists or data IS the array?
      // A common pattern for "GET /conversations/{id}" is returning the conversation object.

      let messages: Message[] = [];

      // Handle different possible structures safely
      if (Array.isArray(data)) {
        messages = data;
      } else if (data.messages && Array.isArray(data.messages)) {
        messages = data.messages;
      } else if (data.items && Array.isArray(data.items)) {
        messages = data.items;
      }

      // Ensure messages are valid Message objects if needed (mapping)
      // Check if mapping is needed based on raw data vs Message type
      // For now, assuming raw data matches or is close enough.

      set({ messages, isLoading: false });
    } catch (err) {
      console.error("Error fetching messages:", err);
      set({ isLoading: false });
    }
  },

  sendMessage: async (content: string) => {
    console.log("sendMessage called with:", content, "baseUrl:", baseUrl);
    if (!content.trim()) return;

    const { activeConversationId } = get();

    if (!activeConversationId) {
      console.error("No active conversation selected.");
      // Should we create one? For now, error out to ensure flow is correct.
      // Or handle creation here if ID is null.
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(), // Temp ID
      sender: "user",
      type: "text",
      text: content,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Add user message + set loading
    set((state) => ({
      messages: [...state.messages, userMsg],
      isLoading: true,
    }));

    /* import { baseUrl } from "../lib/baseUrl"; // Ensure this import is added at top */

    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No access token found");
      set({ isLoading: false });
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationId: activeConversationId,
          content,
          model: "llama-3.1-8b-instant",
        }),
      });

      if (!res.ok) {
        let errorMsg = `API Error ${res.status}`;
        try {
          const json = await res.json();
          errorMsg += `: ${json.error || JSON.stringify(json)}`;
        } catch {
          const text = await res.text();
          errorMsg += `: ${text}`;
        }
        throw new Error(errorMsg);
      }

      if (!res.body) throw new Error("No stream received");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiText = "";

      // Stream AI response chunks
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiText += decoder.decode(value);

        set((state) => {
          const hasTemp = state.messages.some((m) => m.id === "ai-temp");
          return {
            messages: hasTemp
              ? state.messages.map((m) =>
                  m.id === "ai-temp" ? { ...m, text: aiText } : m
                )
              : [
                  ...state.messages,
                  {
                    id: "ai-temp",
                    sender: "ai" as const,
                    type: "text" as const,
                    text: aiText,
                    time: new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  },
                ],
          };
        });
      }

      // Finalize AI message
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === "ai-temp"
            ? { ...m, id: Date.now().toString(), text: aiText }
            : m
        ),
        isLoading: false,
      }));
    } catch (err) {
      console.error("Chat error:", err);
      set({ isLoading: false });
    }
  },
}));
