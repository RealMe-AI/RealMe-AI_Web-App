"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { motion } from "framer-motion";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    console.log("[AuthCallback] Full search parameters:", params);

    const token = searchParams.get("token");
    console.log("[AuthCallback] Extracted token:", token);

    if (!token) {
      console.warn("[AuthCallback] No token found, redirecting to auth with error");
      router.replace("/auth?error=oauth_failed");
      return;
    }

    localStorage.setItem("accessToken", token);
    console.log("[AuthCallback] Token saved, redirecting to dashboard");

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
