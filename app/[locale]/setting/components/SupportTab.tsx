"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface SupportTabProps {
  t: ReturnType<typeof useTranslations>;
  close: () => void;
}

export function SupportTab({ t, close }: SupportTabProps) {
  return (
    <div className="flex flex-col gap-2">
      <Link
        href="/help"
        onClick={close}
        className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg px-2 -mx-2 transition"
      >
        <span className="text-slate-800 dark:text-slate-200 font-medium">
          {t("settings.support.contact")}
        </span>
        <span className="text-slate-400">→</span>
      </Link>
      <Link
        href="/about"
        onClick={close}
        className="flex justify-between items-center py-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg px-2 -mx-2 transition"
      >
        <span className="text-slate-800 dark:text-slate-200 font-medium">
          {t("navbar.about")}
        </span>
        <span className="text-slate-400">→</span>
      </Link>
    </div>
  );
}