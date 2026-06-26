"use client";

import { WifiOff } from "lucide-react";
import { motion } from "framer-motion";
import { useNetworkStatus } from "@/app/hooks/useNetworkStatus";
import { useTranslations } from "next-intl";

export default function OfflineBanner() {
  const { isOnline } = useNetworkStatus();
  const t = useTranslations("dashboard.offline");

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none pt-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 max-w-sm mx-4 pointer-events-auto border border-slate-200 dark:border-slate-700"
      >
        <WifiOff size={24} className="text-amber-500 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {t("title")}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t("subtitle")}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
