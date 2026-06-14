import { create } from "zustand";
import { ChatState } from "../interface/type";

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  chats: [],
  isLoading: false,
  activeConversationId: null,

  setMessages: (messagesOrUpdater) =>
    set((state) => {
      if (typeof messagesOrUpdater === "function") {
        return { messages: messagesOrUpdater(state.messages) };
      }
      return { messages: messagesOrUpdater };
    }),
  setConversations: (chatsOrUpdater) =>
    set((state) => {
      if (typeof chatsOrUpdater === "function") {
        return { chats: chatsOrUpdater(state.chats) };
      }
      return { chats: chatsOrUpdater };
    }),
  updateChatTitle: (id, title) =>
    set((state) => ({
      chats: state.chats.map((c) => (c.id === id ? { ...c, title } : c)),
    })),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg,
      ),
    })),
  setIsLoading: (isLoading) => set({ isLoading }),
  setActiveConversationId: (id) => set({ activeConversationId: id }),

  // Refresh signal for conversation list
  chatsRefreshSignal: 0,
  triggerChatsRefresh: () =>
    set((state) => ({ chatsRefreshSignal: state.chatsRefreshSignal + 1 })),

  // Signal to focus chat input
  inputFocusSignal: 0,
  triggerInputFocus: () =>
    set((state) => ({ inputFocusSignal: state.inputFocusSignal + 1 })),
  abortController: null,
  setAbortController: (controller) => set({ abortController: controller }),
  abortMessage: () =>
    set((state) => {
      if (state.abortController) {
        state.abortController.abort();
      }
      return { isLoading: false, abortController: null };
    }),
}));
