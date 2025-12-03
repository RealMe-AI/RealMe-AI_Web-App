"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useTranslate } from "../../../hooks/useTranslate";

export default function SignUpForm() {
  const { t } = useTranslate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    identifier: null as string | null,
    password: null as string | null,
    fullName: null as string | null,
  });

  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const isPhone = (v: string) => /^\+?[1-9]\d{1,14}$/.test(v.trim());

  const validate = () => {
    const errs: any = { identifier: null, password: null, fullName: null };
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

    if (!fullName.trim()) {
      errs.fullName = t("error.sign_up.full_name.required");
    } else if (fullName.trim().length < 2) {
      errs.fullName = t("error.sign_up.full_name.default");
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
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
          fullName: fullName.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.fieldErrors) setFieldErrors((prev) => ({ ...prev, ...json.fieldErrors }));
        setError(json.error || t("error.sign_up.general"));
        setLoading(false);
        return;
      }

      setSuccess(true);
      setPassword("");
      setTimeout(() => setSuccess(false), 1500);
    } catch (err) {
      setError(t("error.network"));
    }

    setLoading(false);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-4 mt-6"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      {/* Identifier */}
      <div className="relative">
        <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />

        <input
          type="text"
          placeholder={t("auth.login.email_placeholder")}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/50 dark:bg-slate-700/50
            border border-gray-200 dark:border-slate-600 placeholder-gray-500
            dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 outline-none"
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
          <p className="mt-1 text-xs text-red-500">{fieldErrors.identifier}</p>
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
          className="w-full pl-10 pr-10 py-3 rounded-lg bg-white/50 dark:bg-slate-700/50
            border border-gray-200 dark:border-slate-600 placeholder-gray-500
            dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          className="absolute right-3 top-3 p-1 text-gray-500"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>

        {fieldErrors.password && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
        )}
      </div>

      {/* FULL NAME */}
      <div className="relative">
        <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={fullName}
          placeholder={t("auth.login.full_name_placeholder")}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/50 dark:bg-slate-700/50
            border border-gray-200 dark:border-slate-600 placeholder-gray-500
            dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        {fieldErrors.fullName && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.fullName}</p>
        )}
      </div>

      {/* Submit */}
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`mt-2 flex items-center justify-center gap-2 
          bg-indigo-400 text-slate-800 dark:bg-indigo-600 dark:text-white 
          font-semibold py-3 rounded-lg shadow-md transition
          ${loading ? "opacity-70 pointer-events-none" : ""}
          ${success ? "bg-emerald-500 text-white" : ""}`}
      >
        {loading
          ? t("auth.button.creating")
          : success
          ? t("auth.button.success")
          : (
            <>
              <UserPlus size={18} /> {t("auth.button.create_account")}
            </>
          )}
      </motion.button>

      {error && <p className="text-center text-sm text-red-500">{error}</p>}
    </motion.form>
  );
}
