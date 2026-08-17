"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/routing";

export const PREV_PATH_KEY = "realme:prevPath";
export const SUPPRESS_KEY = "realme:suppressPrev";

export function PathHistoryRecorder() {
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SUPPRESS_KEY)) {
      sessionStorage.removeItem(SUPPRESS_KEY);
      prevPathRef.current = pathname;
      return;
    }

    if (prevPathRef.current !== null) {
      sessionStorage.setItem(PREV_PATH_KEY, prevPathRef.current);
    }
    prevPathRef.current = pathname;
  }, [pathname]);

  return null;
}