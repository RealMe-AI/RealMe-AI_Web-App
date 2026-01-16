import { useState, useEffect } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { Chat } from "@/app/types/type";

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${baseUrl}/conversations?page=1&limit=20`, {
          credentials: "include",
        });
        
        if (!res.ok) throw new Error("Failed to fetch conversations");
        
        const data = await res.json();
        const loadedChats = Array.isArray(data)
          ? data
          : data.items || data.conversations || [];
        
        setChats(loadedChats);
        setError(null);
      } catch (err) {
        console.error("Error fetching chats:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch chats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, []);

  return { chats, setChats, isLoading, error };
}