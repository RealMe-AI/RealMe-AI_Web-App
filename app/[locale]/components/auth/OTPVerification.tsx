"use client";

import {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  ClipboardEvent,
} from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle2, ArrowLeft, RefreshCw } from "lucide-react";

interface OTPVerificationProps {
  onVerify: (otp: string) => void;
  onResend?: () => void;
  onBack?: () => void;
  email?: string;
  loading?: boolean;
}

export default function OTPVerification({
  onVerify,
  onResend,
  onBack,
  email = "",
  loading = false,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const canResend = resendTimer === 0;
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last digit
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every((digit) => digit !== "") && index === 5) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pastedData.length === 6) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      handleSubmit(pastedData);
    }
  };

  const handleSubmit = (code?: string) => {
    const otpCode = code || otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    onVerify(otpCode);
  };

  const handleResend = () => {
    if (canResend && onResend) {
      onResend();
      setResendTimer(60);

      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

  const isComplete = otp.every((digit) => digit !== "");

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
                     bg-gradient-to-br from-emerald-500 to-teal-600 mb-4 shadow-lg shadow-emerald-500/30"
        >
          <Shield className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">
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
        <div className="flex justify-center gap-3">
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
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl
                           bg-slate-800/60 backdrop-blur-sm border-2 text-white
                           focus:outline-none transition-all duration-300
                           ${
                             digit
                               ? "border-emerald-500/50 shadow-lg shadow-emerald-500/20"
                               : "border-slate-700/50 focus:border-indigo-500/50"
                           }
                           ${error ? "border-red-500/50 shake" : ""}`}
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

        {/* Verify Button */}
        <motion.button
          onClick={() => handleSubmit()}
          disabled={!isComplete || loading}
          whileHover={{ scale: !isComplete || loading ? 1 : 1.02 }}
          whileTap={{ scale: !isComplete || loading ? 1 : 0.98 }}
          className={`relative flex items-center justify-center gap-3 py-4 px-6 rounded-xl
                     font-semibold text-white overflow-hidden shadow-xl transition-all duration-300
                     ${
                       !isComplete || loading
                         ? "bg-slate-700 cursor-not-allowed opacity-50"
                         : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-emerald-500/30"
                     }`}
        >
          <span className="relative flex items-center gap-2">
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Verify Code
              </>
            )}
          </span>
        </motion.button>

        {/* Resend Code */}
        <div className="text-center">
          <p className="text-slate-400 text-sm mb-2">
            Didn&apos;t receive the code?
          </p>
          <motion.button
            onClick={handleResend}
            disabled={!canResend}
            whileHover={{ scale: canResend ? 1.05 : 1 }}
            className={`inline-flex items-center gap-2 text-sm font-medium transition-colors
                       ${
                         canResend
                           ? "text-indigo-400 hover:text-indigo-300 cursor-pointer"
                           : "text-slate-500 cursor-not-allowed"
                       }`}
          >
            <RefreshCw
              className={`w-4 h-4 ${!canResend ? "animate-pulse" : ""}`}
            />
            {canResend ? "Resend Code" : `Resend in ${resendTimer}s`}
          </motion.button>
        </div>

        {/* Back Link */}
        {onBack && (
          <motion.button
            type="button"
            onClick={onBack}
            whileHover={{ x: -4 }}
            className="flex items-center justify-center gap-2 text-slate-400 hover:text-white 
                       text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
