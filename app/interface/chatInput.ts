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
  uploadingFiles: Map<string, { file: File; progress: number; kind: "file" | "audio" }>;
  showUploadPopup: boolean;
  setShowUploadPopup: (value: boolean) => void;
  onFileSelected: (file: File) => Promise<void>;
  onMultipleFilesSelected?: (files: File[]) => Promise<void>;
  onRemoveAttachment: (id: string) => Promise<void>;
  imageCount?: number;
  imagesAtLimit?: boolean;
  hoursRemaining?: number;
  attachmentCount?: number;
  onAbort: () => void;
  isRecording: boolean;
  isAudioRecorded: boolean;
  audioDuration: number;
  audioCurrentTime: number;
  audioUrl: string | null;
  isAudioPlaying: boolean;
  onMicClick: () => void;
  onDeleteAudio: () => void;
  onPlayAudio: () => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}