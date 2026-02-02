"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { AnimatePresence } from "framer-motion";
import useForgotPassword from "@/app/hooks/useForgotPassword";
import useResetPassword from "@/app/hooks/useResetPassword";
import ForgotPasswordEmail from "../../components/auth/ForgotPasswordEmail";
import OTPVerification from "../../components/auth/OTPVerification";
import NewPasswordForm from "../../components/auth/NewPasswordForm";

type Step = "email" | "otp" | "reset";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");

  // Hooks
  const {
    email,  
    setEmail,
    error: emailError,
    loading: emailLoading,
    handleSendCode,
  } = useForgotPassword();

  const {
    // OTP
    otp,
    otpError,
    resendTimer,
    canResend,
    isOtpComplete,
    otpInputRefs,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpPaste,
    verifyOtp,
    resendCode,

    // Password
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    passwordError,
    checks,
    strengthScore,
    submitNewPassword,

    // Shared
    loading: resetLoading,
  } = useResetPassword();

  // Handlers
  const onSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendCode(() => setStep("otp"));
  };

  const onVerifyCode = () => {
    verifyOtp(() => setStep("reset"));
  };

  const onSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    submitNewPassword(() => {
      // Show success message or toast here if needed
      router.push("/auth");
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {step === "email" && (
          <ForgotPasswordEmail
            key="email-step"
            email={email}
            setEmail={setEmail}
            error={emailError}
            loading={emailLoading}
            onSendCode={onSendEmail}
            onBack={() => router.push("/auth")}
          />
        )}

        {step === "otp" && (
          <OTPVerification
            key="otp-step"
            email={email}
            otp={otp}
            otpError={otpError}
            loading={resetLoading}
            resendTimer={resendTimer}
            canResend={canResend}
            isOtpComplete={isOtpComplete}
            inputRefs={otpInputRefs}
            onChange={handleOtpChange}
            onKeyDown={handleOtpKeyDown}
            onPaste={handleOtpPaste}
            onVerify={onVerifyCode}
            onResend={resendCode}
            onBack={() => setStep("email")}
          />
        )}

        {step === "reset" && (
          <NewPasswordForm
            key="reset-step"
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            error={passwordError}
            loading={resetLoading}
            strengthScore={strengthScore}
            checks={checks}
            onSubmit={onSubmitPassword}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
