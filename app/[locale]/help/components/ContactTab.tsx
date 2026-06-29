"use client";

import { motion } from "framer-motion";
import { ExternalLink, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { contacts } from "../data/contacts";
import Link from "next/link";

export function ContactTab() {
  const t = useTranslations();

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 pb-20"
    >
      <div className="flex items-center gap-2.5 py-8">
        <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-slate-100 flex items-center justify-center">
          <Phone size={18} className="text-indigo-300 dark:text-indigo-600" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          {t("settings.support.contact")}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {contacts.map((item) => (
          <Link
            key={item.label}
            href={item.action}
            target={item.action.startsWith("http") ? "_blank" : undefined}
            rel={
              item.action.startsWith("http") ? "noopener noreferrer" : undefined
            }
            className="group flex items-start gap-4 p-5 rounded-xl border border-indigo-100 dark:border-indigo-900/30 bg-linear-to-br from-indigo-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 hover:-translate-y-0.5 duration-900 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700/50 transition-all"
          >
            <div className="shrink-0 w-10 h-10 rounded-lg bg-indigo-100 dark:bg-slate-100 flex items-center justify-center">
              <item.icon
                size={18}
                className="text-indigo-400 dark:text-indigo-600"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {item.label}
                </h3>
                {item.badge && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                    Coming Soon
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {item.description}
              </p>
              <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-indigo-400 group-hover:underline">
                {item.cta}
                <ExternalLink size={12} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
