import type { Chat } from "@/app/interface/type";

export function sortPinnedFirst(chats: Chat[]): Chat[] {
  return [...chats].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });
}
