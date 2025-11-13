// hook/useNavigateToAuth.ts
"use client";

import { useRouter } from "next/navigation";

export default function useNavigateToAuth() {
  const router = useRouter();

  const goToAuth = (replace = false) => {
    if (replace) {
      // replaces current history entry
      router.replace("/auth");
    } else {
      // normal navigation
      router.push("/auth");
    }
  };

  return goToAuth;
}
