"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import AuthForm from "../components/auth/AuthForm";
import { useTranslate } from "../../hooks/useTranslate";
import Link from "next/link";

export default function AuthPage() {
  const { t } = useTranslate();
  const appName = "";

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-indigo-200 via-white to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Fixed Back to Home Button */}
      <Link
        href="/"
        className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 z-20 rounded-lg bg-white dark:bg-slate-700/80 text-slate-900 dark:text-white shadow-md hover:bg-slate-700 dark:hover:bg-slate-600/90 transition"
      >
        <span className="text-xl">←</span> {t("auth.page.back_button")}
      </Link>

      {/* Animated background gradient */}
      <div
      // initial={{ opacity: 0 }}
      // animate={{ opacity: 1, scale: [1, 1.05, 1] }}
      // transition={{ duration: 10, repeat: 1, repeatType: "mirror" }}
      // className="absolute inset-0 bg-red-400 dark:bg-slate-800 blur-3xl"
      // className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#c7d2fe_0%,transparent_60%)] dark:bg-[radial-gradient(circle_at_top_left,#312e81_0%,transparent_60%)] blur-3xl opacity-60"
      />

      {/* Auth Card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mt-15 p-8 rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-slate-700/50"
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

        <h2 className="text-2xl font-bold text-center text-slate-700 dark:text-white">
          {t("auth.page.hero_title")} <span className="text-indigo-500">RealMe AI</span>
        </h2>

        {/* Auth Form */}
        <AuthForm />
      </motion.div>
      
    </div>
  );
}
