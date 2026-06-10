"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useSignUpStore } from "@/app/zustand/useSignUpStore";
import { useAuthStore } from "@/app/zustand/useAuthStore";
import { baseUrl } from "@/app/lib/baseUrl";

export function useOTPVerification() {
  const router = useRouter();

  // zustand store
  const { contact, method, userId } = useSignUpStore();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invalidCode, setInvalidCode] = useState(false);
  const [resending, setResending] = useState(false);

  // Guard: prevent direct access
  useEffect(() => {
    if (!contact || !method || !userId) {
      router.push("/auth");
    }
  }, [contact, method, userId, router]);

  // Countdown timer
  useEffect(() => {
    if (expired) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [expired]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const timerTextClass =
    timeLeft <= 30 && !expired
      ? "text-red-500 animate-pulse"
      : "text-muted-foreground";

  const handleChange = useCallback((value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    setOtp((prev) => {
      const arr = [...prev];
      arr[index] = value;
      return arr;
    });

    setInvalidCode(false);
  }, []);

  // SUBMIT OTP
  const submitOTP = async () => {
    const code = otp.join("");
    if (code.length !== 6) return;

    setLoading(true);
    setInvalidCode(false);

    try {
      const res = await fetch(`${baseUrl}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, userId }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          Array.isArray(data.message)
            ? data.message.join(", ")
            : data.error || data.message || "Invalid code";
        throw new Error(msg);
      }

      // EXPECT ACCESS TOKEN
      const accessToken = data.accessToken;

      if (!accessToken) {
        throw new Error("Verification succeeded but no access token returned");
      }

      // STORE TOKEN (CRITICAL)
      useAuthStore.getState().setTokens({
        accessToken,
        refreshToken: data.refreshToken,
      });

      //  REDIRECT ONLY AFTER TOKEN EXISTS
      router.push("/dashboard");
    } catch (err) {
      console.error("OTP verification error:", err);
      setInvalidCode(true);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP (unchanged)
  const resendOTP = async () => {
    setResending(true);

    try {
      const res = await fetch(`${baseUrl}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: contact }),
      });

      if (!res.ok) {
        throw new Error("Failed to resend OTP");
      }

      setOtp(["", "", "", "", "", ""]);
      setInvalidCode(false);
      setExpired(false);
      setTimeLeft(300);
    } catch (e) {
      console.error("Resend OTP failed:", e);
    } finally {
      setResending(false);
    }
  };

  return {
    otp,
    timeLeft,
    formattedTime: formatTime(timeLeft),
    timerTextClass,
    expired,
    loading,
    invalidCode,
    resending,
    handleChange,
    submitOTP,
    resendOTP,
  };
}
