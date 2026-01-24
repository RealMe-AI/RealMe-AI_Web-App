import { create } from "zustand";
import { ChatState } from "../types/type";

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  chats: [],
  isLoading: false,
  activeConversationId: null,

  setMessages: (messagesOrUpdater) =>
    set((state) => ({
      messages:
        typeof messagesOrUpdater === "function"
          ? (messagesOrUpdater as any)(state.messages)
          : messagesOrUpdater,
    })),
  setConversations: (chatsOrUpdater) =>
    set((state) => ({
      chats:
        typeof chatsOrUpdater === "function"
          ? (chatsOrUpdater as any)(state.chats)
          : chatsOrUpdater,
    })),
  updateChatTitle: (id, title) =>
    set((state) => ({
      chats: state.chats.map((c) => (c.id === id ? { ...c, title } : c)),
    })),
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
