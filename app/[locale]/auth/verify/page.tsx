"use client";

import React from "react";
import { motion } from "framer-motion";
import OTPInput from "./OTPInput";
import { useOTPVerification } from "./useOTPVerification";
import { useSignUpStore } from "@/app/store/useSignUpStore";

export default function VerifyPage() {
  const {
    otp,
    expired,
    loading,
    resending,
    invalidCode,
    formattedTime,
    timerTextClass,
    handleChange,
    submitOTP,
    resendOTP,
  } = useOTPVerification();

  const { contact, method } = useSignUpStore();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-200 to-indigo-100 px-4 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          w-full max-w-md
          bg-white/10 dark:bg-gray-900/40 backdrop-blur-xl
          rounded-2xl p-8
          shadow-xl border border-white/20 dark:border-gray-700
          transition-colors
        "
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white text-center">
          Enter Verification Code
        </h1>

        <p className="text-gray-700 dark:text-gray-300 text-center mt-2 text-sm sm:text-base">
          {method === "email"
            ? `We sent a 6-digit code to ${contact || "your email"}.`
            : method === "phone"
              ? `We sent a 6-digit code to ${contact || "your number"}.`
              : "We sent a 6-digit code to your email or number."}
        </p>

        <OTPInput
          otp={otp}
          onChange={handleChange}
          expired={expired}
          isError={invalidCode}
        />

        {/* TIMER / EXPIRED MESSAGE */}
        <div className="text-center mt-4">
          {!expired ? (
            <p
              className={`text-sm font-light text-slate-600 dark:text-white ${timerTextClass}`}
            >
              Expires in <span className="font-semibold">{formattedTime}</span>
            </p>
          ) : (
            <p className="text-red-500 dark:text-red-400 text-sm font-light">
              Code expired.
            </p>
          )}
        </div>

        {/* RESEND SECTION – ONLY WHEN EXPIRED */}
        {expired && (
          <div className="text-center mt-4">
            <p className="text-slate-600 dark:text-gray-300 text-sm">
              Didn’t get a code?{" "}
              <button
                disabled={resending}
                onClick={resendOTP}
                className="
                  text-indigo-600 dark:text-indigo-400
                  font-semibold ml-1
                  hover:underline
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {resending ? "Resending..." : "Resend"}
              </button>
            </p>
          </div>
        )}

        {/* VERIFY BUTTON */}
        <button
          disabled={loading || expired}
          onClick={submitOTP}
          className="
            w-full mt-6 py-3 rounded-xl font-semibold
            text-slate-800 dark:text-white
            bg-indigo-300 hover:bg-indigo-200
            dark:bg-indigo-600 dark:hover:bg-indigo-500
            transition-colors disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {loading ? "Verifying..." : "Verify Code"}
        </button>
      </motion.div>
    </div>
  );
}
