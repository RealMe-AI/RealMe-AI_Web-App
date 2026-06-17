"use client";

import { useParams } from "next/navigation";
import { baseUrl } from "@/app/lib/baseUrl";

export default function useGoogleAuth() {
  const params = useParams();
  const locale = params.locale as string;

  const signInWithGoogle = () => {
    const callbackUrl = `${window.location.origin}/${locale}/auth/google/callback`;
    window.location.href = `${baseUrl}/auth/google?redirect_uri=${encodeURIComponent(callbackUrl)}`;
  };

  return { signInWithGoogle };
}
