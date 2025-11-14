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
  sendFileMessage: (file: File) => void;
}

export const useSendFileMessage = create<SendFileMessageStore>((set) => ({
  messages: [],

  sendFileMessage: (file) => {
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Date.now(),
          type: "file",
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          fileObject: file,
          sender: "user",
        },
      ],
    }));
  },
}));
