"use client";

import { motion } from "framer-motion";
import { useTranslate } from "../../hooks/useTranslate";
import Image from "next/image";
import AuthForm from "../components/auth/AuthForm";

export default function AuthPage() {
  const { t } = useTranslate();

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* ===== Background Images ===== */}

      {/* Mobile Background */}
      <Image
        src="/auth-bg-mobile.png"
        alt="Auth background mobile"
        fill
        priority
        className="object-cover md:hidden"
      />

      {/* Desktop / Tablet Background */}
      <Image
        src="/auth-bg-desktop.png"
        alt="Auth background desktop"
        fill
        priority
        className="hidden md:block object-cover"
      />

      {/* Optional overlay to slightly darken background */}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />

      {/* ===== Auth Card ===== */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="
          relative z-10 w-full max-w-md mx-4 p-8 rounded-2xl
          bg-slate-900/40
          backdrop-blur
          shadow-2xl
          border border-white/20 dark:border-white/10
        "
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="RealMe AI logo"
            width={64}
            height={64}
            className="animate-pulse"
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-white">
          {t("auth.page.hero_title")}{" "}
          <span className="text-indigo-500">RealMe AI</span>
        </h2>

        {/* Auth Form */}
        <AuthForm />
      </motion.div>
    </div>
  );
}
