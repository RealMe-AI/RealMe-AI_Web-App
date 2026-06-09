"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { AnimatePresence } from "framer-motion";
import useForgotPassword from "@/app/hooks/auth/useForgotPassword";
import useResetPassword from "@/app/hooks/auth/useResetPassword";
import useVerifyResetOtp from "@/app/hooks/auth/useVerifyResetOtp";
import useResendResetOtp from "@/app/hooks/auth/useResendResetOtp";
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
    userId,
    handleSendCode,
  } = useForgotPassword();

  const { verifyOtp: verifyResetOtp, loading: verifyLoading, error: verifyError } = useVerifyResetOtp();
  const { resendCode, canResend, formattedTime, loading: resendLoading } = useResendResetOtp(email);

  // OTP
  const {
    otp,
    setOtp,
    otpError,
    setOtpError,
    isOtpComplete,
    otpInputRefs,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpPaste,

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
    handleSendCode(() => {
      setStep("otp");
    });
  };

  const onVerifyCode = async () => {
    if (!userId) return;
    const code = otp.join("");
    const verified = await verifyResetOtp(userId, code);
    if (verified) {
      setStep("reset");
    }
  };

  const onSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    submitNewPassword(() => {
      router.push("/auth");
    });
  };

  const onResendCode = async () => {
    await resendCode();
    setOtp(Array(6).fill(""));
    setOtpError("");
    otpInputRefs.current[0]?.focus();
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
            otpError={verifyError || otpError}
            loading={verifyLoading}
            resendLoading={resendLoading}
            resendTimer={formattedTime}
            canResend={canResend}
            isOtpComplete={isOtpComplete}
            inputRefs={otpInputRefs}
            onChange={handleOtpChange}
            onKeyDown={handleOtpKeyDown}
            onPaste={handleOtpPaste}
            onVerify={onVerifyCode}
            onResend={onResendCode}
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
