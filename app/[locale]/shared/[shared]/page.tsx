"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useSharedConversation } from "@/app/hooks/chatModal/useSharedConversation";
import ChatMessage from "@/app/[locale]/d/components/ChatMessage";
import type { Message } from "@/app/interface/type";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { ConversationHeader } from "../components/ConversationHeader";
import { ConversationFooter } from "../components/ConverstaionFooter";

export default function SharedConversationPage() {
  const params = useParams();
  const shareId = params.shareId as string;
  const { conversation, isLoading, error, refetch } =
    useSharedConversation(shareId);

  const messages: Message[] = useMemo(() => {
    if (!conversation) return [];
    return conversation.messages.map((msg, i) => ({
      id: `${msg.role}-${i}`,
      sender: msg.role === "user" ? "user" : ("ai" as const),
      type: "text" as const,
      text: msg.content,
      time: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
  }, [conversation]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !conversation) {
    return <ErrorState error={error} refetch={refetch} />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      {/* Header */}
      <ConversationHeader conversation={conversation} />

      {/* Messages */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
      </div>

      {/* Footer */}
      <ConversationFooter />
    </div>
  );
}
