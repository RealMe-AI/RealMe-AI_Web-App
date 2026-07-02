"use client";

import { User } from "lucide-react";
import { useTranslations } from "next-intl";

type TabId = 'account' | 'preferences' | 'security' | 'voice' | 'support';

interface SettingsSidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  tabs: Array<{ id: TabId; label: string; icon: typeof User }>;
}

export function SettingsSidebar({ activeTab, setActiveTab, tabs }: SettingsSidebarProps) {
  const t = useTranslations();

  return (
    <div className="hidden md:flex flex-col w-64 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
      <div className="p-6 pb-2">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          {t("settings.title")}
        </h2>
      </div>
      <div className="flex flex-col px-3 py-2 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                  : "text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800/50"
              }`}
            >
              <Icon size={18} className={isActive ? "text-indigo-700 dark:text-indigo-300" : "text-slate-500 dark:text-slate-400"} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}