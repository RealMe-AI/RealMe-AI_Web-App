"use client";

import { useState, useEffect } from "react";
import { baseUrl } from "@/app/lib/baseUrl";

interface SharedMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface SharedConversation {
  id: string;
  title: string;
  user: { name: string };
  messages: SharedMessage[];
  shareId: string;
  isPublic: boolean;
}

export function useSharedConversation(shareId: string) {
  const [conversation, setConversation] = useState<SharedConversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/shared/${shareId}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Conversation not found");
        throw new Error("Failed to load conversation");
      }
      const data: SharedConversation = await res.json();
      setConversation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (shareId) fetchConversation();
  }, [shareId]);

  return { conversation, isLoading, error, refetch: fetchConversation };
}
