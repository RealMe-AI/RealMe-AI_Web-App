"use client";

import { useState } from "react";
import { useTranslate } from "./useTranslate";
import {baseUrl} from "@/app/api/baseUrl";

export default function useSignIn() {
  const { t } = useTranslate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    identifier: null as string | null,
    password: null as string | null,
  });

  // Helpers
  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const isPhone = (v: string) => /^\+?[1-9]\d{1,14}$/.test(v.trim());

  const validate = () => {
    const errs: { identifier: string | null; password: string | null } = { identifier: null, password: null };
    const id = identifier.trim();

    if (!id) {
      errs.identifier = t("error.sign_in.email_number");
    } else if (!isEmail(id) && !isPhone(id)) {
      errs.identifier = t("error.sign_up.email_number");
    }

    if (!password) {
      errs.password = t("error.sign_in.password.required");
    } else if (password.length < 6) {
      errs.password = t("error.sign_up.password.min_length");
    }

    setFieldErrors(errs);
    return !Object.values(errs).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: identifier.trim(), password }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.fieldErrors)
          setFieldErrors((prev) => ({ ...prev, ...json.fieldErrors }));

        setError(json.error || t("error.sign_in.general"));
        setLoading(false);
        return;
      }

      // ✅ Success: clear inputs
      setSuccess(true);
      setIdentifier("");
      setPassword("");
      setFieldErrors({ identifier: null, password: null });

      setTimeout(() => setSuccess(false), 1500);
    } catch {
      setError(t("error.network"));
    }

    setLoading(false);
  };

  return {
    t,
    identifier,
    setIdentifier,
    password,
    setPassword,
    fieldErrors,
    showPassword,
    setShowPassword,
    loading,
    success,
    error,
    handleSubmit,
    isEmail,
    isPhone,
  };
}
