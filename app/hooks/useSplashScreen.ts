"use client";

import { useEffect, useState } from "react";

export function useSplashScreen() {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("hasSeenSplash");

    if (!hasSeen) {
      // Defer setState to avoid synchronous update inside effect
      requestAnimationFrame(() => {
        setShowSplash(true);
        localStorage.setItem("hasSeenSplash", "true");
      });
    }
  }, []);

  const finishSplash = () => setShowSplash(false);

  return { showSplash, finishSplash };
}
