import { useState } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { authFetch } from "@/app/lib/apiClient";

export const useShareConversation = () => {
  const [isSharing, setIsSharing] = useState(false);

  const shareConversation = async (chatId: number): Promise<string | null> => {
    setIsSharing(true);
    try {
      const res = await authFetch(`${baseUrl}/conversations/${chatId}/share`, {
        method: "POST",
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.shareUrl) {
        return `${window.location.origin}${data.shareUrl}`;
      }
      return null;
    } catch {
      return null;
    } finally {
      setIsSharing(false);
    }
  };

  return { shareConversation, isSharing };
};
