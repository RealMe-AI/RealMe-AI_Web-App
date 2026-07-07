"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowLeft, RefreshCw, ShieldCheck } from "lucide-react";
import SpinnerIcon from "../icons/SpinnerIcon";
import { OTPVerificationProps } from "@/app/interface/otpVerification";

export default function OTPVerification({
  email,
  otp,
  otpError,
  loading,
  resendLoading,
  resendTimer,
  canResend,
  expired,
  timerTextClass,
  isOtpComplete,
  inputRefs,
  onChange,
  onKeyDown,
  onPaste,
  onVerify,
  onResend,
  onBack,
}: OTPVerificationProps) {
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
          Verify Your Email
        </h2>
        <p className="text-slate-400 text-sm">
          We&apos;ve sent a 6-digit code to
          {email && (
            <span className="block text-indigo-400 font-medium mt-1">
              {email}
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* OTP Input Slots */}
        <div className="flex justify-center gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="relative"
            >
              <input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => onChange(index, e.target.value)}
                onKeyDown={(e) => onKeyDown(index, e)}
                onPaste={index === 0 ? onPaste : undefined}
                className={`w-10 h-12 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl
                           bg-white dark:bg-slate-800 backdrop-blur-sm border-2 text-slate-600 dark:text-white
                           focus:outline-none transition-all duration-300
                           ${
                             digit
                               ? "border-indigo-500/50 shadow-lg shadow-indigo-300/20"
                               : "border-slate-300 dark:border-slate-700/50 focus:border-indigo-500/50"
                           }
                           ${otpError ? "border-red-500 shake" : ""}`}
              />
              {/* Glow effect when filled */}
              {digit && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-emerald-500/10 rounded-xl blur-md -z-10"
                />
              )}
            </motion.div>
          ))}
        </div>

        {otpError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-xs text-red-400 flex items-center justify-center gap-1"
          >
            <span className="w-1 h-1 rounded-full bg-red-400" />
            {otpError}
          </motion.p>
        )}

        {/* Verify Button */}
        <motion.button
          onClick={onVerify}
          disabled={!isOtpComplete || loading}
          whileHover={{ scale: !isOtpComplete || loading ? 1 : 1.02 }}
          whileTap={{ scale: !isOtpComplete || loading ? 1 : 0.98 }}
          className={`relative flex items-center justify-center gap-3 py-4 px-6 rounded-xl
                     font-semibold text-white overflow-hidden shadow-xl transition-all duration-300
                     ${
                       !isOtpComplete || loading
                         ? "bg-slate-400 cursor-not-allowed opacity-50"
                         : "bg-indigo-300 text-slate-800 dark:bg-indigo-600 dark:text-white hover:shadow-indigo-500/30"
                     }`}
        >
          <span className="relative flex items-center gap-2">
            {loading ? (
              <SpinnerIcon />
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Verify Code
              </>
            )}
          </span>
        </motion.button>

        {/* Countdown Timer / Expired */}
        <div className="text-center mt-4">
          {!expired && !canResend ? (
            <p
              className={`text-sm font-light text-slate-600 dark:text-white ${timerTextClass}`}
            >
              Expires in <span className="font-semibold">{resendTimer}</span>
            </p>
          ) : expired ? (
            <p className="text-red-500 dark:text-red-400 text-sm font-light">
              Code expired.
            </p>
          ) : null}
        </div>

        {/* Resend Code */}
        {canResend && (
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-2">
              Didn&apos;t receive the code?
            </p>
            <motion.button
              onClick={onResend}
              disabled={!canResend || resendLoading}
              whileHover={canResend && !resendLoading ? { scale: 1.05 } : {}}
              className={`inline-flex items-center gap-2 text-sm font-medium transition-colors
                       ${
                         canResend && !resendLoading
                           ? "text-indigo-400 hover:text-indigo-300 cursor-pointer"
                           : "text-slate-500 cursor-not-allowed"
                       }`}
            >
              <RefreshCw
                className={`w-4 h-4 ${resendLoading || !canResend ? "animate-spin" : ""}`}
              />
              {canResend ? "Resend Code" : `Resend in ${resendTimer}`}
            </motion.button>
          </div>
        )}

        {/* Back Link */}
        <motion.button
          type="button"
          onClick={onBack}
          whileHover={{ x: -4 }}
          className="flex items-center justify-center gap-2 text-slate-400 
                       text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>
      </div>
    </motion.div>
  );
}
