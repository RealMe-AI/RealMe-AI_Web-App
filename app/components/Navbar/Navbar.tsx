"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { useActiveSection } from "../../hooks/useActiveSection";
import { useThemeToggle } from "../../hooks/useThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const active = useActiveSection();
  const { theme, toggleTheme } = useThemeToggle();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="RealMe logo" width={40} height={40} />
          <span className="hidden md:block font-bold text-lg text-slate-800 dark:text-gray-100">
            RealMe AI
          </span>
        </div>

        {/* Desktop Navigation */}
        <DesktopNav active={active} />

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-3">
          {/* Theme toggle beside menu */}
          <motion.button
            onClick={toggleTheme}
            whileTap={{ rotate: 180 }}
            transition={{ duration: 0.4 }}
            className="p-2 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-slate-700 dark:text-gray-100"
          >
            {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          {/* Hamburger */}
          <button
            className="flex items-center justify-center w-10 h-10 rounded-md text-slate-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            <motion.div
              initial={false}
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileNav isOpen={isOpen} setIsOpen={setIsOpen} active={active} />
    </header>
  );
}
