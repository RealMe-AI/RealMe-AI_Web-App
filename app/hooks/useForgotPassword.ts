"use client";

import { useState } from "react";
import { baseUrl } from "@/app/lib/baseUrl";

export default function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendCode = async (onSuccess: () => void) => {
    setError("");

    console.log("handleSendCode called with email:", email);
    if (!email.trim()) {
      console.log("Email is empty");
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      console.log("Email validation failed for:", email);
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      console.log("Sending code to:", email);

      const res = await fetch(`${baseUrl}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: email,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send verification code");
      }

      onSuccess();
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    error,
    setError,
    loading,
    handleSendCode,
  };
}
