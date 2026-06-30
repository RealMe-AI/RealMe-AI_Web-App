"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import type { FaqItem } from "../data/faq";

interface FaqAccordionProps {
  items: FaqItem[];
  openItems: Set<string>;
  onToggle: (id: string) => void;
}

export default function FaqAccordion({
  items,
  openItems,
  onToggle,
}: FaqAccordionProps) {
  const t = useTranslations();
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-lg shadow-sm border border-indigo-100 dark:border-indigo-900/30 bg-linear-to-br from-indigo-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden"
        >
          <button
            onClick={() => onToggle(item.id)}
            className="flex items-center justify-between w-full px-5 py-4 text-left text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition"
          >
            <span>{t(`help.faq.items.${item.id.replace(/-/g, "_")}.question`)}</span>
            <ChevronDown
              size={16}
              className={`shrink-0 ml-4 text-slate-400 transition-transform duration-200 ${
                openItems.has(item.id) ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence initial={false}>
            {openItems.has(item.id) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                {item.id === "gs-3" && (
                  <div className="px-5 pt-1">
                    <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                      {t("help.badge.currently_free")}
                    </span>
                  </div>
                )}
                <p className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t(`help.faq.items.${item.id.replace(/-/g, "_")}.answer`)}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
