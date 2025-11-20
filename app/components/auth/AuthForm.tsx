// src/app/components/AuthForm.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, UserPlus, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import Tabs from "./Tabs";

type Mode = "signin" | "signup";

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const mode: Mode = isSignUp ? "signup" : "signin";

  // form state
  const [identifier, setIdentifier] = useState<string>(""); // email or phone
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");

  // UI state
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({
    identifier: null,
    password: null,
    fullName: null,
  });
  const [success, setSuccess] = useState<boolean>(false);

  // Validators
  const isEmail = (value: string) => {
    // simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  };

  const isPhone = (value: string) => {
    // E.164-ish: optional + then digits, length validation (2..15 digits)
    return /^\+?[1-9]\d{1,14}$/.test(value.trim());
  };

  const validate = (): boolean => {
    const errs: Record<string, string | null> = {
      identifier: null,
      password: null,
      fullName: null,
    };

    const id = identifier.trim();
    if (!id) {
      errs.identifier = "Email or phone is required.";
    } else if (!isEmail(id) && !isPhone(id)) {
      errs.identifier = "Enter a valid email or E.164 phone number (e.g. +123456789).";
    }

    if (!password) {
      errs.password = "Password is required.";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }

    if (isSignUp) {
      if (!fullName.trim()) {
        errs.fullName = "Full name is required for sign up.";
      } else if (fullName.trim().length < 2) {
        errs.fullName = "Enter your full name.";
      }
    }

    setFieldErrors(errs);
    return !Object.values(errs).some(Boolean);
  };

  // submit handler — calls /api/auth
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validate()) return;

    setLoading(true);

    try {
      const body = {
        mode,
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
        // server-side validation errors
        if (json?.fieldErrors) {
          setFieldErrors((prev) => ({ ...prev, ...json.fieldErrors }));
        }
        setError(json?.error || "Authentication failed.");
        setLoading(false);
        return;
      }

      // success
      setSuccess(true);
      setTimeout(() => {
        // reset / optionally redirect
        setSuccess(false);
      }, 1500);

      // optionally clear sensitive fields
      setPassword("");
    } catch (err) {
      console.error("Auth request error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 relative">
      <Tabs isSignUp={isSignUp} setIsSignUp={(v) => { setIsSignUp(v); setFieldErrors({ identifier: null, password: null, fullName: null }); setError(null); }} />

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
              placeholder="Email address or phone number..."
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="off"
              aria-invalid={!!fieldErrors.identifier}
              aria-describedby={fieldErrors.identifier ? "identifier-error" : undefined}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/50 dark:bg-slate-700/50 
                border border-gray-200 dark:border-slate-600 placeholder-gray-500 
                dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            {/* small hint showing detected type */}
            <div className="absolute right-3 top-3 text-xs text-slate-500 dark:text-slate-400">
              {identifier ? (isEmail(identifier) ? "email" : isPhone(identifier) ? "phone" : "") : ""}
            </div>
            {fieldErrors.identifier && (
              <p id="identifier-error" className="mt-1 text-xs text-red-500">{fieldErrors.identifier}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password..."
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? "password-error" : undefined}
              className="w-full pl-10 pr-10 py-3 rounded-lg bg-white/50 dark:bg-slate-700/50 
                border border-gray-200 dark:border-slate-600 placeholder-gray-500 
                dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-3 p-1 text-gray-500"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {fieldErrors.password && (
              <p id="password-error" className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
            )}
          </div>

          {/* Full name on signup */}
          {isSignUp && (
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Full name..."
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                aria-invalid={!!fieldErrors.fullName}
                aria-describedby={fieldErrors.fullName ? "fullname-error" : undefined}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/50 dark:bg-slate-700/50 
                  border border-gray-200 dark:border-slate-600 placeholder-gray-500 
                  dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              {fieldErrors.fullName && (
                <p id="fullname-error" className="mt-1 text-xs text-red-500">{fieldErrors.fullName}</p>
              )}
            </div>
          )}

          {/* Submit Button (shows success animation) */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
            className={`mt-2 flex items-center justify-center gap-2 bg-indigo-400 text-slate-800 dark:bg-indigo-600 dark:text-white font-semibold py-3 rounded-lg shadow-md transition
              ${loading ? "opacity-70 pointer-events-none" : ""}
              ${success ? "bg-emerald-500 text-white" : ""}`}
          >
            {loading ? (isSignUp ? "Creating…" : "Signing in…") : success ? "Success" : (isSignUp ? <><UserPlus size={18} /> Create Account</> : <><LogIn size={18} /> Sign In</>)}
          </motion.button>

          {/* server / network error */}
          {error && <p className="text-center text-sm text-red-500 mt-2">{error}</p>}

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <hr className="flex-1 border-gray-300 dark:border-slate-600" />
            <span className="text-sm text-gray-500 dark:text-gray-400">OR</span>
            <hr className="flex-1 border-gray-300 dark:border-slate-600" />
          </div>

          {/* Continue with Email Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex items-center justify-center gap-2 border border-gray-300 dark:border-slate-600 rounded-lg py-3 font-semibold text-slate-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
          >
            <Mail size={18} /> Continue with Email
          </motion.button>

          {/* Toggle Text */}
          <p className="text-center text-sm mt-4 text-gray-600 dark:text-gray-400">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-indigo-500 hover:underline"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-indigo-500 hover:underline"
                >
                  Sign Up
                </button>
              </>
            )}
          </p>
        </motion.form>
      </AnimatePresence>
    </div>
  );
}
