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
        
        // Get token from localStorage or cookies
        const token = localStorage.getItem("token") || localStorage.getItem("authToken");
        
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };
        
        // Add Authorization header if token exists
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        
        const res = await fetch(`${baseUrl}/conversations?page=1&limit=20`, {
          method: "GET",
          headers,
          credentials: "include",
        });
        
        if (res.status === 401) {
          throw new Error("Unauthorized - Please log in again");
        }
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to fetch conversations");
        }
        
        const data = await res.json();
        const loadedChats = Array.isArray(data)
          ? data
          : data.items || data.conversations || [];
        
        setChats(loadedChats);
        setError(null);
      } catch (err) {
        console.error("Error fetching chats:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch chats");
        
        // Redirect to login if unauthorized
        if (err instanceof Error && err.message.includes("Unauthorized")) {
         
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, []);

  return { chats, setChats, isLoading, error };
}