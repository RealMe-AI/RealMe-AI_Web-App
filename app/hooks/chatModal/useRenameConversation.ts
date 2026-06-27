import { useState } from "react";
import { useChatStore } from "@/app/store/useChatStore";
import { useUpdateConversation } from "@/app/hooks/messages/useUpdateConversation";

export const useRenameConversation = () => {
  const [isRenaming, setIsRenaming] = useState(false);
  const { updateChatTitle, triggerChatsRefresh } = useChatStore();
  const { updateConversation } = useUpdateConversation();

  const renameConversation = async (chatId: number, newTitle?: string) => {
    if (!newTitle) return;

    try {
      setIsRenaming(true);

      updateChatTitle(chatId, newTitle);

      const success = await updateConversation(chatId, { title: newTitle });

      if (!success) {
        console.warn("Failed to persist rename to backend, reverting...");
        triggerChatsRefresh();
      }
    } catch (error) {
      console.error("Error renaming conversation:", error);
      triggerChatsRefresh();
    } finally {
      setIsRenaming(false);
    }
  };

  return {
    renameConversation,
    isRenaming,
  };
};