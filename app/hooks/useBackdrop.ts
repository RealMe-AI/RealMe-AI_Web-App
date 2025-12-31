"use client";
import { useEffect } from "react";

/**
 * useBackdrop Hook
 
 * @param isOpen - Whether the backdrop/modal is open
 */
export function useBackdrop(isOpen: boolean) {
  useEffect(() => {
    // SSR safety check
    if (typeof document === "undefined") return; 

    const body = document.body;
    const originalOverflow = body.style.overflow;

    if (isOpen) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = originalOverflow || "";
    }

    // Cleanup on unmount or when isOpen changes
    return () => {
      body.style.overflow = originalOverflow || "";
    };
  }, [isOpen]);
}
