import { useAuthStore } from "@/app/store/useAuthStore";
import { baseUrl } from "./baseUrl";

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function doRefresh(): Promise<string | null> {
  const { refreshToken, clearAuth } = useAuthStore.getState();

  if (!refreshToken) {
    clearAuth();
    return null;
  }

  try {
    const res = await fetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      clearAuth();
      return null;
    }

    const data = await res.json();
    const newAccessToken: string = data.accessToken;

    if (!newAccessToken) {
      clearAuth();
      return null;
    }

    useAuthStore.getState().setTokens({
      accessToken: newAccessToken,
      refreshToken: data.refreshToken ?? refreshToken,
    });

    return newAccessToken;
  } catch {
    clearAuth();
    return null;
  }
}

async function getFreshToken(): Promise<string | null> {
  const { accessToken, isTokenExpired } = useAuthStore.getState();

  if (accessToken && !isTokenExpired()) {
    return accessToken;
  }

  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = doRefresh().finally(() => {
      isRefreshing = false;
    });
  }

  return refreshPromise;
}

function redirectToAuth() {
  if (typeof window !== "undefined") {
    window.location.href = "/auth";
  }
}

export async function authFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const token = await getFreshToken();

  if (!token) {
    redirectToAuth();
    throw new Error("Session expired");
  }

  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (
    !headers.has("Content-Type") &&
    init?.method !== "GET" &&
    !(init?.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(input, { ...init, headers });

  if (res.status === 401) {
    const newToken = await doRefresh();

    if (!newToken) {
      redirectToAuth();
      throw new Error("Session expired");
    }

    const retryHeaders = new Headers(init?.headers);
    retryHeaders.set("Authorization", `Bearer ${newToken}`);
    if (
      !retryHeaders.has("Content-Type") &&
      init?.method !== "GET" &&
      !(init?.body instanceof FormData)
    ) {
      retryHeaders.set("Content-Type", "application/json");
    }

    return fetch(input, { ...init, headers: retryHeaders });
  }

  return res;
}
