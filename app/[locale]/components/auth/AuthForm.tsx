// src/app/components/AuthForm.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, UserPlus, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import Tabs from "./Tabs";
import { useTranslate } from "../../../hooks/useTranslate"; // <-- hook for t()

type Mode = "signin" | "signup";

export default function AuthForm() {
  const { t } = useTranslate();

  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const mode: Mode = isSignUp ? "signup" : "signin";

  // form state
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");

  // UI state
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>(
    {
      identifier: null,
      password: null,
      fullName: null,
    }
  );
  const [success, setSuccess] = useState<boolean>(false);

  // Validators
  const isEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  const isPhone = (value: string) => /^\+?[1-9]\d{1,14}$/.test(value.trim());

  const validate = (): boolean => {
    const errs: Record<string, string | null> = {
      identifier: null,
      password: null,
      fullName: null,
    };

    const id = identifier.trim();
    if (!id) {
      errs.identifier = t("error.sign_in.email_number");
    } else if (!isEmail(id) && !isPhone(id)) {
      errs.identifier = t("error.sign_in.email_number");
    }

    if (!password) {
      errs.password = t("error.sign_up.email_number");
    } else if (password.length < 6) {
      errs.password = t("auth.error.short_password");
    }

    if (isSignUp) {
      if (!fullName.trim()) {
        errs.fullName = t("auth.error.required_fullname");
      } else if (fullName.trim().length < 2) {
        errs.fullName = t("auth.error.invalid_fullname");
      }
    }

    setFieldErrors(errs);
    return !Object.values(errs).some(Boolean);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validate()) return;

    setLoading(true);

    try {
      const body = {
        identifier: identifier.trim(),
        password,
        fullName: isSignUp ? fullName.trim() : undefined,
      };

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json?.fieldErrors) {
          setFieldErrors((prev) => ({ ...prev, ...json.fieldErrors }));
        }
        setError(json?.error || t("auth.error.generic"));
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 1500);
      setPassword("");
    } catch (err) {
      console.error("Auth request error:", err);
      setError(t("auth.error.network"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 relative">
      <Tabs
        isSignUp={isSignUp}
        setIsSignUp={(v) => {
          setIsSignUp(v);
          setFieldErrors({ identifier: null, password: null, fullName: null });
          setError(null);
        }}
      />

      <AnimatePresence mode="wait">
        <motion.form
          key={mode}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35 }}
          className="mt-6 flex flex-col gap-4"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          {/* Identifier */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              inputMode="text"
              placeholder={t("auth.login.email_placeholder")}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="off"
              aria-invalid={!!fieldErrors.identifier}
              aria-describedby={
                fieldErrors.identifier ? "identifier-error" : undefined
              }
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            <div className="absolute right-3 top-3 text-xs text-slate-500 dark:text-slate-400">
              {identifier
                ? isEmail(identifier)
                  ? t("auth.identifier.email")
                  : isPhone(identifier)
                  ? t("auth.identifier.phone")
                  : ""
                : ""}
            </div>
            {fieldErrors.identifier && (
              <p id="identifier-error" className="mt-1 text-xs text-red-500">
                {fieldErrors.identifier}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.login.password_placeholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={
                fieldErrors.password ? "password-error" : undefined
              }
              className="w-full pl-10 pr-10 py-3 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-3 p-1 text-gray-500"
              aria-label={
                showPassword
                  ? t("auth.toggle.hide_password")
                  : t("auth.toggle.show_password")
              }
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {fieldErrors.password && (
              <p id="password-error" className="mt-1 text-xs text-red-500">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Full name */}
          {isSignUp && (
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t("auth.login.full_name_placeholder")}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                aria-invalid={!!fieldErrors.fullName}
                aria-describedby={
                  fieldErrors.fullName ? "fullname-error" : undefined
                }
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              {fieldErrors.fullName && (
                <p id="fullname-error" className="mt-1 text-xs text-red-500">
                  {fieldErrors.fullName}
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
            className={`mt-2 flex items-center justify-center gap-2 bg-indigo-400 text-slate-800 dark:bg-indigo-600 dark:text-white font-semibold py-3 rounded-lg shadow-md transition
              ${loading ? "opacity-70 pointer-events-none" : ""} ${
              success ? "bg-emerald-500 text-white" : ""
            }`}
          >
            {loading ? (
              isSignUp ? (
                t("auth.button.creating")
              ) : (
                t("auth.button.signing_in")
              )
            ) : success ? (
              t("auth.button.success")
            ) : isSignUp ? (
              <>
                <UserPlus size={18} /> {t("auth.button.create_account")}
              </>
            ) : (
              <>
                <LogIn size={18} /> {t("auth.button.sign_in")}
              </>
            )}
          </motion.button>

          {/* Server/network error */}
          {error && (
            <p className="text-center text-sm text-red-500 mt-2">{error}</p>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <hr className="flex-1 border-gray-300 dark:border-slate-600" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t("auth.divider.or")}
            </span>
            <hr className="flex-1 border-gray-300 dark:border-slate-600" />
          </div>

          {/* Continue with Email */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex items-center justify-center gap-2 border border-gray-300 dark:border-slate-600 rounded-lg py-3 font-semibold text-slate-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
          >
            <Mail size={18} /> {t("auth.button.continue_email")}
          </motion.button>

          {/* Toggle */}
          <p className="text-center text-sm mt-4 text-gray-600 dark:text-gray-400">
            {isSignUp ? (
              <>
                {t("auth.toggle.already_have_account")}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-indigo-500 hover:underline"
                >
                  {t("auth.toggle.sign_in")}
                </button>
              </>
            ) : (
              <>
                {t("auth.toggle.no_account")}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-indigo-500 hover:underline"
                >
                  {t("auth.toggle.sign_up")}
                </button>
              </>
            )}
          </p>
        </motion.form>
      </AnimatePresence>
    </div>
  );
}
