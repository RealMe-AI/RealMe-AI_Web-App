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

// Raw API message type
export interface RawMessage {
  id: string;
  sender: "user" | "assistant" | "assistantMessage";
  text?: string;
  content?: string;
  createdAt: string;
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
};

export type ChatState = {
  messages: Message[];
  isLoading: boolean;
  activeConversationId: number | null;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  setIsLoading: (isLoading: boolean) => void;
  setActiveConversationId: (id: number | null) => void;
};

export type ChatMessageProps = {
  message: {
    id: string;
    sender: "user" | "ai";
    type: "text" | "file" | "image" | "audio"; // NEW
    // optional because file/image may have no text
    text?: string;
    // NEW – for uploaded file
    fileUrl?: string;
    // NEW – original filename
    fileName?: string;
    // NEW – in bytes
    fileSize?: number;
    // NEW – e.g. "application/pdf"
    mimeType?: string;
    // NEW – for image messages
    imageUrl?: string;
    // NEW – for voice messages
    audioUrl?: string;
    time: string;
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
