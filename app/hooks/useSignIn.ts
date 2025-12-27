"use client";

import { useState } from "react";
import { useTranslate } from "./useTranslate";
import { useRouter } from "@/i18n/routing";
import { baseUrl } from "@/app/lib/baseUrl";

export default function useSignIn() {
  const router = useRouter();
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
    console.log("[SignIn] Running validation");

    const errs: { identifier: string | null; password: string | null } = {
      identifier: null,
      password: null,
    };

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

    const isValid = !Object.values(errs).some(Boolean);
    console.log("[SignIn] Validation result:", isValid, errs);

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("[SignIn] Submit clicked");
    console.log("[SignIn] Identifier:", identifier);
    console.log("[SignIn] Password length:", password.length);
    console.log("[SignIn] Base URL:", baseUrl);

    if (!validate()) {
      console.warn("[SignIn] Validation failed, aborting request");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log("[SignIn] Sending login request…");

      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login: identifier.trim(),
          password,
        }),
      });

      console.log("[SignIn] Response status:", res.status);
      console.log("[SignIn] Response ok:", res.ok);

      let json: any = null;
      try {
        json = await res.json();
        console.log("[SignIn] Response body:", json);
      } catch (parseErr) {
        console.error("[SignIn] Failed to parse JSON response", parseErr);
      }

      if (!res.ok) {
        console.warn("[SignIn] Login failed");

        if (json?.fieldErrors) {
          setFieldErrors((prev) => ({ ...prev, ...json.fieldErrors }));
        }

        setError(json?.error || t("error.sign_in.general"));
        setLoading(false);
        return;
      }

      console.log("[SignIn] Login SUCCESS (according to frontend)");

      // 🚨 IMPORTANT: We are NOT validating token yet (on purpose)
      setSuccess(true);
      setIdentifier("");
      setPassword("");
      setFieldErrors({ identifier: null, password: null });

      console.log("[SignIn] Redirecting to /dashboard");
      router.push("/dashboard");

      setTimeout(() => setSuccess(false), 1500);
    } catch (err) {
      console.error("[SignIn] Network or runtime error:", err);
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
