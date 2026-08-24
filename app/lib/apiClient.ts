import { useAuthStore } from "@/app/store/useAuthStore";
import { baseUrl } from "./baseUrl";
import { captureReturnTo } from "./returnTo";

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  failedQueue = [];
}

function readStoredRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("au");
    if (!raw) return null;
    return JSON.parse(raw).state?.refreshToken ?? null;
  } catch {
    return null;
  }
}

export async function doRefresh(): Promise<string | null> {
  const { clearAuth } = useAuthStore.getState();
  // Prefer the newest persisted refresh token: another tab may have
  // rotated it (single-use), so the in-memory copy can be consumed/stale.
  const refreshToken = readStoredRefreshToken() ?? useAuthStore.getState().refreshToken;

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
      if (res.status >= 400 && res.status < 500) {
        clearAuth();
      }
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
    return null;
  }
}

export async function ensureFreshToken(): Promise<string | null> {
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
    captureReturnTo(window.location.pathname + window.location.search);
    window.location.href = "/auth";
  }
}

export async function authFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const token = await ensureFreshToken();

  if (!token) {
    const { accessToken, refreshToken } = useAuthStore.getState();
    if (!accessToken && !refreshToken) {
      redirectToAuth();
    }
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

  let res: Response;
  try {
    res = await fetch(input, { ...init, headers });
  } catch (err) {
    if (err instanceof TypeError && err.message === "Failed to fetch") {
      throw new Error("No internet connection. Please check your network.");
    }
    throw err;
  }

  if (res.status === 401) {
    if (isRefreshing) {
      return new Promise<Response>((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            const retryHeaders = new Headers(init?.headers);
            retryHeaders.set("Authorization", `Bearer ${token}`);
            if (
              !retryHeaders.has("Content-Type") &&
              init?.method !== "GET" &&
              !(init?.body instanceof FormData)
            ) {
              retryHeaders.set("Content-Type", "application/json");
            }
            fetch(input, { ...init, headers: retryHeaders })
              .then(resolve)
              .catch(reject);
          },
          reject,
        });
      });
    }

    isRefreshing = true;
    try {
      const newToken = await doRefresh();
      if (!newToken) {
        processQueue(null, null);
        const { accessToken, refreshToken } = useAuthStore.getState();
        if (!accessToken && !refreshToken) {
          redirectToAuth();
        }
        throw new Error("Session expired");
      }

      processQueue(null, newToken);

      const retryHeaders = new Headers(init?.headers);
      retryHeaders.set("Authorization", `Bearer ${newToken}`);
      if (
        !retryHeaders.has("Content-Type") &&
        init?.method !== "GET" &&
        !(init?.body instanceof FormData)
      ) {
        retryHeaders.set("Content-Type", "application/json");
      }

      try {
        return await fetch(input, { ...init, headers: retryHeaders });
      } catch (err) {
        if (err instanceof TypeError && err.message === "Failed to fetch") {
          throw new Error("No internet connection. Please check your network.");
        }
        throw err;
      }
    } finally {
      isRefreshing = false;
    }
  }

  return res;
}
