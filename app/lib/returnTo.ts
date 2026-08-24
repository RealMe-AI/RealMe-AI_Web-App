import { SUPPORTED_LOCALES, type Locale } from "./locales";

export const RETURN_TO_KEY = "realme:returnTo";
const SUPPORT_PATH_PREFIXES = ["/help"];

function stripLocale(pathname: string): string {
  const segments = pathname.split("/");
  if (segments.length > 1 && SUPPORTED_LOCALES.includes(segments[1] as Locale)) {
    return "/" + segments.slice(2).join("/");
  }
  return pathname;
}

function isValidReturnPath(path: string): boolean {
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  if (path === "/auth" || path.startsWith("/auth/")) return false;
  return true;
}

export function captureReturnTo(fullPath: string | null): void {
  if (!fullPath || typeof window === "undefined") return;
  try {
    const [pathname, search = ""] = fullPath.split("?");
    const path = stripLocale(pathname);
    if (!SUPPORT_PATH_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) {
      return;
    }
    if (!isValidReturnPath(path)) return;
    sessionStorage.setItem(RETURN_TO_KEY, search ? `${path}?${search}` : path);
  } catch {
    // sessionStorage unavailable; skip
  }
}

export function consumeReturnTo(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const path = sessionStorage.getItem(RETURN_TO_KEY);
    sessionStorage.removeItem(RETURN_TO_KEY);
    if (path && isValidReturnPath(path)) return path;
    return null;
  } catch {
    return null;
  }
}
