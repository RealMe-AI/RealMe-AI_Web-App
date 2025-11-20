"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="border-t border-slate-800 text-slate-500 text-sm py-6">
        <div className="max-w-7xl mx-auto px-6 flex justify-between">
          <div>
            © {new Date().getFullYear()} RealMe AI. {t("rights")}. @OwenVisuels
          </div>

          <div className="flex gap-4">
            <Link href={"/"}>{t("privacy")}</Link>
            <Link href={"/"}>{t("terms")}</Link>
            <Link href={"/"}>{t("contact")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
