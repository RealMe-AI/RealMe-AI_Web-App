"use client";

import { MessageSquareOff, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

interface ErrorStateProps {
  error: string | null;
  refetch: () => void;
}

export function ErrorState({ error, refetch }: ErrorStateProps) {
  const t = useTranslations();
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-slate-200 dark:border-slate-700">
        <MessageSquareOff size={48} className="mx-auto mb-4 text-slate-400" />
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
          {error === "Conversation not found"
            ? t("shared.not_found_title")
            : t("shared.error_title")}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          {error}
        </p>
        <button
          onClick={refetch}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg transition"
        >
          <RefreshCw size={16} />
          {t("shared.retry")}
        </button>
      </div>
    </div>
  );
}
