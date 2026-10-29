"use client";

import { RefreshCw, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePwaRegister } from "@/app/hooks/pwa/usePwaRegister";

export default function PwaRegister() {
  const t = useTranslations("pwa.update");
  const { visible, handleReload, handleDismiss } = usePwaRegister();

  if (!visible) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-1/2 z-50 flex w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 items-center gap-3 rounded-xl border border-slate-200 bg-white/95 px-3 py-2.5 shadow-xl backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/95"
    >
      <RefreshCw
        size={16}
        className="shrink-0 text-indigo-300 dark:text-indigo-500"
      />
      <p className="min-w-0 flex-1 text-xs font-medium text-slate-700 dark:text-slate-200">
        {t("title")}
      </p>
      <button
        type="button"
        onClick={handleReload}
        className="shrink-0 rounded-lg bg-indigo-300 text-slate-800 dark:bg-indigo-600 dark:text-white px-2.5 py-1.5 text-xs font-semibold"
      >
        {t("action")}
      </button>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label={t("dismiss")}
        className="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
      >
        <X size={14} />
      </button>
    </div>
  );
}
