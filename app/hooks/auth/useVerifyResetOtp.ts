"use client";

import { useState } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { showToast } from "@/app/lib/toast";

interface VerifyResetOtpResponse {
  verified: boolean;
  resetToken?: string;
  message?: string;
}

export default function useVerifyResetOtp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyOtp = async (
    userId: string,
    code: string,
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${baseUrl}/auth/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code }),
      });

      const data: VerifyResetOtpResponse = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          data.message || "Invalid verification code";
        throw new Error(msg);
      }

      showToast.success("Verification successful");
      return data.resetToken ?? null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Verification failed";
      showToast.error(msg);
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { verifyOtp, loading, error };
}
