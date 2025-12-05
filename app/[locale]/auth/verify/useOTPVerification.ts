"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useSignUp } from "@/app/zustand-store/useSignUp";

export function useOTPVerification() {
  const router = useRouter();

  // contains email/phone the user used
  const { contact, method } = useSignUp();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invalidCode, setInvalidCode] = useState(false);
  const [resending, setResending] = useState(false);

  // ❗ if user enters page without signup info → redirect back
  useEffect(() => {
    if (!contact || !method) {
      router.push("/auth");
    }
  }, [contact, method, router]);

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

  // OTP input
  const handleChange = useCallback((value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    setOtp((p) => {
      const arr = [...p];
      arr[index] = value;
      return arr;
    });

    setInvalidCode(false);
  }, []);

  // Submit OTP
  const submitOTP = async () => {
    const code = otp.join("");
    if (code.length !== 6) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ code }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Invalid code");

      router.push("/dashboard");
    } catch {
      setInvalidCode(true);
    } finally {
      setLoading(false);
    }
  };

  // RESEND OTP
  const resendOTP = async () => {
    setResending(true);

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        body: JSON.stringify({ contact, method }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to resend");

      // Reset timer + UI
      setOtp(["", "", "", "", "", ""]);
      setInvalidCode(false);
      setExpired(false);
      setTimeLeft(60);
    } catch (e) {
      console.error("Resend failed:", e);
    } finally {
      setResending(false);
    }
  };

  return {
    otp,
    timeLeft,
    expired,
    loading,
    invalidCode,
    resending,
    handleChange,
    submitOTP,
    resendOTP,
  };
}
