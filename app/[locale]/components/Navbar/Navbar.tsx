"use client";

import { Menu, X, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useBackdrop } from "../../../hooks/useBackdrop";
import { useThemeStore } from "../../../zustand/useThemeStore";
import { Props } from "../../../types/type";
import { Link } from "@/i18n/routing";

import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

export default function Navbar({ isOpen, setIsOpen, active }: Props) {
  useBackdrop(isOpen);
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-lg">
          RealMe AI
        </Link>
        <div className="flex items-center gap-6">
          {/* Desktop Nav */}
          <DesktopNav />

          {/* Right controls (Theme toggle + Mobile Menu button) */}

          {/* ONE Theme Toggle (visible everywhere) */}
          <motion.button
            onClick={toggleTheme}
            whileTap={{ rotate: 180 }}
            transition={{ duration: 0.4 }}
            className="p-2 rounded-full bg-gray-100 dark:bg-slate-700
            hover:bg-gray-200 dark:hover:bg-slate-600
            text-slate-700 dark:text-gray-100"
          >
            {theme === "light" ? <Sun size={16} /> : <Moon size={16} />}
          </motion.button>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-slate-800 dark:text-gray-200" />
            ) : (
              <Menu className="w-6 h-6 text-slate-800 dark:text-gray-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <MobileNav isOpen={isOpen} setIsOpen={setIsOpen} active={active} />
    </header>
  );
}
