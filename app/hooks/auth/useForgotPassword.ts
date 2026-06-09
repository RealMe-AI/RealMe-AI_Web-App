"use client";

import { useState } from "react";
import { baseUrl } from "@/app/lib/baseUrl";

export default function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendCode = async (onSuccess: () => void) => {
    setError("");

    console.log("handleSendCode called with email:", email);
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
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

      const data = await res.json();
      if (data.userId) {
        setUserId(data.userId);
      }

      onSuccess();
    } catch (err) {
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
    userId,
    handleSendCode,
  };
}
