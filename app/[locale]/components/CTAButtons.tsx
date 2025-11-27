"use client";

import { motion } from "framer-motion";
import { useTranslate } from "../../hooks/useTranslate";

import LanguageSelect from "./LanguageSelect";
import Link from "next/link";

export default function CTAButtons() {
  const { t } = useTranslate();

  return (
    <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">

      {/* Primary CTA */}
      <motion.div
        whileHover={{ scale: 1.07, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        <Link
          href="/auth"
          className="inline-flex items-center justify-center bg-indigo-300 text-slate-800 dark:bg-indigo-600 dark:text-white px-8 py-4 font-semibold rounded-lg shadow-md hover:bg-indigo-200 dark:hover:bg-indigo-500 transition"
        >
          {t("landing.cta.primary")}
        </Link>
      </motion.div>

      {/* Secondary CTA */}
      <Link
        href="#pricing"
        className="inline-flex items-center justify-center border-2 border-indigo-400 text-indigo-600 dark:text-indigo-300 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all"
      >
        <LanguageSelect />
      </Link>
    </div>
  );
}
