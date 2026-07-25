"use client";

import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";

export function ComingSoon() {
  const t = useTranslations("plans");

  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-linear-to-br from-indigo-100 via-white to-indigo-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-colors duration-900">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
          <Clock className="h-8 w-8 text-indigo-400 dark:text-indigo-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          {t("coming_soon.title")}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
          {t("coming_soon.subtitle")}
        </p>
      </div>
    </section>
  );
}
