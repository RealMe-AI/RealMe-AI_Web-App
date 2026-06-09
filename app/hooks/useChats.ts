import { useState, useEffect, useCallback } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { useChatStore } from "@/app/zustand/useChatStore";
import { useAuthStore } from "@/app/zustand/useAuthStore";

export function useChats() {
  const { chats, setConversations } = useChatStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to global refresh signal
  const refreshSignal = useChatStore((s) => s.chatsRefreshSignal);

  const fetchChats = useCallback(async () => {
    try {
      setIsLoading(true);
      // ... existing fetch logic ...
      // (I will use replace_file_content carefully to avoid rewriting the entire function body logic manually if possible, or just rewrite the imports and useEffect)
      const accessToken = useAuthStore.getState().accessToken;

      if (!accessToken) {
        throw new Error("Unauthorized - No access token found");
      }

      const res = await fetch(`${baseUrl}/conversations?page=1&limit=20`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.status === 401) {
        throw new Error("Unauthorized - Invalid or expired token");
      }

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
