"use client";

import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBackdrop } from "../../../hooks/useBackdrop";
import { navItems } from "../../../data/mobilNavData";
import { Props } from "../../../types/type";
import { useTranslations } from "next-intl";
import { useThemeStore } from "../../../zustand/useThemeStore";
import { Sun, Moon } from "lucide-react";

import Link from "next/link";
import DesktopNav from "./DesktopNav";
import useNavigateToAuth from "../../../hooks/useNavigateToAuth";

export default function Navbar({ isOpen, setIsOpen, active }: Props) {
  useBackdrop(isOpen);
  const goToAuth = useNavigateToAuth();
  const t = useTranslations("navbar");
  const tCTA = useTranslations("landing.cta");
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" legacyBehavior>
          <motion.a
            className="text-2xl font-bold text-indigo-600 dark:text-indigo-400"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            RealMe AI
          </motion.a>
        </Link>
        {/* Desktop Navigation */}
        <DesktopNav active={active} />

        <div className="flex items-center 
        
        ">
          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            whileTap={{ rotate: 180 }}
            transition={{ duration: 0.4 }}
            className=" p-2 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-slate-700 dark:text-gray-100"
          >
            {theme === "light" ? <Sun size={16} /> : <Moon size={16} />}
          </motion.button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-slate-800 dark:text-gray-200" />
            ) : (
              <Menu className="w-6 h-6 text-slate-800 dark:text-gray-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed top-20 left-0 right-0 bottom-0 bg-red-700 backdrop-blur-md z-70"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Mobile Menu */}
            <motion.nav
              key="mobile-menu"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute top-20 right-0 w-full bg-white dark:bg-slate-900 shadow-lg border-t border-gray-200 dark:border-slate-700 z-50 md:hidden"
            >
              <div className="px-6 py-4 flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`font-semibold ${
                      active === item.href
                        ? "text-indigo-500"
                        : "text-slate-800 dark:text-gray-300 hover:text-indigo-400"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {t(item.key)}
                  </Link>
                ))}

                {/* CTA Button */}
                <motion.button
                  onClick={() => goToAuth()}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="mt-3 bg-indigo-300 dark:bg-indigo-600 text-slate-800 dark:text-white px-4 py-2 font-semibold rounded-lg shadow-md hover:bg-indigo-200 dark:hover:bg-indigo-500 transition"
                >
                  {tCTA("primary")}
                </motion.button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
