"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/app/store/useThemeStore";

export function StatusBarHandler() {
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);

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

  return null;
}
