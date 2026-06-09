"use client";

import { useState, useEffect, useCallback } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { showToast } from "@/app/lib/toast";

interface ResendResetOtpResponse {
  sent: boolean;
  userId?: string;
  message?: string;
}

export default function useResendResetOtp(login: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const canResend = timeLeft === 0;

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const resendCode = useCallback(async () => {
    if (!canResend) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${baseUrl}/auth/resend-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login }),
      });

      const data: ResendResetOtpResponse = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = data.message || "Failed to resend code";
        throw new Error(msg);
      }

      showToast.success("Code resent successfully");
      setTimeLeft(300);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to resend code";
      showToast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [login, canResend]);

  return {
    resendCode,
    loading,
    error,
    timeLeft,
    formattedTime: formatTime(timeLeft),
    canResend,
  };
}
