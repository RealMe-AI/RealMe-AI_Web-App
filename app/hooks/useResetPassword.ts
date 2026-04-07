"use client";

import { useState, useEffect, useRef } from "react";

export default function useResetPassword() {
  // OTP State
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Password State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  // Derived OTP State
  const canResend = resendTimer === 0;
  const isOtpComplete = otp.every((digit) => digit !== "");

  // Password Strengt\
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  const strengthScore = Object.values(checks).filter(Boolean).length;

  // Timer Logic
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Focus first OTP input on mount (can be triggered by parent effect if needed, but handled in component usually)

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

  const verifyOtp = async (onSuccess: () => void) => {
    const code = otp.join("");
    if (code.length !== 6) {
      setOtpError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      console.log("Verifying OTP:", code);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onSuccess();
    } catch (err) {
      setOtpError("Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (!canResend) return;

    // Simulate API call
    console.log("Resending code...");
    setResendTimer(60);
    setOtp(Array(6).fill(""));
    otpInputRefs.current[0]?.focus();
  };

  // Password Handlers
  const submitNewPassword = async (onSuccess: () => void) => {
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
      // Simulate API call
      console.log("Resetting password...");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onSuccess();
    } catch (err) {
      setPasswordError("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return {
    // OTP
    otp,
    otpError,
    resendTimer,
    canResend,
    isOtpComplete,
    otpInputRefs,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpPaste,
    verifyOtp,
    resendCode,

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
