"use client";

import { useState, useRef } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { showToast } from "@/app/lib/toast";

export default function useResetPassword() {
  // OTP State
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Password State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  // Derived OTP State
  const isOtpComplete = otp.every((digit) => digit !== "");

  // Password Strength
  const checks = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  const strengthScore = Object.values(checks).filter(Boolean).length;

  // OTP Handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError("");

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pastedData.length === 6) {
      setOtp(pastedData.split(""));
      otpInputRefs.current[5]?.focus();
    }
  };

  // Password Handlers
  const submitNewPassword = async (resetToken: string, onSuccess: () => void) => {
    setPasswordError("");

    if (!password) {
      setPasswordError("Please enter a password");
      return;
    }

    if (strengthScore < 3) {
      setPasswordError("Password is too weak");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, newPassword: password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = data.message || "Failed to reset password";
        throw new Error(msg);
      }

      showToast.success("Password reset successful. You can now login.");
      onSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to reset password";
      showToast.error(msg);
      setPasswordError(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    // OTP
    otp,
    setOtp,
    otpError,
    setOtpError,
    isOtpComplete,
    otpInputRefs,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpPaste,

    // Password
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    passwordError,
    checks,
    strengthScore,
    submitNewPassword,

    // Shared
    loading,
  };
}
