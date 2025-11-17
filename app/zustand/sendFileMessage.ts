import { create } from "zustand";

export type FileMessage = {
  id: number;
  type: "file";
  fileName: string;
  fileSize: number;
  fileType: string;
  fileObject: File;
  sender: "user";
  time: string;
};

export type TextMessage = {
  id: number;
  type: "text";
  text: string;
  sender: "user";
  time: string;
};

interface SendFileMessageStore {
  messages: (FileMessage | TextMessage)[];
  pendingFiles: File[];
  addPendingFile: (file: File) => void;
  removePendingFile: (index: number) => void;
  clearPendingFiles: () => void;
  sendFilesWithText: (text?: string) => void;
}

export const useSendFileMessage = create<SendFileMessageStore>((set) => ({
  messages: [],
  pendingFiles: [],

  addPendingFile: (file) =>
    set((state) => ({
      pendingFiles: [...state.pendingFiles, file],
    })),

  removePendingFile: (index) =>
    set((state) => ({
      pendingFiles: state.pendingFiles.filter((_, i) => i !== index),
    })),

  clearPendingFiles: () => set({ pendingFiles: [] }),

  sendFilesWithText: (text) =>
    set((state) => {
      const newFileMessages: FileMessage[] = state.pendingFiles.map((file) => ({
        id: Date.now() + Math.random(),
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
              id: Date.now() + Math.random(),
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
}));
