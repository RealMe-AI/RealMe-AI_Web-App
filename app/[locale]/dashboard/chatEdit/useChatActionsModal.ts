import { useState } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { useChatStore } from "@/app/zustand/useChatStore";

export const useChatActionsModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { triggerChatsRefresh, activeConversationId, setActiveConversationId } =
    useChatStore();

  const handleDelete = async (chatId: number) => {
    if (!confirm("Are you sure you want to delete this conversation?")) return;

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

  const handleRename = async (chatId: number) => {
    // Placeholder for Rename endpoint
    console.log("Rename action triggered for chat:", chatId);
    // TODO: Implement Rename logic when endpoint is ready
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
