"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { navItems } from "../../../data/NavData";
import { useAboutStore } from "../../../zustand/useAboutStore";
import useNavigateToAuth from "../../../hooks/useNavigateToAuth";
import { useRouter } from "next/navigation";

export default function DesktopNav() {
  const router = useRouter();
  const goToAuth = useNavigateToAuth();
  // select the exact function from the store to avoid TS 'unknown' issues
  const openAbout = useAboutStore((s) => s.openAbout);

  const tNav = useTranslations("navbar");
  const tCTA = useTranslations("landing.cta");

  const handleNavClick = async (item: { href: string; key: string }) => {
    // Open About overlay
    if (item.key === "about") {
      openAbout();
      return;
    }

    // If the href is an in-page anchor like "#help", scroll to the element if it exists
    if (item.href.startsWith("#")) {
      const id = item.href.slice(1);
      // Try to find element on the page
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        // Optionally update the hash in URL without reloading
        history.replaceState(null, "", `${window.location.pathname}#${id}`);
        return;
      }
      // if element isn't on the page, fallback to pushing URL with hash
      router.push(`${window.location.pathname}${item.href}`);
      return;
    }

    // Fallback for normal links
    router.push(item.href);
  };

  return (
    <nav className="hidden md:flex items-center gap-6 text-sm">
      {navItems.map((item) => (
        <button
          key={item.key}
          onClick={() => handleNavClick(item)}
          className="
            font-semibold 
            text-slate-800 dark:text-gray-300 
            hover:text-indigo-500 
            transition-colors
          "
        >
          {tNav(item.key)}
        </button>
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
