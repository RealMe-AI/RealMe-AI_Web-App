"use client";

import { Home, RotateCw, WifiOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function OfflineContent() {
  const t = useTranslations("pwa.offline");

  return (
    <main className="flex min-h-dvh items-center justify-center bg-linear-to-br from-indigo-50 via-white to-indigo-100 px-4 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-8 text-center shadow-xl backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/90">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300">
          <WifiOff size={30} />
        </div>

        <h1 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {t("description")}
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-300 text-slate-800 dark:bg-indigo-500 dark:text-white px-4 py-2.5 text-sm font-semibold"
          >
            <RotateCw size={16} />
            {t("retry")}
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Home size={16} />
            {t("back_home")}
          </Link>
        </div>
      </div>
    </main>
  );
}
