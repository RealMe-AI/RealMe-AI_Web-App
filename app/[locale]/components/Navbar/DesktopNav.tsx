"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { navItems } from "../../../data/NavData";
import { Link } from "@/i18n/routing";


import useNavigateToAuth from "../../../hooks/useNavigateToAuth";

export default function DesktopNav() {
  const goToAuth = useNavigateToAuth();

  const tNav = useTranslations("navbar");
  const tCTA = useTranslations("landing.cta");

  return (
    <nav className="hidden md:flex items-center gap-6 text-sm">
      {navItems.map((item) => (
  <Link 
    key={item.key}
    href={item.href}
    className="
      font-semibold 
      text-slate-800 dark:text-gray-300 
      hover:text-indigo-500 
      transition-colors
    "
  >
    {tNav(item.key)}
  </Link>
))}

      {/* CTA Button */}
      <motion.button
        onClick={() => goToAuth()}
        whileHover={{ scale: 1.07, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="
          ml-4 px-4 py-2 font-semibold rounded-lg shadow-md
          bg-indigo-300 text-slate-800 
          dark:bg-indigo-600 dark:text-white
          hover:bg-indigo-200 dark:hover:bg-indigo-500
          transition
        "
      >
        {tCTA("primary")}
      </motion.button>
    </nav>
  );
}
