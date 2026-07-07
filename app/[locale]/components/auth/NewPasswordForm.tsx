"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle, ShieldCheck } from "lucide-react";
import SpinnerIcon from "../icons/SpinnerIcon";
import { NewPasswordFormProps } from "@/app/interface/newPassword";

export default function NewPasswordForm({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  error,
  loading,
  strengthScore,
  checks,
  onSubmit,
}: NewPasswordFormProps) {
  const t = useTranslations("auth.reset_password");

  const getStrengthColor = () => {
    if (strengthScore <= 2) return "bg-red-500";
    if (strengthScore <= 3) return "bg-yellow-500";
    if (strengthScore <= 4) return "bg-blue-500";
    return "bg-emerald-500";
  };

  const getStrengthLabel = () => {
    if (strengthScore <= 2) return t("strength.weak");
    if (strengthScore <= 3) return t("strength.fair");
    if (strengthScore <= 4) return t("strength.good");
    return t("strength.strong");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full 
                     bg-indigo-300 text-slate-800 dark:bg-indigo-600 dark:text-white mb-4 shadow-lg shadow-indigo-300/30"
        >
          <ShieldCheck className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-slate-600 dark:text-white mb-2">
          {t("title")}
        </h2>
        <p className="text-slate-400 text-sm">
          {t("subtitle")}
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onSubmit={onSubmit}
        className="flex flex-col gap-5"
      >
        {/* New Password Input */}
        <div className="relative group">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("new_placeholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-4 rounded-xl text-slate-600 bg-white dark:text-white dark:bg-slate-800 
                        backdrop-blur-sm border border-slate-300 placeholder-slate-500 focus:ring-2 outline-none transition-all duration-300"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 
                        "
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Password Strength Indicator */}
        {password && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-3"
          >
            {/* Strength Bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(strengthScore / 5) * 100}%` }}
                  className={`h-full ${getStrengthColor()} transition-all duration-300`}
                />
              </div>
              <span
                className={`text-xs font-medium ${
                  strengthScore <= 2
                    ? "text-red-400"
                    : strengthScore <= 3
                      ? "text-yellow-400"
                      : strengthScore <= 4
                        ? "text-blue-400"
                        : "text-emerald-400"
                }`}
              >
                {getStrengthLabel()}
              </span>
            </div>

            {/* Requirements Checklist */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(["length", "uppercase", "lowercase", "number", "special"] as const).map((key) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center gap-2 ${
                    checks[key as keyof typeof checks]
                      ? "text-emerald-400"
                      : "text-slate-500"
                  }`}
                >
                  <CheckCircle
                    className={`w-3.5 h-3.5 ${
                      checks[key as keyof typeof checks]
                        ? "opacity-100"
                        : "opacity-40"
                    }`}
                  />
                  {t(`checks.${key}`)}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Confirm Password Input */}
        <div className="relative group">
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 
                            group-focus-within:text-violet-400 transition-colors"
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("confirm_placeholder")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full pl-12 pr-12 py-4 rounded-xl text-slate-600 bg-white dark:text-white dark:bg-slate-800 
                        backdrop-blur-sm border border-slate-300 placeholder-slate-500
                        focus:ring-2 outline-none transition-all duration-300
                        ${
                          confirmPassword && password !== confirmPassword
                            ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                            : confirmPassword && password === confirmPassword
                              ? "border-emerald-500/50 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                              : "border-slate-700/50"
                        }`}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 
                        "
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Match indicator */}
          {confirmPassword && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mt-2 text-xs flex items-center gap-1 ${
                password === confirmPassword
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              <span
                className={`w-1 h-1 rounded-full ${
                  password === confirmPassword ? "bg-emerald-400" : "bg-red-400"
                }`}
              />
              {password === confirmPassword
                ? t("match")
                : t("no_match")}
            </motion.p>
          )}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-xs text-red-400 flex items-center justify-center gap-1"
          >
            <span className="w-1 h-1 rounded-full bg-red-400" />
            {error}
          </motion.p>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={
            loading || strengthScore < 3 || password !== confirmPassword
          }
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className={`relative flex items-center justify-center gap-3 py-4 px-6 rounded-xl
                     font-semibold text-white overflow-hidden shadow-xl transition-all duration-300
                     ${
                       loading ||
                       strengthScore < 3 ||
                       password !== confirmPassword
                         ? "bg-slate-400 cursor-not-allowed opacity-50"
                         : "bg-indigo-300 text-slate-800 dark:bg-indigo-600 dark:text-white hover:shadow-indigo-500/30"
                     }`}
        >
          {/* Animated background */}
          {!loading && strengthScore >= 3 && password === confirmPassword && (
            <motion.div
              className="absolute inset-0 bg-indigo-300 dark:bg-indigo-600"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}

          <span className="relative flex items-center gap-2">
            {loading ? (
              <SpinnerIcon />
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                {t("submit_button")}
              </>
            )}
          </span>
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
