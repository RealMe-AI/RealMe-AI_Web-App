import { create } from "zustand";
import { ChatState } from "../types/type";

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  activeConversationId: null,

  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg
      ),
    })),
  setIsLoading: (isLoading) => set({ isLoading }),
  setActiveConversationId: (id) => set({ activeConversationId: id }),

  // Refresh signal for conversation list
  chatsRefreshSignal: 0,
  triggerChatsRefresh: () =>
    set((state) => ({ chatsRefreshSignal: state.chatsRefreshSignal + 1 })),
}));
