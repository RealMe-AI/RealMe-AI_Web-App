export type Features = {
  key: string;
  icon: string;
};

export type Props = {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  active: string;
};

export type Active = {
  active: string;
};

export type Attachment = {
  id: string;
  type: "image" | "document";
  mimeType: string;
  url: string;
  fileName: string;
  fileSize: number;
  extractedContent?: string | null;
};

// Raw API message type
export interface RawMessage {
  id: string;
  sender?: "user" | "assistant" | "assistantMessage" | "ai";
  role?: "user" | "assistant" | "ai"; // Backend might use role instead of sender
  text?: string;
  content?: string;
  createdAt: string;
  attachments?: Attachment[];
}

// API response for single message send
export interface MessageResponse {
  userMessage?: RawMessage;
  assistantMessage?: RawMessage;
  messages?: RawMessage[];
  items?: RawMessage[];
}

export type NavItem = {
  href: string;
  key: string;
  action?: "navigate" | "modal";
};

export type Toggle = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

export type Message = {
  id: string;
  sender: "user" | "ai";
  type: "text" | "file" | "image" | "audio"; // Required for ChatMessageProps
  text?: string; // Optional since file/image may have no text
  time: string;
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
  imageUrl?: string;
  audioUrl?: string;
  attachments?: Attachment[];
};

export type ChatState = {
  messages: Message[];
  isLoading: boolean;
  activeConversationId: number | null;
  chats: Chat[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  setConversations: (chats: Chat[] | ((prev: Chat[]) => Chat[])) => void;
  updateChatTitle: (id: number, title: string) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  removeMessage: (id: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setActiveConversationId: (id: number | null) => void;
  togglePin: (chatId: number) => void;
  chatsRefreshSignal: number;
  triggerChatsRefresh: () => void;
  inputFocusSignal: number;
  triggerInputFocus: () => void;
  abortController: AbortController | null;
  setAbortController: (controller: AbortController | null) => void;
  abortMessage: () => void;
};

export type ChatMessageProps = {
  message: {
    id: string;
    sender: "user" | "ai";
    type: "text" | "file" | "image" | "audio";
    text?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    imageUrl?: string;
    audioUrl?: string;
    time: string;
    attachments?: Attachment[];
  };
};

export type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export type Chat = {
  id: number;
  title: string;
  lastMessage?: string;
  isPinned?: boolean;
};

export type ModalState = {
  isProfileOpen: boolean;
  isAccountInfoOpen: boolean;
  isSettingsOpen: boolean;
  openProfile: () => void;
  closeProfile: () => void;
  openAccountInfo: () => void;
  closeAccountInfo: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  closeAll: () => void;
};

export type AboutStore = {
  isOpen: boolean;
  openAbout: () => void;
  closeAbout: () => void;
};
