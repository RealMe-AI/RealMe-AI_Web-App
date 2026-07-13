"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, ArrowUpCircle, Settings, LogOut } from "lucide-react";
import { useTranslate } from "@/app/hooks/useTranslate";

interface ProfilePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountInfo: () => void;
  onUpgrade: () => void;
  onSettings: () => void;
  onLogout: () => void;
}

export function ProfilePopover({
  isOpen,
  onClose,
  onAccountInfo,
  onUpgrade,
  onSettings,
  onLogout,
}: ProfilePopoverProps) {
  const { t } = useTranslate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/20 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="
              fixed bottom-24 right-[72px] w-56
              bg-white/60 dark:bg-slate-800/90
              backdrop-blur-xl shadow-lg rounded-xl p-2
              z-70
            "
          >
            <button
              onClick={onAccountInfo}
              className="
                flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm
                text-slate-700 dark:text-slate-200
                hover:bg-indigo-100/50 dark:hover:bg-slate-700/60
                transition
              "
            >
              <User size={16} /> {t("account_info.title")}
            </button>
            <button
              onClick={onUpgrade}
              className="
                flex items-center gap-2 w-full px-3 py-2 mt-1 rounded-md text-sm font-medium
                text-indigo-600 dark:text-indigo-300
                hover:bg-indigo-100/50 dark:hover:bg-slate-700/60
                transition
              "
            >
              <ArrowUpCircle size={16} /> {t("dashboard.sidebar.upgrade")}
            </button>
            <button
              onClick={onSettings}
              className="
                flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm
                text-slate-700 dark:text-slate-200
                hover:bg-indigo-100/50 dark:hover:bg-slate-700/60
                transition
              "
            >
              <Settings size={16} /> {t("settings.title")}
            </button>
            <button
              onClick={onLogout}
              className="
                flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-red-600
                hover:bg-red-100/50 dark:hover:bg-red-800/60
                transition
              "
            >
              <LogOut size={16} /> {t("dashboard.sidebar.logout")}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
