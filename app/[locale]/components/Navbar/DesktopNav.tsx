"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { navItems } from "../../../data/NavData";
import { Active } from "../../../types/type";
import { useAboutStore } from "../../../zustand/useAboutStore";

import Link from "next/link";
import useNavigateToAuth from "../../../hooks/useNavigateToAuth";

export default function DesktopNav({ active }: Active) {
  const goToAuth = useNavigateToAuth();
  const { openAbout } = useAboutStore();

  // Separate namespaces
  const tNav = useTranslations("navbar");
  const tCTA = useTranslations("landing.cta");

  return (
    <nav className="hidden md:flex items-center gap-6 text-sm">
      {navItems.map((item) => (
  <button
    key={item.key}
    onClick={() => {
      if (item.key === "about") {
        openAbout();
        return;
      }
      // fallback for other links
      router.push(item.href);
    }}
    className="..."
  >
    {t(item.key)}
  </button>
))}

      {/* CTA Button */}
      <motion.button
        onClick={() => goToAuth()}
        whileHover={{ scale: 1.07, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="ml-4 bg-indigo-300 text-slate-800 dark:bg-indigo-600 dark:text-white px-4 py-2 font-semibold rounded-lg shadow-md hover:bg-indigo-200 dark:hover:bg-indigo-500 transition"
      >
        {tCTA("primary")}
      </motion.button>

      {/* Theme Toggle */}
      {/* <motion.button
        onClick={toggleTheme}
        whileTap={{ rotate: 180 }}
        transition={{ duration: 0.4 }}
        className="ml-4 p-2 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-slate-700 dark:text-gray-100"
      >
        {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
      </motion.button> */}
    </nav>
  );
}
