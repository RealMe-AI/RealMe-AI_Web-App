"use client";

import ThemeSelect from "../ThemeSelect";
import EmailToggle from "../EmailToggle";

interface PreferencesTabProps {
  notifications: { email: boolean };
  setNotifications: (n: { email: boolean }) => void;
  t: (key: string) => string;
}

export function PreferencesTab({
  notifications,
  setNotifications,
  t,
}: PreferencesTabProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="py-3">
        <EmailToggle
          enabled={notifications.email}
          onToggle={() =>
            setNotifications({
              ...notifications,
              email: !notifications.email,
            })
          }
          className="text-slate-800 dark:text-slate-200 font-medium px-0!"
        />
      </div>

      <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700/50">
        <span className="text-slate-800 dark:text-slate-200 font-medium flex items-center gap-2">
          {t("settings.theme.label")}
        </span>
        <div className="w-32">
          <ThemeSelect />
        </div>
      </div>
    </div>
  );
}
