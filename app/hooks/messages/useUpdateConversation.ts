import { useState, useCallback } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { authFetch } from "@/app/lib/apiClient";

interface UpdateConversationParams {
  title?: string;
  lastMessage?: string;
  updatedAt?: string;
  isPinned?: boolean;
}

export const useUpdateConversation = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateConversation = useCallback(
    async (conversationId: number, updates: UpdateConversationParams) => {
      setIsUpdating(true);
      setError(null);

      try {
        const res = await authFetch(`${baseUrl}/conversations/${conversationId}`, {
          method: "PATCH",
          body: JSON.stringify(updates),
        });

        if (!res.ok) {
          throw new Error(`Failed to update conversation: ${res.status}`);
        }

        setIsUpdating(false);
        return true;
      } catch (err) {
        console.error("Error updating conversation:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setIsUpdating(false);
        return false;
      }
    },
    []
  );

  return {
    updateConversation,
    isUpdating,
    error,
  };
};
