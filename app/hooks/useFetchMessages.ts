import { useState } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { Message } from "@/app/types/type";

export function useFetchMessages() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async (conversationId: number): Promise<Message[]> => {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("accessToken");
    if (!token) {
      const errorMsg = "No access token found";
      console.error(errorMsg);
      setError(errorMsg);
      setIsLoading(false);
      return [];
    }

    try {
      console.log(`Fetching messages for conversation ${conversationId}...`);
      
      const res = await fetch(`${baseUrl}/conversations/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch messages: ${res.status}`);
      }

      const data = await res.json();
      let messages: Message[] = [];

      // Handle different possible structures safely
      if (Array.isArray(data)) {
        messages = data;
      } else if (data.messages && Array.isArray(data.messages)) {
        messages = data.messages;
      } else if (data.items && Array.isArray(data.items)) {
        messages = data.items;
      }

      setIsLoading(false);
      return messages;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fetch messages";
      console.error("Error fetching messages:", err);
      setError(errorMsg);
      setIsLoading(false);
      return [];
    }
  };

  return { fetchMessages, isLoading, error };
}