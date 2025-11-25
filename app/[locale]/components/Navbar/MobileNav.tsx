"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useBackdrop } from "../../../hooks/useBackdrop";
import { navItems } from "../../../data/mobilNavData";
import { Props } from "../../../types/type";
import Link from "next/link";
import useNavigateToAuth from "../../../hooks/useNavigateToAuth";
import { useTranslate } from "../../../hooks/useTranslate";

export default function MobileNav({ isOpen, setIsOpen, active }: Props) {
  useBackdrop(isOpen);
  const goToAuth = useNavigateToAuth();
  const { t } = useTranslate();

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
            className="fixed top-20 left-0 right-0 bottom-0 bg-black/70 backdrop-blur-md z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Mobile Dropdown */}
          <motion.nav
            key="mobile-menu"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-20 right-0 w-full bg-white dark:bg-slate-900 shadow-lg border-t border-gray-200 dark:border-slate-700 z-50 md:hidden"
          >
            <div className="px-6 py-4 flex flex-col space-y-4">
              {/* Navigation Links */}
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
                  {t(item.key)} {/* translated label */}
                </Link>
              ))}

            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
