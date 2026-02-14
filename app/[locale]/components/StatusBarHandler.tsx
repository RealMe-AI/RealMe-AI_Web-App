"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function StatusBarHandler() {
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    // Determine the active theme
    const activeTheme = theme === "system" ? systemTheme : theme;

    if (!activeTheme) return;

    // Define colors for each theme
    const colors = {
      light: "#ffffff",
      dark: "#0f172a",
    };

    // Select the appropriate color
    const color = activeTheme === "dark" ? colors.dark : colors.light;

    // Update or create the theme-color meta tag
    let metaTag = document.querySelector('meta[name="theme-color"]');

    if (!metaTag) {
      metaTag = document.createElement("meta");
      metaTag.setAttribute("name", "theme-color");
      document.head.appendChild(metaTag);
    }

    metaTag.setAttribute("content", color);
  }, [theme, systemTheme]);

  return null;
}
