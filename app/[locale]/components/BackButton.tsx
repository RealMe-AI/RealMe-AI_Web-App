"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useAuthStore } from "@/app/store/useAuthStore";
import { PREV_PATH_KEY, SUPPRESS_KEY } from "./PathHistoryRecorder";

const PROTECTED_ROUTES = ["/d"];

function isProtectedRoute(path: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );
}

interface BackButtonProps {
  className?: string;
}

export function BackButton({ className = "" }: BackButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("auth");

  const handleBack = () => {
    const prevPath = sessionStorage.getItem(PREV_PATH_KEY);
    const isAuthenticated = Boolean(useAuthStore.getState().accessToken);

    const reachable =
      prevPath &&
      prevPath !== pathname &&
      !(isProtectedRoute(prevPath) && !isAuthenticated);

    sessionStorage.setItem(SUPPRESS_KEY, "1");
    router.push(reachable ? prevPath : "/");
  };

  return (
    <button
      onClick={handleBack}
      aria-label={t("page.back_button")}
      className={`inline-flex items-center gap-2 text-sm transition ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      {t("page.back_button")}
    </button>
  );
}