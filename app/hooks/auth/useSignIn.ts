"use client";

import { useState } from "react";
import { useTranslate } from "../useTranslate";
import { useRouter } from "@/i18n/routing";
import { baseUrl } from "@/app/lib/baseUrl";
import { useAuthStore } from "@/app/zustand/useAuthStore";

interface LoginErrorResponse {
  error?: string;
  fieldErrors?: {
    identifier?: string;
    password?: string;
  };
}

interface LoginSuccessResponse {
  accessToken: string;
}

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

    const errs = {
      identifier: null as string | null,
      password: null as string | null,
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

    const valid = !Object.values(errs).some(Boolean);
    console.log("[SignIn] Validation result:", valid, errs);

    return valid;
  };

  //  Verify token works by making a test API call
  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      console.log("[SignIn] Verifying token with test request...");
      
      const res = await fetch(`${baseUrl}/conversations?page=1&limit=1`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        console.log("[SignIn] Token verified successfully");
        return true;
      } else {
        console.error("[SignIn] Token verification failed:", res.status);
        return false;
      }
    } catch (err) {
      console.error("[SignIn] Token verification error:", err);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    if (!validate()) {
      console.warn("[SignIn] Validation failed");
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

      let json: LoginErrorResponse | LoginSuccessResponse;
      try {
        json = await res.json();
        console.log("[SignIn] Response body:", json);
      } catch {
        throw new Error("Invalid JSON response from server");
      }

      //  Backend says NO
      if (!res.ok) {
        console.warn("[SignIn] Login rejected by backend");
        const errorResponse = json as LoginErrorResponse;

        if (errorResponse.fieldErrors) {
          setFieldErrors((prev) => ({ ...prev, ...errorResponse.fieldErrors }));
        }

        setError(errorResponse.error || t("error.sign_in.general"));
        setLoading(false);
        return;
      }

      //  REQUIRE TOKEN
      const successResponse = json as LoginSuccessResponse;
      const accessToken = successResponse.accessToken;

      if (!accessToken) {
        setError("Invalid credentials");
        setLoading(false);
        return;
      }


      //  Store token
      useAuthStore.getState().setAccessToken(accessToken);

      //  VERIFY TOKEN BEFORE REDIRECTING
      const isTokenValid = await verifyToken(accessToken);

      if (!isTokenValid) {
        console.error("[SignIn] Token verification failed");
        useAuthStore.getState().clearAccessToken(); // Clean up invalid token
        setError("Login successful but unable to access dashboard. Please try again.");
        setLoading(false);
        return;
      }

      //  Only redirect if token is verified
      setSuccess(true);
      setIdentifier("");
      setPassword("");
      setFieldErrors({ identifier: null, password: null });

      router.push("/dashboard");

      setTimeout(() => setSuccess(false), 1500);
    } catch (err) {
      console.error("[SignIn] Network/runtime error:", err);
      setError(t("error.network"));
    } finally {
      setLoading(false);
    }
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