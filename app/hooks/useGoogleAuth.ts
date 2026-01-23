"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { baseUrl } from "@/app/lib/baseUrl";

export default function useGoogleAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const signInWithGoogle = () => {
    window.location.href = `${baseUrl}/auth/google`;
  };

  useEffect(() => {
    const token = searchParams.get("accessToken");
    if (token) {
      console.log(
        "[useGoogleAuth] Found accessToken in URL, saving to localStorage..."
      );
      localStorage.setItem("accessToken", token);

      // Clean up URL to remove sensitive token and query params
      router.replace("/dashboard");
    }
  }, [searchParams, router]);

  return { signInWithGoogle };
}
