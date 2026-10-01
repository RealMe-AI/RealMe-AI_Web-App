"use client";

import { motion } from "framer-motion";
import { useTranslate } from "@/app/hooks/useTranslate";
import Image from "next/image";
import AuthForm from "../components/auth/AuthForm";
import { BackButton } from "../components/BackButton";

export default function AuthPage() {
  const { t } = useTranslate();

  return (
    <div className="relative min-h-dvh overflow-hidden flex items-center justify-center">
      {/* Back Button */}
      <BackButton className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 text-white/80 hover:text-white" />
      {/* ===== Background Images ===== */}

      {/* Mobile Background */}
      <Image
        src="/auth-bg-mobile.webp"
        alt=""
        aria-hidden
        fill
        priority
        className="object-cover md:hidden"
      />

      {/* Desktop / Tablet Background */}
      <Image
        src="/auth-bg-desktop.webp"
        alt=""
        aria-hidden
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

        <h2 className="text-lg md:text-2xl font-bold text-center text-white">
          {t("auth.page.hero_title")}{" "}
          <span className="text-indigo-400">RealMe AI</span>
        </h2>

        {/* Auth Form */}
        <AuthForm />
      </motion.div>
    </div>
  );
}
