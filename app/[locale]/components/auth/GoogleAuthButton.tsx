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
    setIsLoading(true);
    clearError();
    try {
      await handleCredentialResponse(response);
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleError = () => setIsLoading(false);

  return (
    <div className="relative w-full">
      <GoogleLogin
        onSuccess={onGoogleSuccess}
        onError={onGoogleError}
        theme="outline"
        shape="rectangular"
        size="large"
        text="continue_with"
        logo_alignment="center"
        containerProps={{ style: { width: "100%" } }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-sm border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700">
          <SpinnerIcon />
        </div>
      )}
    </div>
  );
}
