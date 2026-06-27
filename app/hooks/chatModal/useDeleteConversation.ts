import { useState } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { useChatStore } from "@/app/store/useChatStore";
import { authFetch } from "@/app/lib/apiClient";
import { showToast } from "@/app/lib/toast";

export const useDeleteConversation = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    triggerChatsRefresh,
    activeConversationId,
    setActiveConversationId,
    setMessages,
  } = useChatStore();

  const deleteConversation = async (chatId: number) => {
    try {
      setIsDeleting(true);

      const res = await authFetch(`${baseUrl}/conversations/${chatId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        showToast.error("Failed to delete conversation");
      }

      if (activeConversationId === chatId) {
        setActiveConversationId(null);
        setMessages([]);
      }

      triggerChatsRefresh();
    } catch (error) {
      console.error("Error deleting conversation:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteConversation,
    isDeleting,
  };
};