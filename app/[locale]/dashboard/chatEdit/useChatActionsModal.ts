import { useState } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { useChatStore } from "@/app/zustand/useChatStore";
import { useConversation } from "@/app/hooks/useConversation";

export const useChatActionsModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    triggerChatsRefresh,
    activeConversationId,
    setActiveConversationId,
    updateChatTitle,
  } = useChatStore();
  const { updateConversation } = useConversation();

  const handleDelete = async (chatId: number) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      const res = await fetch(`${baseUrl}/conversations/${chatId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete conversation");
      }

      // If deleted chat was active, clear selection
      if (activeConversationId === chatId) {
        setActiveConversationId(null);
      }

      // Refresh sidebar list
      triggerChatsRefresh();
    } catch (error) {
      console.error("Error deleting conversation:", error);
      alert("Failed to delete conversation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRename = async (chatId: number, newTitle?: string) => {
    if (!newTitle) return;

    try {
      // 1. Optimistic update (instantly changes UI)
      updateChatTitle(chatId, newTitle);

      // 2. Persist to backend
      const success = await updateConversation(chatId, { title: newTitle });

      if (!success) {
        console.warn("Failed to persist rename to backend, reverting...");
        triggerChatsRefresh(); // Revert to server state if API fails
      }
    } catch (error) {
      console.error("Error renaming conversation:", error);
      triggerChatsRefresh();
    }
  };

  const handleShare = async (chatId: number) => {
    console.log("Share action triggered for chat:", chatId);
  };

  const handlePin = async (chatId: number) => {
    console.log("Pin action triggered for chat:", chatId);
  };

  return {
    handleDelete,
    handleRename,
    handleShare,
    handlePin,
    isLoading,
  };
};
