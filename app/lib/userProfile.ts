"use client";

import { baseUrl } from "@/app/lib/baseUrl";
import { authFetch } from "@/app/lib/apiClient";
import { useUserStore } from "@/app/store/useUserStore";

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

// Shared across every consumer so only ONE /users/profile request runs per
// session, regardless of how many components call it.
let profileRequest: Promise<void> | null = null;

export async function loadProfile() {
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

  const providerKey =
    data.loginMethod === "Email"
      ? "auth.identifier.email"
      : data.loginMethod === "Google"
        ? "auth.identifier.google"
        : "auth.identifier.phone";

  useUserStore.getState().setFetchedUser({
    fullName: data.fullName,
    email: data.email,
    accountType: data.accountType === "Pro" ? "Pro" : "Free",
    plan: data.accountType === "Pro" ? "Pro User" : "Free Plan",
    provider: providerKey,
    avatar: data.picture || "/avatar.png",
    dateJoined: formatDate(data.dateJoined),
    lastLogin: formatLastLogin(data.lastLogin),
  });
}

export function ensureProfile(): Promise<void> {
  if (!profileRequest) {
    profileRequest = loadProfile().finally(() => {
      profileRequest = null;
    });
  }
  return profileRequest;
}