"use client";

import { useEffect, useState, useRef } from "react";
import { baseUrl } from "@/app/lib/baseUrl";
import { useUserStore } from "@/app/store/useUserStore";
import { authFetch } from "@/app/lib/apiClient";

interface BackendUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  loginMethod: "Email" | "Google" | "Phone";
  accountType: "Free" | "Pro";
  dateJoined: string;
  lastLogin: string;
  picture?: string;
}

function formatDate(date: string) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatLastLogin(date: string) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function truncateEmail(email: string, maxLength = 18) {
  if (!email) return "";
  if (email.length <= maxLength) return email;
  return email.slice(0, maxLength - 3) + "...";
}

export function useUserProfile() {
  const { user, setFetchedUser, setUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Skip if we've already fetched this session
    if (hasFetchedRef.current) return;

    let isMounted = true;

    async function fetchProfile() {
      try {
        setLoading(true);

        const res = await authFetch(`${baseUrl}/users/profile`, {
          method: "GET",
        });

        if (!res.ok) {
          let errorMsg = "Failed to fetch user profile";
          try {
            const errorData = await res.json();
            errorMsg = errorData.message || errorData.error || errorMsg;
          } catch {}
          throw new Error(`${errorMsg} (${res.status})`);
        }

        const data: BackendUser = await res.json();

        if (!isMounted) return;

        const providerKey =
          data.loginMethod === "Email"
            ? "auth.identifier.email"
            : data.loginMethod === "Google"
              ? "auth.identifier.google"
              : "auth.identifier.phone";

        const avatarUrl = data.picture || "/avatar.png";

        setFetchedUser({
          fullName: data.fullName,
          email:
            data.loginMethod === "Email" || data.loginMethod === "Google"
              ? truncateEmail(data.email, 18)
              : data.email,
          accountType: data.accountType === "Pro" ? "Pro" : "Free",
          plan: data.accountType === "Pro" ? "Pro User" : "Free Plan",
          provider: providerKey,
          avatar: avatarUrl,
          dateJoined: formatDate(data.dateJoined),
          lastLogin: formatLastLogin(data.lastLogin),
        });

        hasFetchedRef.current = true;
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Unable to load profile",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [setFetchedUser]);

  // Function to force refresh profile data
  const refreshProfile = () => {
    hasFetchedRef.current = false;
  };

  return {
    user,
    setUser,
    loading,
    error,
    refreshProfile,
  };
}
