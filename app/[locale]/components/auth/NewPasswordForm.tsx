"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface NewPasswordFormProps {
  onSubmit: (password: string) => void;
  loading?: boolean;
}

export default function NewPasswordForm({
  onSubmit,
  loading = false,
}: NewPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  // Password strength checks
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const strengthScore = Object.values(checks).filter(Boolean).length;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Please enter a password");
      return;
    }

    if (strengthScore < 3) {
      setError("Password is too weak. Please make it stronger.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    onSubmit(password);
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
                     bg-gradient-to-br from-violet-500 to-purple-600 mb-4 shadow-lg shadow-violet-500/30"
        >
          <ShieldCheck className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Create New Password
        </h2>
        <p className="text-slate-400 text-sm">
          Your new password must be different from previous passwords
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
        {/* New Password Input */}
        <div className="relative group">
          <div
            className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 
                         rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
          />

          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 
                            group-focus-within:text-violet-400 transition-colors"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              className="w-full pl-12 pr-12 py-4 rounded-xl text-white bg-slate-800/60 
                        backdrop-blur-sm border border-slate-700/50 placeholder-slate-500
                        focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 
                        outline-none transition-all duration-300"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 
                        hover:text-white transition-colors"
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
              {[
                { key: "length", label: "8+ characters" },
                { key: "uppercase", label: "Uppercase letter" },
                { key: "lowercase", label: "Lowercase letter" },
                { key: "number", label: "Number" },
                { key: "special", label: "Special character" },
              ].map(({ key, label }) => (
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
                  {label}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Confirm Password Input */}
        <div className="relative group">
          <div
            className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 
                         rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
          />

          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 
                            group-focus-within:text-violet-400 transition-colors"
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError("");
              }}
              className={`w-full pl-12 pr-12 py-4 rounded-xl text-white bg-slate-800/60 
                        backdrop-blur-sm border placeholder-slate-500
                        focus:ring-2 outline-none transition-all duration-300
                        ${
                          confirmPassword && password !== confirmPassword
                            ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                            : confirmPassword && password === confirmPassword
                              ? "border-emerald-500/50 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                              : "border-slate-700/50 focus:border-violet-500/50 focus:ring-violet-500/20"
                        }`}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 
                        hover:text-white transition-colors"
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
                ? "Passwords match"
                : "Passwords do not match"}
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
                         ? "bg-slate-700 cursor-not-allowed opacity-50"
                         : "bg-gradient-to-r from-violet-600 to-purple-600 hover:shadow-violet-500/30"
                     }`}
        >
          {/* Animated background */}
          {!loading && strengthScore >= 3 && password === confirmPassword && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}

          <span className="relative flex items-center gap-2">
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                Updating Password...
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                Reset Password
                <Sparkles className="w-4 h-4 opacity-70" />
              </>
            )}
          </span>
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
