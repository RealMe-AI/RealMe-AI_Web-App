"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface SecurityTabProps {
  t: ReturnType<typeof useTranslations>;
  close: () => void;
}

export function SecurityTab({ t, close }: SecurityTabProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center py-3">
        <span className="text-slate-800 dark:text-slate-200 font-medium">
          {t("settings.security.update_password")}
        </span>
        <Link
          href="/auth/forgot-password"
          onClick={close}
          className="text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-4 py-2 rounded-lg transition"
        >
          {t("settings.security.update")}
        </Link>
      </div>
    </div>
  );
}