"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useBackdrop } from "../../hooks/useBackdrop";
import { navItems } from "../../data/mobilNavData";
import { Props } from "../../types/type";

import Link from "next/link";
import useNavigateToAuth from "../../hooks/useNavigateToAuth";

export default function MobileNav({ isOpen, setIsOpen, active }: Props) {
  useBackdrop(isOpen);
  const goToAuth = useNavigateToAuth();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/*  Backdrop */}
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

          {/*  Dropdown */}
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
                  {item.label}
                </Link>
              ))}

              <motion.button
                onClick={() => goToAuth()}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="mt-3 bg-indigo-300 dark:bg-indigo-600 text-slate-800 dark:text-white px-4 py-2 font-semibold rounded-lg shadow-md hover:bg-indigo-200 dark:hover:bg-indigo-500 transition"
              >
                Experience AI
              </motion.button>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
