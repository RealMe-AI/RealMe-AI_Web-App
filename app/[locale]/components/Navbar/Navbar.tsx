"use client";

import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { useTranslations } from "next-intl";

interface NavbarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  active: string;
}

export default function Navbar({ isOpen, setIsOpen, active }: NavbarProps) {
  const t = useTranslations("navbar");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="/"
          className="text-2xl font-bold text-indigo-600 dark:text-indigo-400"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {t("brand")}
        </motion.a>

        {/* Desktop Navigation */}
        <DesktopNav active={active} />

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

      {/* Mobile Navigation */}
      <MobileNav isOpen={isOpen} setIsOpen={setIsOpen} active={active} />
    </header>
  );
}