"use client";

import { useEffect, useRef } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { navItems } from "../../../constants/NavData";
import { Link } from "@/i18n/routing";

import useNavigateToAuth from "../../../hooks/useNavigateToAuth";

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  active: string;
}

export default function MobileNav({ isOpen, setIsOpen }: MobileNavProps) {
  const t = useTranslations("navbar");
  const tCTA = useTranslations("landing.cta");
  const goToAuth = useNavigateToAuth();

  // Ref to the mobile menu element for hit-testing
  const menuRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside the menu
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const menu = menuRef.current;
      if (!menu) return;
      // If click is inside the menu, do nothing; otherwise close
      if (menu.contains(e.target as Node)) return;
      setIsOpen(false);
    };
    document.body.addEventListener("click", handler);
    return () => document.body.removeEventListener("click", handler);
  }, [isOpen, setIsOpen]);

  return (
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
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Mobile Menu */}
          <motion.nav
            ref={menuRef}
            key="mobile-menu"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute top-14.5 right-0 w-full bg-white dark:bg-slate-900 shadow-lg border-b border-gray-200 dark:border-slate-700 z-50 md:hidden"
          >
            <div className="px-6 py-6 flex flex-col space-y-5">
              {/* Navigation Links */}
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="
                  font-semibold 
                  text-slate-800 dark:text-gray-300 
                  hover:text-indigo-500 
                  transition-colors"
                >
                  {t(item.key)}
                </Link>
              ))}

              {/* CTA Button */}
              {/* <motion.button
                onClick={() => goToAuth()}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="mt-3 bg-indigo-300 dark:bg-indigo-600 text-slate-800 dark:text-white px-4 py-2 font-semibold rounded-lg shadow-md hover:bg-indigo-200 dark:hover:bg-indigo-500 transition"
              >
                {tCTA("primary")}
              </motion.button> */}
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
