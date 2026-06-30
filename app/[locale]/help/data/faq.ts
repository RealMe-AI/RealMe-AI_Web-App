export interface FaqItem {
  id: string;
}

export interface FaqCategory {
  id: string;
  icon: string;
  items: FaqItem[];
}

export const faqCategories: FaqCategory[] = [
  {
    id: "getting-started",
    icon: "getting-started",
    items: [
      { id: "gs-1" },
      { id: "gs-2" },
      { id: "gs-3" },
      { id: "gs-4" },
    ],
  },
  {
    id: "voice",
    icon: "voice",
    items: [
      { id: "vo-1" },
      { id: "vo-2" },
      { id: "vo-3" },
      { id: "vo-4" },
    ],
  },
  {
    id: "languages",
    icon: "languages",
    items: [
      { id: "ln-1" },
      { id: "ln-2" },
      { id: "ln-3" },
    ],
  },
  {
    id: "privacy",
    icon: "privacy",
    items: [
      { id: "pr-1" },
      { id: "pr-2" },
      { id: "pr-3" },
      { id: "pr-4" },
    ],
  },
  {
    id: "account",
    icon: "account",
    items: [
      { id: "ac-1" },
      { id: "ac-2" },
      { id: "ac-3" },
    ],
  },
  {
    id: "troubleshooting",
    icon: "troubleshooting",
    items: [
      { id: "tr-1" },
      { id: "tr-2" },
      { id: "tr-3" },
      { id: "tr-4" },
      { id: "tr-6" },
    ],
  },
  {
    id: "contact",
    icon: "contact",
    items: [
      { id: "ct-1" },
      { id: "ct-2" },
      { id: "ct-3" },
      { id: "ct-4" },
    ],
  },
];
