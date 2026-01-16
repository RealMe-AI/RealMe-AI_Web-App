import { create } from "zustand";

export type FileMessage = {
  id: string;
  type: "file";
  fileName: string;
  fileSize: number;
  fileType: string;
  fileObject: File;
  sender: "user";
  time: string;
};

export type TextMessage = {
  id: string;
  type: "text";
  text: string;
  sender: "user" | "ai";
  time: string;
};

interface SendFileMessageStore {
  messages: (FileMessage | TextMessage)[];
  pendingFiles: File[];
  plan: "free" | "pro";
  dailyUploadCount: number;
  lastUploadDate: string;
  addPendingFile: (file: File) => void;
  removePendingFile: (index: number) => void;
  clearPendingFiles: () => void;
  sendFilesWithText: (text?: string) => void;
  addAIMessage: (content: string) => void;
  setPlan: (plan: "free" | "pro") => void;
}

export const useSendFileMessage = create<SendFileMessageStore>((set, get) => {
  const today = new Date().toISOString().split("T")[0];
  const isBrowser = typeof window !== "undefined";
  const storedCount = isBrowser ? Number(localStorage.getItem("dailyUploadCount") || "0") : 0;
  const storedDate = isBrowser ? localStorage.getItem("lastUploadDate") || today : null;

  return {
    messages: [],
    pendingFiles: [],
    plan: "free",
    dailyUploadCount: storedDate === today ? storedCount : 0,
    lastUploadDate: today,

    setPlan: (plan) => set({ plan }),

    addPendingFile: (file) => {
      const { plan, dailyUploadCount, lastUploadDate } = get();
      const todayStr = new Date().toISOString().split("T")[0];
      let count = dailyUploadCount;
      let date = lastUploadDate;

      if (lastUploadDate !== todayStr) {
        count = 0;
        date = todayStr;
      }

      if (plan === "free" && count >= 3) {
        alert("Free plan allows only 3 documents per day.");
        return;
      }

      set((state) => ({
        pendingFiles: [...state.pendingFiles, file],
        dailyUploadCount: plan === "free" ? count + 1 : state.dailyUploadCount,
        lastUploadDate: date,
      }));

      if (plan === "free") {
        localStorage.setItem("dailyUploadCount", String(count + 1));
        localStorage.setItem("lastUploadDate", date);
      }
    },

    removePendingFile: (index) =>
      set((state) => ({
        pendingFiles: state.pendingFiles.filter((_, i) => i !== index),
      })),

    clearPendingFiles: () => set({ pendingFiles: [] }),

    sendFilesWithText: (text) =>
      set((state) => {
        const newFileMessages: FileMessage[] = state.pendingFiles.map((file) => ({
          id: Date.now().toString(),
          type: "file",
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          fileObject: file,
          sender: "user",
          time: new Date().toLocaleTimeString(),
        }));

        const newTextMessage: TextMessage[] = text
          ? [
              {
                id: Date.now().toString(),
                type: "text",
                text,
                sender: "user",
                time: new Date().toLocaleTimeString(),
              },
            ]
          : [];

        return {
          messages: [...state.messages, ...newFileMessages, ...newTextMessage],
          pendingFiles: [],
        };
      }),

    addAIMessage: (content: string) => {
      if (!content) return;
      const aiMessage: TextMessage = {
        id: Date.now().toString(),
        type: "text",
        text: content,
        sender: "ai",
        time: new Date().toLocaleTimeString(),
      };
      set((state) => ({
        messages: [...state.messages, aiMessage],
      }));
    },
  };
});
