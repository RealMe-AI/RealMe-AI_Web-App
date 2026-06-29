"use client";

import { Menu } from "lucide-react";
import { faqCategories } from "../data/faq";
import { categoryIcons } from "../data/icons";

const visibleCategories = faqCategories.filter((c) => c.id !== "billing");

interface HelpTabBarProps {
  activeTab: string;
  onTabChange: (id: string) => void;
  onHamburgerClick: () => void;
}

export function HelpTabBar({
  activeTab,
  onTabChange,
  onHamburgerClick,
}: HelpTabBarProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-px">
      <div className="flex items-center justify-between py-4 border-b border-slate-200 dark:border-slate-700/50">
        {/* Desktop Tabs */}
        <div className="hidden lg:flex flex-wrap gap-2">
          {visibleCategories.map((cat) => {
            const Icon = categoryIcons[cat.icon];
            return (
              <button
                key={cat.id}
                onClick={() => onTabChange(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  activeTab === cat.id
                    ? "bg-indigo-300 dark:bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {Icon && <Icon size={16} />}
                <span>{cat.title}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={onHamburgerClick}
          className="lg:hidden ml-auto p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>
      </div>
    </div>
  );
}
