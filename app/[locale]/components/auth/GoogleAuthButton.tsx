"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import useGoogleAuth from "../../../hooks/auth/useGoogleAuth";
import SpinnerIcon from "../icons/SpinnerIcon";
import GoogleIcon from "../icons/GoogleIcon";

export default function GoogleAuthButton() {
  const t = useTranslations();
  const { handleCredentialResponse, error, clearError } = useGoogleAuth();
  const [isLoading, setIsLoading] = useState(false);

  const onGoogleSuccess = async (response: CredentialResponse) => {
    await handleCredentialResponse(response);
    setIsLoading(false);
  };

  const onGoogleError = () => setIsLoading(false);

  return (
    <div className="relative">
      <div
        className="absolute inset-0 z-10 opacity-0"
        onPointerDown={() => { clearError(); setIsLoading(true); }}
      >
        <GoogleLogin
          onSuccess={onGoogleSuccess}
          onError={onGoogleError}
          size="large"
          shape="rectangular"
          theme="outline"
        />
      </div>
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading}
        className="flex items-center text-sm md:text-base justify-center gap-3 w-full py-3 px-4 rounded-lg 
                 bg-white dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 
                 text-slate-700 dark:text-white font-semibold shadow-sm 
                 hover:bg-gray-50 dark:hover:bg-slate-700 transition
                 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? <SpinnerIcon /> : <GoogleIcon />}
        {isLoading
          ? t("auth.button.redirecting")
          : t("auth.button.continue_google")}
      </motion.button>
      {error && (
        <p className="text-red-500 text-sm text-center mt-2">{error}</p>
      )}
    </div>
  );
}
