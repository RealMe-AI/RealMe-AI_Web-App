"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";

export function useOTPVerification() {
  const router = useRouter();

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invalidCode, setInvalidCode] = useState(false); // NEW: invalid highlight

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setExpired(true);
      setTimeout(() => {
        router.push("/auth/signup");
      }, 2000);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, router]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear invalidCode highlight on input change
    if (invalidCode) setInvalidCode(false);
  };

  const submitOTP = async () => {
    const code = otp.join("");
    if (code.length !== 6) return;

    setLoading(true);

    try {
      // CALL YOUR BACKEND VERIFY ENDPOINT HERE
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ code }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Invalid code");

      // Code correct → redirect
      router.push("/dashboard");
    } catch {
      // Highlight OTP boxes in red
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
    invalidCode, // pass to OTPInput
    handleChange,
    submitOTP,
  };
}
