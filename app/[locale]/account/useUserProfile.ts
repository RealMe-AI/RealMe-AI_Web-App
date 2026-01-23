"use client";

import { useEffect, useState } from "react";
import { baseUrl } from "@/app/lib/baseUrl";

interface BackendUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  loginMethod: "Email" | "Phone";
  accountType: "Free" | "Pro";
  dateJoined: string;
  lastLogin: string;
  picture?: string;
}

interface UserData {
  fullName: string;
  email: string;
  accountType: "Free" | "Pro";
  plan: "Free Plan" | "Pro User";
  provider: "auth.identifier.email" | "auth.identifier.phone";
  avatar?: string;
  dateJoined: string;
  lastLogin: string;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatLastLogin(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function truncateEmail(email: string, maxLength = 18) {
  if (email.length <= maxLength) return email;
  return email.slice(0, maxLength - 3) + "...";
}

export function useUserProfile() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      try {
        setLoading(true);

        const token = localStorage.getItem("accessToken");

        const res = await fetch(`${baseUrl}/users/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!res.ok) {
          let errorMsg = "Failed to fetch user profile";
          try {
            const errorData = await res.json();
            errorMsg = errorData.message || errorData.error || errorMsg;
          } catch {
            // Fallback if not JSON
          }
          throw new Error(`${errorMsg} (${res.status})`);
        }

        const data: BackendUser = await res.json();

        if (!isMounted) return;

        // Map backend loginMethod to i18n translation key
        const providerKey =
          data.loginMethod === "Email"
            ? "auth.identifier.email"
            : "auth.identifier.phone";

        setUser({
          fullName: data.fullName,
          email:
            data.loginMethod === "Email"
              ? truncateEmail(data.email, 18)
              : data.email,
          accountType: data.accountType === "Pro" ? "Pro" : "Free",
          plan: data.accountType === "Pro" ? "Pro User" : "Free Plan",
          provider: providerKey,
          avatar: data.picture || "/avatar.png",
          dateJoined: formatDate(data.dateJoined),
          lastLogin: formatLastLogin(data.lastLogin),
        });
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Unable to load profile"
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
  }, []);

  return {
    user,
    setUser,
    loading,
    error,
  };
}
