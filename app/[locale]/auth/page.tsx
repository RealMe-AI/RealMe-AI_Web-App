"use client";

import { motion } from "framer-motion";
import { useTranslate } from "../../hooks/useTranslate";
import { useRouter } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";

import Image from "next/image";
import AuthForm from "../components/auth/AuthForm";

export default function AuthPage() {
  const { t } = useTranslate();
  const router = useRouter();

  return (
    <div className=" min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-indigo-200 via-white to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Fixed Back to Home Button */}
      <div className=" w-3.5flex flex-col">
        {/* <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-3 py-1 mt-2 rounded-lg bg-white dark:bg-slate-700/80 text-slate-900 dark:text-white shadow-md hover:bg-slate-200 dark:hover:bg-slate-600/90 transition"
        >
          <ArrowLeft className="w-4 h-4" /> {t("auth.page.back_button")}
        </button> */}

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
              src="/"
              alt="RealMe AI logo"
              width={64}
              height={64}
              className="animate-pulse"
            />
          </div>

          <h2 className="text-2xl font-bold text-center text-slate-700 dark:text-white">
            {t("auth.page.hero_title")}{" "}
            <span className="text-indigo-500">RealMe AI</span>
          </h2>

          {/* Auth Form */}
          <AuthForm />
        </motion.div>
      </div>
    </div>
  );
}
