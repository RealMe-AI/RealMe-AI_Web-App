import { useState, useEffect, useCallback } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { useChatStore } from "@/app/zustand/useChatStore";
import { authFetch } from "@/app/lib/apiClient";

export function useChats() {
  const { chats, setConversations } = useChatStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSignal = useChatStore((s) => s.chatsRefreshSignal);

  const fetchChats = useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await authFetch(`${baseUrl}/conversations?page=1&limit=20`, {
        method: "GET",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch conversations");
      }

      const data = await res.json();

      const loadedChats = Array.isArray(data)
        ? data
        : data.data || data.items || data.conversations || [];

      setConversations(loadedChats);
      setError(null);
    } catch (err) {
      console.error("Error fetching chats:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch chats");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats, refreshSignal]);

  return {
    chats,
    setChats: setConversations,
    isLoading,
    error,
    refetch: fetchChats,
  };
}
