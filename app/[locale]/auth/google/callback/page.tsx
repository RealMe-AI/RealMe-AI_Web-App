"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { baseUrl } from "@/app/lib/baseUrl";
import { motion } from "framer-motion";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      setError("No authorization code found.");
      return;
    }

    const exchangeCodeForToken = async () => {
      try {
        console.log("[GoogleCallback] Exchanging code for token...");
        const res = await fetch(
          `${baseUrl}/auth/google/callback?code=${code}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to exchange code for token");
        }

        const data = await res.json();
        const { accessToken } = data;

        if (accessToken) {
          console.log(
            "[GoogleCallback] Token received, saving and redirecting..."
          );
          localStorage.setItem("accessToken", accessToken);
          router.replace("/dashboard");
        } else {
          throw new Error("No access token received from backend");
        }
      } catch (err) {
        console.error("[GoogleCallback] Error:", err);
        setError("Authentication failed. Please try again.");
      }
    };

    exchangeCodeForToken();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-red-100 dark:border-red-900/30">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Login Failed
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-center mb-6">
          {error}
        </p>
        <button
          onClick={() => router.push("/auth")}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
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
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        Authenticating...
      </h2>
      <p className="text-slate-600 dark:text-slate-400">
        Please wait while we complete your sign-in.
      </p>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <CallbackContent />
      </Suspense>
    </div>
  );
}
