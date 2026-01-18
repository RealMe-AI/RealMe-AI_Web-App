import { useCallback } from "react";
import { baseUrl } from "../lib/baseUrl";
import { useChatStore } from "../zustand/useChatStore";
import { Message, MessageResponse } from "../types/type";

export const useSendMessage = () => {
  const {
    messages,
    activeConversationId,
    setActiveConversationId,
    setMessages,
    addMessage,
    updateMessage,
    setIsLoading,
  } = useChatStore();

  // Helper function to update conversation details
  const updateConversationDetails = async (
    conversationId: number,
    lastMessage: string,
    token: string
  ) => {
    try {
      // Generate a title from the first message if needed
      const title =
        lastMessage.length > 50
          ? lastMessage.substring(0, 50) + "..."
          : lastMessage;

      const res = await fetch(`${baseUrl}/conversations/${conversationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lastMessage,
          title,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        console.warn(`Failed to update conversation: ${res.status}`);
      }
    } catch (err) {
      console.warn("Error updating conversation details:", err);
    }
  };

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // Use a local variable to track the current ID to handle auto-creation
      let currentConversationId = activeConversationId;
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("No access token found");
        return;
      }

      // AUTO-CREATE CONVERSATION if none exists (like ChatGPT)
      if (!currentConversationId) {
        try {
          const createRes = await fetch(`${baseUrl}/conversations`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title:
                content.substring(0, 50) + (content.length > 50 ? "..." : ""),
            }),
          });

          if (!createRes.ok) {
            console.error("Failed to create conversation");
            return;
          }

          const newConv = await createRes.json();
          currentConversationId = newConv.id;
          setActiveConversationId(newConv.id);
        } catch (err) {
          console.error("Error creating conversation:", err);
          return;
        }
      }

      // Add user message immediately
      const userMsg: Message = {
        id: Date.now().toString(),
        sender: "user",
        type: "text",
        text: content,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // Optimistic update
      addMessage(userMsg);
      setIsLoading(true);

      try {
        const res = await fetch(`${baseUrl}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            conversationId: currentConversationId,
            content,
            model: "llama-3.1-8b-instant",
          }),
        });

        if (!res.ok) throw new Error(`Failed to send message: ${res.status}`);

        // Check if response is streaming or JSON
        const contentType = res.headers.get("content-type");

        if (contentType?.includes("application/json")) {
          // Handle JSON response
          const data: MessageResponse = await res.json();

          // Extract AI response from the JSON structure
          let aiText = "";
          if (data.assistantMessage?.content) {
            aiText = data.assistantMessage.content;
          } else if (data.assistantMessage?.text) {
            aiText = data.assistantMessage.text;
          }

          if (aiText) {
            const aiMsg: Message = {
              id: data.assistantMessage?.id || (Date.now() + 1).toString(),
              sender: "ai",
              type: "text",
              text: aiText,
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            };

            addMessage(aiMsg);
            setIsLoading(false);

            // Update conversation after successful message
            if (currentConversationId) {
              await updateConversationDetails(
                currentConversationId,
                content,
                token
              );
            }
          } else {
            throw new Error("No AI response found in JSON");
          }
        } else if (res.body) {
          // Handle streaming response
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let aiText = "";

          // Initial temp message
          const tempId = "ai-temp";
          const tempMsg: Message = {
            id: tempId,
            sender: "ai",
            type: "text",
            text: "",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };

          // We can't use addMessage inside the loop easily if we want to replace/update.
          // But we can add it once, then use updateMessage.
          // However, addMessage here might race with previous state if we are not careful with closures.
          // Using useChatStore.getState() might be safer inside the loop if available, or just relying on `updateMessage`.

          // Add temp message to store
          addMessage(tempMsg);

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            aiText += chunk;

            updateMessage(tempId, { text: aiText });
          }

          // Finalize AI message with new ID
          updateMessage(tempId, {
            id: (Date.now() + 1).toString(),
            text: aiText,
          });
          setIsLoading(false);

          // Update conversation after streaming complete
          if (currentConversationId) {
            await updateConversationDetails(
              currentConversationId,
              content,
              token
            );
          }
        } else {
          throw new Error("No response body received");
        }
      } catch (err) {
        console.error("Chat error:", err);
        // Add error message to chat
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          type: "text",
          text: "Sorry, something went wrong. Please try again.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        addMessage(errorMsg);
        setIsLoading(false);
      }
    },
    [
      activeConversationId,
      setActiveConversationId,
      addMessage,
      updateMessage,
      setIsLoading,
    ]
  );

  return { sendMessage };
};
