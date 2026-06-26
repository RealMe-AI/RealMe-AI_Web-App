"use client";

import { useState } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { useTranslations } from "next-intl";

export default function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const t = useTranslations();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendCode = async (onSuccess: () => void) => {
    setError("");

    if (!email.trim()) {
      setError(t("error.forgot_password.enter_email"));
      return;
    }

    if (!validateEmail(email)) {
      setError(t("error.forgot_password.invalid_email"));
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
      setError(t("error.forgot_password.send_failed"));
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
