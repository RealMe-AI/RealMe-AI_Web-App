import { useState } from "react";
import { baseUrl } from "@/app/lib/baseUrl";

interface SendMessageParams {
  conversationId: number;
  content: string;
  model?: string;
}

interface StreamCallbacks {
  onChunk: (text: string) => void;
  onComplete: (fullText: string) => void;
  onError: (error: string) => void;
}

export function useSendMessage() {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (
    { conversationId, content, model = "llama-3.1-8b-instant" }: SendMessageParams,
    callbacks: StreamCallbacks
  ): Promise<void> => {
    console.log("sendMessage called with:", content, "baseUrl:", baseUrl);
    
    if (!content.trim()) {
      console.warn("Empty message content");
      return;
    }

    setIsSending(true);
    setError(null);

    const token = localStorage.getItem("accessToken");
    if (!token) {
      const errorMsg = "No access token found";
      console.error(errorMsg);
      setError(errorMsg);
      setIsSending(false);
      callbacks.onError(errorMsg);
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationId,
          content,
          model,
        }),
      });

      if (!res.ok) {
        let errorMsg = `API Error ${res.status}`;
        try {
          const json = await res.json();
          errorMsg += `: ${json.error || JSON.stringify(json)}`;
        } catch {
          const text = await res.text();
          errorMsg += `: ${text}`;
        }
        throw new Error(errorMsg);
      }

      if (!res.body) {
        throw new Error("No stream received");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiText = "";

      // Stream AI response chunks
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        aiText += decoder.decode(value);
        callbacks.onChunk(aiText);
      }

      callbacks.onComplete(aiText);
      setIsSending(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to send message";
      console.error("Chat error:", err);
      setError(errorMsg);
      setIsSending(false);
      callbacks.onError(errorMsg);
    }
  };

  return { sendMessage, isSending, error };
}