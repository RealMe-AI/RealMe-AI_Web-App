"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useSignUpStore } from "@/app/zustand/useSignUpStore";
import { baseUrl } from "@/app/lib/baseUrl";

export function useOTPVerification() {
  const router = useRouter();

  // zustand store
  const { contact, method } = useSignUpStore();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invalidCode, setInvalidCode] = useState(false);
  const [resending, setResending] = useState(false);

  // Redirect if verification accessed incorrectly
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

  // FORMAT TIME → mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Warning color logic (Tailwind-ready)
  const timerTextClass =
    timeLeft <= 30 && !expired
      ? "text-red-500 animate-pulse"
      : "text-muted-foreground";

  // Handle OTP input
  const handleChange = useCallback((value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    setOtp((prev) => {
      const arr = [...prev];
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
      // Log what we're about to send
      const payload = { code, contact, method };
      console.log("=== OTP Verification Request ===");
      console.log("Payload:", payload);
      console.log("Contact:", contact);
      console.log("Method:", method);
      console.log("Code:", code);
      console.log("Base URL:", baseUrl);

      const res = await fetch(`${baseUrl}/auth/verify`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies if backend uses sessions
      });

      console.log("=== Response Details ===");
      console.log("Status:", res.status);
      console.log("Status Text:", res.statusText);
      console.log("OK:", res.ok);
      console.log("Headers:", Object.fromEntries(res.headers.entries()));

      // Try to parse response
      const contentType = res.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.log("Response text:", text);
        data = { error: text || "Unknown error" };
      }

      console.log("Response data:", data);

      // If message is an array, log each validation error
      if (Array.isArray(data.message)) {
        console.error("❌ Validation errors from backend:");
        data.message.forEach((msg: string, index: number) => {
          console.error(`  ${index + 1}. ${msg}`);
        });
      }

      if (!res.ok) {
        console.error("Verification failed:", data);
        const errorMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.error || data.message || "Invalid code";
        throw new Error(errorMessage);
      }

      console.log("✅ Verification successful!");
      router.push("/dashboard");
    } catch (error) {
      console.error("OTP verification error:", error);
      setInvalidCode(true);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOTP = async () => {
    setResending(true);

    try {
      const res = await fetch(`${baseUrl}/auth/resend-otp`, {
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
