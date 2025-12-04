"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";

export function useOTPVerification() {
  const router = useRouter();

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invalidCode, setInvalidCode] = useState(false);

  // Countdown timer — run once on mount
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setExpired(true);
          setTimeout(() => {
            router.push("/auth");
          }, 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  // Use useCallback to memoize handleChange and prevent it from changing on every render
  const handleChange = useCallback((value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    setOtp((prev) => {
      const newOtp = [...prev];
      newOtp[index] = value;
      return newOtp;
    });

    // Clear invalidCode highlight on input change
    setInvalidCode(false);
  }, []); // No dependencies needed since we use functional updates

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

  return {
    otp,
    timeLeft,
    expired,
    loading,
    invalidCode,
    handleChange,
    submitOTP,
  };
}