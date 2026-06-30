"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { faqCategories } from "../data/faq";
import { categoryIcons } from "../data/icons";

const visibleCategories = faqCategories.filter((c) => c.id !== "billing");

interface TabDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function TabDrawer({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
}: TabDrawerProps) {
  const t = useTranslations();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
            onClick={onClose}
          />
          <motion.aside
            key="tab-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed right-0 top-0 z-50 w-72 h-full bg-white dark:bg-slate-900 shadow-xl border-l border-slate-200 dark:border-slate-700 lg:hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {t("help.mobile_drawer.title")}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500 dark:text-slate-400"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-64px)]">
              {visibleCategories.map((cat) => {
                const Icon = categoryIcons[cat.icon];
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onTabChange(cat.id);
                      onClose();
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-left transition ${
                      activeTab === cat.id
                        ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-400 dark:text-indigo-600"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                      {Icon && <Icon size={16} className="text-indigo-300 dark:text-indigo-600" />}
                    </div>
                    <span>{t(`help.faq.categories.${cat.id.replace(/-/g, "_")}.title`)}</span>
                  </button>
                );
              })}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
