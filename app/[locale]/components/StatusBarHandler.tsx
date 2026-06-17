"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useThemeStore, applyThemeClass } from "@/app/store/useThemeStore";

export function StatusBarHandler() {
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);
  const pathname = usePathname();

  useEffect(() => {
    if (!resolvedTheme) return;

    const colors = {
      light: "#ffffff",
      dark: "#0f172a",
    };

    const color = resolvedTheme === "dark" ? colors.dark : colors.light;

    let metaTag = document.querySelector('meta[name="theme-color"]');

    if (!metaTag) {
      metaTag = document.createElement("meta");
      metaTag.setAttribute("name", "theme-color");
      document.head.appendChild(metaTag);
    }

    metaTag.setAttribute("content", color);
  }, [resolvedTheme]);

  useEffect(() => {
    applyThemeClass(resolvedTheme);
  }, [pathname, resolvedTheme]);

  return null;
}
