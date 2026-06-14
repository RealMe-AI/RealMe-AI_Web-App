import { useState } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { authFetch } from "@/app/lib/apiClient";
import { Chat } from "@/app/interface/type";
import { useLanguageStore } from "@/app/store/useLanguageStore";

export function useCreateConversation() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createConversation = async (title: string): Promise<Chat | null> => {
    try {
      setIsCreating(true);
      setError(null);

      const language = useLanguageStore.getState().language;

      const res = await authFetch(`${baseUrl}/conversations`, {
        method: "POST",
        body: JSON.stringify({ title, language }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create conversation");
      }

      const newConv: Partial<Chat> = await res.json();

      const safeChat: Chat = {
        id: newConv.id ?? Date.now(),
        title: newConv.title ?? title,
      };

      return safeChat;
    } catch (err) {
      console.error("Create conversation error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create conversation",
      );
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return { createConversation, isCreating, error };
}
