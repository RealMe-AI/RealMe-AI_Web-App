"use client";

import { useState } from "react";
import { useTranslate } from "./useTranslate";
import { baseUrl } from "@/app/lib/baseUrl";
import { useRouter } from "@/i18n/routing";
import { useSignUpStore } from "@/app/zustand/useSignUpStore";

type FieldErrors = {
  login: string | null;
  password: string | null;
  fullName: string | null;
};

export default function useSignUp() {
  const { t } = useTranslate();
  const router = useRouter();
  const { setSignUpData } = useSignUpStore();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    login: null,
    password: null,
    fullName: null,
  });

  // Helpers
  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const isPhone = (v: string) => /^\+?[1-9]\d{1,14}$/.test(v.trim());

  const validate = () => {
    const errs: FieldErrors = {
      login: null,
      password: null,
      fullName: null,
    };

    const id = identifier.trim();
    if (!id) {
      errs.login = t("error.sign_in.email_number");
    } else if (!isEmail(id) && !isPhone(id)) {
      errs.login = t("error.sign_up.email_number");
    }

    if (!password) {
      errs.password = t("error.sign_in.password.required");
    } else if (password.length < 6) {
      errs.password = t("error.sign_up.password.min_length");
    }

    const name = fullName.trim();
    if (!name) {
      errs.fullName = t("error.sign_up.full_name.required");
    } else if (name.length < 2) {
      errs.fullName = t("error.sign_up.full_name.default");
    }

    setFieldErrors(errs);
    return !Object.values(errs).some((v) => v !== null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login: identifier.trim(),
          password,
          name: fullName.trim(),
        }),
      });

      const json = await res.json();
      console.log(json);

      if (!res.ok) {
        if (json.fieldErrors)
          setFieldErrors((prev) => ({ ...prev, ...json.fieldErrors }));

        setError(json.error || t("error.sign_up.general"));
        setLoading(false);
        return;
      }

      //  Success: clear inputs
      setSuccess(true);
      setIdentifier("");
      setPassword("");
      setFullName("");
      setFieldErrors({ login: null, password: null, fullName: null });

      // Save userId, email OR phone for OTP
      setSignUpData({
        contact: identifier.trim(),
        method: isEmail(identifier) ? "email" : "phone",
        userId: json.userId, // Save userId from registration response
      });

      // Redirect to OTP page
      router.push("/auth/verify");
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
    fullName,
    setFullName,
    showPassword,
    setShowPassword,
    loading,
    success,
    error,
    fieldErrors,
    handleSubmit,
    isEmail,
    isPhone,
  };
}
