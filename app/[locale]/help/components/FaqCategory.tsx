"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import FaqAccordion from "./FaqAccordion";
import { faqCategories } from "../data/faq";
import { categoryIcons } from "../data/icons";

interface FaqCategoryProps {
  categoryId: string;
}

export function FaqCategory({ categoryId }: FaqCategoryProps) {
  const t = useTranslations();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const category = faqCategories.find((c) => c.id === categoryId);
  if (!category) return null;

  const Icon = categoryIcons[category.icon];

  return (
    <motion.section
      key={categoryId}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 pb-20"
    >
      <div className="flex items-center gap-2.5 py-6">
        <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-slate-100 flex items-center justify-center">
          {Icon && (
            <Icon size={18} className="text-indigo-300 dark:text-indigo-600" />
          )}
        </div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          {t(`help.faq.categories.${category.id.replace(/-/g, "_")}.title`)}
        </h2>
      </div>
      <FaqAccordion
        items={category.items}
        openItems={openItems}
        onToggle={toggle}
      />
    </motion.section>
  );
}
