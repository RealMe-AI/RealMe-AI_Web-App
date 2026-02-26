"use client";

import { motion } from "framer-motion";
import { useTranslate } from "../../hooks/useTranslate";
import {Link} from "@/i18n/routing";

import LanguageSelect from "../setting/LanguageSelect";

export default function CTAButtons() {
  const { t } = useTranslate();

  return (
    <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">

      {/*  */}
      <div className="flex flex-col items-center sm:flex-row gap-4">

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

      <div className="inline-flex items-center justify-center max-w-[235.938px] bg-indigo-100 dark:bg-slate-800 p-2 rounded-lg font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-500 transition-all">
        <LanguageSelect />
      </div>
        </div>
    </div>
  );
}

