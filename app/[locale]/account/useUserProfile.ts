"use client";

import { useEffect, useState } from "react";
import { baseUrl } from "@/app/lib/baseUrl";

interface BackendUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  loginMethod: "email" | "number";
  accountType: "free" | "pro";
  dateJoined: string;
  lastLogin: string;
}

interface UserData {
  fullName: string;
  email: string;
  accountType: "Free" | "Pro";
  plan: "Free Plan" | "Pro User";
  provider: "Email" | "Number";
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
          throw new Error("Failed to fetch user profile");
        }

        const data: BackendUser = await res.json();

        if (!isMounted) return;

        setUser({
          fullName: data.fullName,
          email: data.email,
          accountType: data.accountType === "pro" ? "Pro" : "Free",
          plan: data.accountType === "pro" ? "Pro User" : "Free Plan",
          provider: data.loginMethod === "email" ? "Email" : "Number",
          avatar: "/avatar.png",
          dateJoined: formatDate(data.dateJoined),
          lastLogin: formatLastLogin(data.lastLogin),
        });
      } catch (err) {
        if (isMounted) {
          setError("Unable to load profile");
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
