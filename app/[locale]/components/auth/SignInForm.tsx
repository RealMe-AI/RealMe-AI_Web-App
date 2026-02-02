"use client";

import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import useSignIn from "../../../hooks/useSignIn";
import GoogleAuthButton from "./GoogleAuthButton";

export default function SignInForm() {
  const {
    t,
    identifier,
    setIdentifier,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    success,
    error,
    fieldErrors,
    handleSubmit,
    isEmail,
    isPhone,
  } = useSignIn();

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
          className="w-full pl-10 pr-4 py-3 rounded-lg text-white bg-slate-700/50
            border border-gray-200 dark:border-slate-600 placeholder-gray-500
            dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 outline-none"
          aria-invalid={!!fieldErrors.identifier}
        />

        <div className="absolute right-3 top-1 text-xs text-slate-400">
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
          className="w-full pl-10 pr-10 py-3 rounded-lg text-white bg-slate-700/50
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

      <div className="flex">
      <p className="text-xs text-slate-400 font-medium">Forgot Password?</p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-2">
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
        <span className="text-xs text-slate-400 font-medium">
          {t("auth.divider.or")}
        </span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
      </div>

      <GoogleAuthButton />

      {/* Submit */}
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`mt-2 flex items-center justify-center gap-2 
          bg-indigo-400  dark:bg-indigo-600 text-white 
          font-semibold py-3 rounded-lg shadow-md transition
          ${loading ? "opacity-70 pointer-events-none" : ""}
          ${success ? "bg-emerald-500 text-white" : ""}`}
      >
        {loading
          ? t("auth.button.signing_in")
          : success
          ? t("auth.button.success")
          : (
            <>
              <LogIn size={18} /> {t("auth.button.sign_in")}
            </>
          )}
      </motion.button>

      {error && <p className="text-center text-sm text-red-500">{error}</p>}
    </motion.form>
  );
}
