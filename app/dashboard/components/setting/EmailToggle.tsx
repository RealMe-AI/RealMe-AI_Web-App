"use client";

import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";

interface EmailToggleProps {
  enabled: boolean;
  onToggle: () => void;
  className?: string;
}

export default function EmailToggle({
  enabled,
  onToggle,
  className = "",
}: EmailToggleProps) {
  const t = useTranslations();

  return (
    <div
      onClick={onToggle}
      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-indigo-100/50 dark:hover:bg-slate-700/60 transition ${className}`}
    >
      <div className="flex items-center gap-2">
        <Bell size={16} />
        <span>{t("settings.notifications.label")}</span>
      </div>

      <div
        className={`w-10 h-5 rounded-full p-0.5 flex items-center transition-colors ${
          enabled ? "bg-indigo-600" : "bg-slate-400"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>
    </div>
  );
}
