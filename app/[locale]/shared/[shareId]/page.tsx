"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { RefreshCw, MessageSquareOff } from "lucide-react";
import { useSharedConversation } from "@/app/hooks/chatModal/useSharedConversation";
import ChatMessage from "@/app/[locale]/d/components/ChatMessage";
import type { Message } from "@/app/interface/type";
import SpinnerIcon from "../../components/icons/SpinnerIcon";

export default function SharedConversationPage() {
  const params = useParams();
  const shareId = params.shareId as string;
  const t = useTranslations();
  const { conversation, isLoading, error, refetch } = useSharedConversation(shareId);

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
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <SpinnerIcon className="h-8 w-8 text-indigo-500" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-slate-200 dark:border-slate-700">
          <MessageSquareOff size={48} className="mx-auto mb-4 text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
            {error === "Conversation not found"
              ? t("shared.not_found_title") || "Conversation not found"
              : t("shared.error_title") || "Something went wrong"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {error}
          </p>
          <button
            onClick={refetch}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg transition"
          >
            <RefreshCw size={16} />
            {t("shared.retry") || "Try again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="RealMe AI"
            width={28}
            height={28}
            className="rounded-full shrink-0"
          />
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
              {conversation.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t("shared.shared_by") || "Shared by"} {conversation.user.name}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-center gap-2">
          <Image
            src="/logo.png"
            alt="RealMe AI"
            width={14}
            height={14}
            className="rounded-full"
          />
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t("shared.powered_by") || "Powered by RealMe AI"}
          </span>
        </div>
      </div>
    </div>
  );
}
