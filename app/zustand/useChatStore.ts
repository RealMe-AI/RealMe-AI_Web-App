"use client";

import { create } from "zustand";
import { Message } from "../types/type";

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  activeConversationId: number | null;
  setActiveConversationId: (id: number | null) => void;
  setMessages: (messages: Message[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  addUserMessage: (content: string) => void;
  updateAIMessage: (text: string) => void;
  finalizeAIMessage: (text: string) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  activeConversationId: null,

  setActiveConversationId: (id) => set({ activeConversationId: id }),

  setMessages: (messages) => set({ messages }),

  setIsLoading: (isLoading) => set({ isLoading }),

  // Add user message to the store
  addUserMessage: (content: string) => {
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

    set((state) => ({
      messages: [...state.messages, userMsg],
    }));
  },

  // Update or add AI message during streaming
  updateAIMessage: (text: string) => {
    set((state) => {
      const hasTemp = state.messages.some((m) => m.id === "ai-temp");
      return {
        messages: hasTemp
          ? state.messages.map((m) =>
              m.id === "ai-temp" ? { ...m, text } : m
            )
          : [
              ...state.messages,
              {
                id: "ai-temp",
                sender: "ai" as const,
                type: "text" as const,
                text,
                time: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            ],
      };
    });
  },

  // Finalize AI message when streaming is complete
  finalizeAIMessage: (text: string) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === "ai-temp"
          ? { ...m, id: Date.now().toString(), text }
          : m
      ),
    }));
  },

  // Clear messages
  clearMessages: () => set({ messages: [] }),
}));