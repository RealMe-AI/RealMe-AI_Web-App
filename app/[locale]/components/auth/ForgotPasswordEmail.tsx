"use client";

import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import SpinnerIcon from "../icons/SpinnerIcon";

interface ForgotPasswordEmailProps {
  email: string;
  setEmail: (email: string) => void;
  error?: string;
  loading: boolean;
  onSendCode: (e: React.FormEvent) => void;
  onBack: () => void;
}

export default function ForgotPasswordEmail({
  email,
  setEmail,
  error,
  loading,
  onSendCode,
}: ForgotPasswordEmailProps) {
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
                     bg-indigo-300 text-slate-800 dark:bg-indigo-600 dark:text-white mb-4 shadow-lg shadow-indigo-500/30"
        >
          <Mail className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-slate-600 dark:text-white mb-2">
          Reset Password
        </h2>
        <p className="text-slate-400 text-sm">
          Enter your email address and we&apos;ll send you a verification code
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onSubmit={onSendCode}
        className="flex flex-col gap-5"
      >
        {/* Email Input */}
        <div className="relative group">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-black dark:text-white bg-white dark:bg-transparent
            border border-gray-200 dark:border-slate-600 placeholder-gray-500
            dark:placeholder-gray-400 outline-none"
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
                         ? "bg-slate-400 cursor-not-allowed"
                         : "bg-indigo-300 text-slate-800 dark:bg-indigo-600 dark:text-white hover:shadow-indigo-500/30"
                     }`}
        >
          {/* Animated background */}
          {!loading && (
            <motion.div
              className="absolute inset-0 bg-indigo-300 text-slate-800 dark:bg-indigo-600 dark:text-white"
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
                <Send className="w-5 h-5" />
                Send Verification Code
              </>
            )}
          </span>
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
