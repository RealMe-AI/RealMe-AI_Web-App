"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useSignUpStore } from "@/app/zustand/useSignUpStore";
import { baseUrl } from "@/app/lib/baseUrl"

export function useOTPVerification() {
  const router = useRouter();

  //  use the correct zustand store
  const { contact, method } = useSignUpStore();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invalidCode, setInvalidCode] = useState(false);
  const [resending, setResending] = useState(false);

  //  Redirect user back if they enter verification without signup info
  useEffect(() => {
    if (!contact || !method) {
      router.push("/auth");
    }
  }, [contact, method, router]);

  // Countdown
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

  // Handle OTP input
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
      const res = await fetch(`${baseUrl}/auth/verify`, {
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

      if (!res.ok) throw new Error("Failed to resend OTP");

      // Reset UI + timer
      setOtp(["", "", "", "", "", ""]);
      setInvalidCode(false);
      setExpired(false);
      setTimeLeft(60);
    } catch (e) {
      console.error("Resend OTP failed:", e);
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
