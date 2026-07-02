"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import useGoogleAuth from "../../../hooks/auth/useGoogleAuth";
import SpinnerIcon from "../icons/SpinnerIcon";
import GoogleIcon from "../icons/GoogleIcon";

export default function GoogleAuthButton() {
  const t = useTranslations();
  const { signInWithGoogle } = useGoogleAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    signInWithGoogle();
  };

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="flex items-center text-sm md:text-base justify-center gap-3 w-full py-3 px-4 rounded-lg 
                 bg-white dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 
                 text-slate-700 dark:text-white font-semibold shadow-sm 
                 hover:bg-gray-50 dark:hover:bg-slate-700 transition
                 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isLoading ? <SpinnerIcon /> : <GoogleIcon />}
      {isLoading ? t("auth.button.redirecting") : t("auth.button.continue_google")}
    </motion.button>
  );
}
