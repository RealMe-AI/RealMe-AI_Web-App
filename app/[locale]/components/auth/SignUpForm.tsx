"use client";

import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, Eye, EyeOff, CheckCircle } from "lucide-react";
import useSignUp from "@/app/hooks/auth/useSignUp";
import GoogleAuthButton from "./GoogleAuthButton";

export default function SignUpForm() {
  const {
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
    checks,
    strengthScore,
  } = useSignUp();

  const getStrengthColor = () => {
    if (strengthScore <= 2) return "bg-red-500";
    if (strengthScore <= 3) return "bg-yellow-500";
    if (strengthScore <= 4) return "bg-blue-500";
    return "bg-emerald-500";
  };

  const getStrengthLabel = () => {
    if (strengthScore <= 2) return "Weak";
    if (strengthScore <= 3) return "Fair";
    if (strengthScore <= 4) return "Good";
    return "Strong";
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
          className="w-full pl-10 pr-4 py-3 rounded-lg text-white bg-slate-700/50
            border border-gray-200 dark:border-slate-600 placeholder-slate-300
            focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        <div className="absolute right-3 top-1 text-xs text-slate-400">          {identifier
            ? isEmail(identifier)
              ? t("auth.identifier.email")
              : isPhone(identifier)
              ? t("auth.identifier.phone")
              : ""
            : ""}
        </div>

        {fieldErrors.login && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.login}</p>
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
            border border-gray-200 dark:border-slate-600 placeholder-slate-300
           focus:ring-2 focus:ring-indigo-400 outline-none"
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

      {/* Password Strength Indicator */}
      {password && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(strengthScore / 5) * 100}%` }}
                className={`h-full ${getStrengthColor()} transition-all duration-300`}
              />
            </div>
            <span className={`text-xs font-medium ${strengthScore <= 2 ? "text-red-400" : strengthScore <= 3 ? "text-yellow-400" : strengthScore <= 4 ? "text-blue-400" : "text-emerald-400"}`}>
              {getStrengthLabel()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { key: "length", label: "6+ characters" },
              { key: "uppercase", label: "Uppercase letter" },
              { key: "lowercase", label: "Lowercase letter" },
              { key: "number", label: "Number" },
              { key: "special", label: "Special character" },
            ].map(({ key, label }) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-2 ${checks[key as keyof typeof checks] ? "text-emerald-400" : "text-slate-300"}`}
              >
                <CheckCircle className={`w-3.5 h-3.5  ${checks[key as keyof typeof checks] ? "opacity-100" : ""}`} />
                {label}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* FULL NAME */}
      <div className="relative">
        <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />

        <input
          type="text"
          value={fullName}
          placeholder={t("auth.login.full_name_placeholder")}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg text-white dark:bg-slate-700/50
            border border-gray-200 dark:border-slate-600 placeholder-slate-300 focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        {fieldErrors.fullName && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.fullName}</p>
        )}
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
        disabled={loading || strengthScore < 3}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className={`mt-2 flex items-center justify-center gap-2 
          font-semibold py-3 rounded-lg shadow-md transition
          ${
            loading || strengthScore < 3
              ? "bg-slate-400 cursor-not-allowed opacity-50 text-white"
              : success
              ? "bg-emerald-500 text-white"
              : "bg-indigo-400 dark:bg-indigo-600 text-white"
          }`}
      >
        {loading ? (
          t("auth.button.creating")
        ) : success ? (
          t("auth.button.success")
        ) : (
          <>
            <UserPlus size={18} /> {t("auth.button.create_account")}
          </>
        )}
      </motion.button>

      {error && <p className="text-center text-sm text-red-500">{error}</p>}
    </motion.form>
  );
}
