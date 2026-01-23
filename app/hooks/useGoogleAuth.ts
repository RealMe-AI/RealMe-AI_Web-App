"use client";

import { baseUrl } from "@/app/lib/baseUrl";

export default function useGoogleAuth() {
  const signInWithGoogle = () => {
    window.location.href = `${baseUrl}/auth/google`;
  };

  return { signInWithGoogle };
}
