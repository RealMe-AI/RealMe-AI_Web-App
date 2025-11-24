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

export type NavItem = {
  href: string;
  key: string;
};

export type Toggle = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

export type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
  time: string;
  fileName?: string;
  fileUrl?: string;
};

export type ChatState = {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
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
  lastMessage: string;
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
