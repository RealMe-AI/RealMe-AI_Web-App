"use client";

import { useEffect, useState } from "react";

export function useSplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    // Defer to avoid synchronous setState warning
    const id = requestAnimationFrame(() => {
      setMounted(true);
      setShowSplash(true);
    });

    return () => cancelAnimationFrame(id);
  }, []);

  const finishSplash = () => setShowSplash(false);

  return { mounted, showSplash, finishSplash };
}
