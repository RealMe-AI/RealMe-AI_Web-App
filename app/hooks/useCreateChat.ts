import { useState } from "react";
import { useTranslations } from "next-intl";
import { baseUrl } from "@/app/lib/baseUrl";
import { useAuthStore } from "@/app/zustand/useAuthStore";
import { Chat } from "@/app/types/type";

export function useCreateChat() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations();

  const createChat = async (chatsLength: number): Promise<Chat | null> => {
    try {
      setIsCreating(true);
      setError(null);

      const accessToken = useAuthStore.getState().accessToken;

      if (!accessToken) {
        throw new Error("Unauthorized - No access token found");
      }

      // Create a default title
      const title = t("dashboard.search.new_conversation_title", {
        chatNumber: chatsLength + 1,
      });

      const res = await fetch(`${baseUrl}/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ title }),
      });

      if (res.status === 401) {
        throw new Error("Unauthorized - Invalid or expired token");
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create chat");
      }

      const newChat: Partial<Chat> = await res.json();

      const safeChat: Chat = {
        id: newChat.id ?? Date.now(),
        title: newChat.title ?? title,
      };

      return safeChat;
    } catch (err) {
      console.error("Create chat error:", err);
      setError(err instanceof Error ? err.message : "Failed to create chat");
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return { createChat, isCreating, error };
}
