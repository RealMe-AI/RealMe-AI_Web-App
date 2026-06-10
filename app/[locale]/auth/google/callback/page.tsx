"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { motion } from "framer-motion";
import { useAuthStore } from "@/app/zustand/useAuthStore";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {

    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");

    if (!token) {
      router.replace("/auth?error=oauth_failed");
      return;
    }

    useAuthStore.getState().setTokens({
      accessToken: token,
      refreshToken: refreshToken ?? undefined,
    });

    router.replace("/dashboard");
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center h-screen">

    <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
        className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mb-4"
        />
        </div>
  );
}
