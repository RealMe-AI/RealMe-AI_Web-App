"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, ArrowLeft, Sparkles } from "lucide-react";

interface ForgotPasswordEmailProps {
  onSendCode: (email: string) => void;
  onBack?: () => void;
  loading?: boolean;
}

export default function ForgotPasswordEmail({
  onSendCode,
  onBack,
  loading = false,
}: ForgotPasswordEmailProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    onSendCode(email);
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
                     bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-lg shadow-indigo-500/30"
        >
          <Mail className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
        <p className="text-slate-400 text-sm">
          Enter your email address and we&apos;ll send you a verification code
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
        {/* Email Input */}
        <div className="relative group">
          <div
            className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 
                         rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
          />

          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 
                            group-focus-within:text-indigo-400 transition-colors"
            />
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              className="w-full pl-12 pr-4 py-4 rounded-xl text-white bg-slate-800/60 
                        backdrop-blur-sm border border-slate-700/50 placeholder-slate-500
                        focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 
                        outline-none transition-all duration-300"
              autoComplete="email"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-xs text-red-400 flex items-center gap-1"
            >
              <span className="w-1 h-1 rounded-full bg-red-400" />
              {error}
            </motion.p>
          )}
        </div>

        {/* Send Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className={`relative flex items-center justify-center gap-3 py-4 px-6 rounded-xl
                     font-semibold text-white overflow-hidden shadow-xl transition-all duration-300
                     ${
                       loading
                         ? "bg-slate-700 cursor-not-allowed"
                         : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-500/30"
                     }`}
        >
          {/* Animated background */}
          {!loading && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500"
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
                Sending Code...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Verification Code
                <Sparkles className="w-4 h-4 opacity-70" />
              </>
            )}
          </span>
        </motion.button>

        {/* Back Link */}
        {onBack && (
          <motion.button
            type="button"
            onClick={onBack}
            whileHover={{ x: -4 }}
            className="flex items-center justify-center gap-2 text-slate-400 hover:text-white 
                       text-sm font-medium transition-colors mt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </motion.button>
        )}
      </motion.form>
    </motion.div>
  );
}
