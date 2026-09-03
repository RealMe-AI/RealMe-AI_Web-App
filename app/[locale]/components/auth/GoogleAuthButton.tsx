"use client";
import { useState, useEffect, useRef } from "react";
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
  // remount trigger
  const [googleKey, setGoogleKey] = useState(0); 
  const popupOpenedRef = useRef(false);

  const onGoogleSuccess = async (response: CredentialResponse) => {
    popupOpenedRef.current = false;
    setIsLoading(true);
    clearError();
    try {
      await handleCredentialResponse(response);
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleError = () => {
    popupOpenedRef.current = false;
    setIsLoading(false);
    // force fresh button on real errors too
    setGoogleKey((k) => k + 1); 
  };

  useEffect(() => {
    const handleFocus = () => {
      // If the popup was opened and we regain focus without success/error firing,
      // the user closed it manually — remount the button so it works next click.
      if (popupOpenedRef.current) {
        popupOpenedRef.current = false;
        setGoogleKey((k) => k + 1);
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  return (
    <div className="relative">
      <div
        className="absolute inset-0 z-10 opacity-0"
        onPointerDown={() => {
          popupOpenedRef.current = true;
        }}
      >
        <GoogleLogin
          key={googleKey}
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
        {isLoading ? "" : t("auth.button.continue_google")}
      </motion.button>
      {error && (
        <p className="text-red-500 text-sm text-center mt-2">{error}</p>
      )}
    </div>
  );
}