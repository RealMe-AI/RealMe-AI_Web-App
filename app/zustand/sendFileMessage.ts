import { create } from "zustand";

interface FileMessage {
  id: number;
  type: "file";
  fileName: string;
  fileSize: number;
  fileType: string;
  fileObject: File;
  sender: "user";
}

interface SendFileMessageStore {
  messages: FileMessage[];
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
    set((state) => ({
      messages: [
        ...state.messages,
        ...state.pendingFiles.map((file) => ({
          id: Date.now() + Math.random(),
          type: "file" as const,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          fileObject: file,
          sender: "user" as const,
        })),
        ...(text
          ? [
              {
                id: Date.now() + Math.random(),
                type: "text" as const,
                text,
                sender: "user" as const,
                time: new Date().toLocaleTimeString(),
              },
            ]
          : []),
      ],
      pendingFiles: [],
    })),
}));
