"use client";

import { motion } from "framer-motion";

interface TabsProps {
  isSignUp: boolean;
  setIsSignUp: (v: boolean) => void;
}

export default function Tabs({ isSignUp, setIsSignUp }: TabsProps) {
  return (
    <div className="flex items-center justify-center bg-white/30 dark:bg-slate-700/40 p-1 rounded-xl">
      {["Sign In", "Sign Up"].map((label, idx) => {
        const active = isSignUp ? idx === 1 : idx === 0;
        return (
          <button
            key={label}
            onClick={() => setIsSignUp(idx === 1)}
            className="relative w-1/2 py-2 font-semibold text-sm text-slate-600 dark:text-gray-300"
          >
            {active && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-indigo-400/60 dark:bg-indigo-600/60 rounded-lg"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
