import { Attachment } from "./type";

export interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  inputRef: React.RefObject<HTMLDivElement | null>;
  isFocused: boolean;
  setIsFocused: (value: boolean) => void;
  isOnline: boolean;
  isLoading: boolean;
  attachments: Attachment[];
  uploadingFiles: Map<string, { file: File; progress: number }>;
  showUploadPopup: boolean;
  setShowUploadPopup: (value: boolean) => void;
  onFileSelected: (file: File) => Promise<void>;
  onRemoveAttachment: (id: string) => Promise<void>;
  onAbort: () => void;
  isRecording: boolean;
  isTranscribing: boolean;
  onMicClick: () => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}