"use client";

import { useState } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { authFetch } from "@/app/lib/apiClient";

export function useContactSupport() {
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (subject: string, message: string) => {
    setIsLoading(true);
    setStatus(null);
    try {
      const res = await authFetch(`${baseUrl}/support/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setStatus("success");
      return true;
    } catch {
      setStatus("error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { submit, status, isLoading, setStatus };
}
