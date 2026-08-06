"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/app/store/useUserStore";
import { ensureProfile } from "@/app/lib/userProfile";

export function useUserProfile() {
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    ensureProfile()
      .then(() => {
        if (isMounted) setError(null);
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Unable to load profile",
          );
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Function to force refresh profile data
  const refreshProfile = () => {
    ensureProfile().catch(() => {});
  };

  return {
    user,
    setUser,
    loading,
    error,
    refreshProfile,
  };
}