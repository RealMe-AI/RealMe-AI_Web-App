"use client";

import { motion } from "framer-motion";
import { useTranslate } from "../../../hooks/useTranslate"; 

interface TabsProps {
  isSignUp: boolean;
  setIsSignUp: (v: boolean) => void;
}

export default function Tabs({ isSignUp, setIsSignUp }: TabsProps) {
  const { t } = useTranslate();

  const tabs = [
    { labelKey: "auth.toggle.sign_in", isSignUpTab: false },
    { labelKey: "auth.toggle.sign_up", isSignUpTab: true },
  ];

  return (
    <div className="flex items-center justify-center bg-slate-700/40 p-1 rounded-xl">
      {tabs.map((tab) => {
        const active = isSignUp === tab.isSignUpTab;

        return (
          <button
            key={tab.labelKey}
            onClick={() => setIsSignUp(tab.isSignUpTab)}
            className="relative w-1/2 py-2 font-semibold text-sm text-white"
          >
            {active && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-indigo-400/60 dark:bg-indigo-600/60 rounded-lg"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{t(tab.labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
