"use client";

import { useEffect } from "react";

//  Automatically clears a given status after a 3sec for contact form messages
export const useAutoClose = (
  status: string | null,
  clearStatus: (value: null) => void,
  delay = 5000,
) => {
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => clearStatus(null), delay);
      return () => clearTimeout(timer);
    }
  }, [status, clearStatus, delay]);
};
