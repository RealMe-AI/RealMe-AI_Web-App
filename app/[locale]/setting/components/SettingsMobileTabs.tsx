"use client";

import { useTranslations } from "next-intl";

type TabId = 'account' | 'preferences' | 'security' | 'voice' | 'support';

interface SettingsMobileTabsProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  tabs: Array<{ id: TabId; label: string }>;
}

export function SettingsMobileTabs({ activeTab, setActiveTab, tabs }: SettingsMobileTabsProps) {
  const t = useTranslations();

  return (
    <div className="md:hidden flex flex-col shrink-0 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 pt-14 pb-0">
      <div className="absolute top-4 left-6">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          {t("settings.title")}
        </h2>
      </div>
      <div className="flex overflow-x-auto hide-scrollbar px-4 pb-2 gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                  : "bg-white text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}