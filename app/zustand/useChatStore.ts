"use client";

import { create } from "zustand";
import { ChatState, Message } from "../types/type";

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,

  sendMessage: async (content: string) => {
    if (!content.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
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

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

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
