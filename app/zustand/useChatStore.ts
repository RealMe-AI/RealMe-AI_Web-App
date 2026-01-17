"use client";

import { create } from "zustand";
import { ChatState, Message } from "../types/type";
import { baseUrl } from "../lib/baseUrl";

// Raw API message type
interface RawMessage {
  id: string;
  sender: "user" | "assistant" | "assistantMessage";
  text?: string;
  content?: string;
  createdAt: string;
}

// API response for single message send
interface MessageResponse {
  userMessage?: RawMessage;
  assistantMessage?: RawMessage;
  messages?: RawMessage[];
  items?: RawMessage[];
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  activeConversationId: null,

  setActiveConversationId: (id) => set({ activeConversationId: id }),

  fetchMessages: async (conversationId: number) => {
    set({ isLoading: true, activeConversationId: conversationId });
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No access token found");
      set({ isLoading: false });
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`);
      const data: MessageResponse = await res.json();

      let messages: Message[] = [];

      // Helper to normalize a raw message
      const mapRaw = (m: RawMessage): Message => ({
        id: m.id ?? Date.now().toString(),
        sender: m.sender === "assistantMessage" || m.sender === "assistant" ? "ai" : "user",
        type: "text",
        text: m.sender === "assistantMessage" || m.sender === "assistant"
          ? m.content || ""
          : m.text || m.content || "",
        time: m.createdAt
          ? new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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

      set({ messages, isLoading: false });
    } catch (err) {
      console.error("Error fetching messages:", err);
      set({ isLoading: false });
    }
  },

  sendMessage: async (content: string) => {
    if (!content.trim()) return;

    const { activeConversationId } = get();
    if (!activeConversationId) {
      console.error("No active conversation selected.");
      return;
    }

    // Add user message immediately
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      type: "text",
      text: content,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isLoading: true,
    }));

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

      if (!res.ok) throw new Error(`Failed to send message: ${res.status}`);

      // Check if response is streaming or JSON
      const contentType = res.headers.get("content-type");
      
      if (contentType?.includes("application/json")) {
        // Handle JSON response
        const data: MessageResponse = await res.json();
        
        // Extract AI response from the JSON structure
        let aiText = "";
        if (data.assistantMessage?.content) {
          aiText = data.assistantMessage.content;
        } else if (data.assistantMessage?.text) {
          aiText = data.assistantMessage.text;
        }

        if (aiText) {
          const aiMsg: Message = {
            id: data.assistantMessage?.id || Date.now().toString(),
            sender: "ai",
            type: "text",
            text: aiText,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };

          set((state) => ({
            messages: [...state.messages, aiMsg],
            isLoading: false,
          }));

          // Update conversation after successful message
          await updateConversationDetails(activeConversationId, content, token);
        } else {
          throw new Error("No AI response found in JSON");
        }
      } else if (res.body) {
        // Handle streaming response
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let aiText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          aiText += chunk;

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
                      sender: "ai",
                      type: "text",
                      text: aiText,
                      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    },
                  ],
            };
          });
        }

        // Finalize AI message
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === "ai-temp" ? { ...m, id: Date.now().toString(), text: aiText } : m
          ),
          isLoading: false,
        }));

        // Update conversation after streaming complete
        await updateConversationDetails(activeConversationId, content, token);
      } else {
        throw new Error("No response body received");
      }
    } catch (err) {
      console.error("Chat error:", err);
      set((state) => ({
        messages: [
          ...state.messages,
          {
            id: Date.now().toString(),
            sender: "ai",
            type: "text",
            text: "Sorry, something went wrong. Please try again.",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ],
        isLoading: false,
      }));
    }
  },
}));

// Helper function to update conversation details
async function updateConversationDetails(
  conversationId: number,
  lastMessage: string,
  token: string
) {
  try {
    // Generate a title from the first message if needed
    const title = lastMessage.length > 50 
      ? lastMessage.substring(0, 50) + "..." 
      : lastMessage;

    const res = await fetch(`${baseUrl}/conversations/${conversationId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        lastMessage,
        title,
        updatedAt: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      console.warn(`Failed to update conversation: ${res.status}`);
    }
  } catch (err) {
    console.warn("Error updating conversation details:", err);
  }
}