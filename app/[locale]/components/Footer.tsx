"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="border-t border-slate-800 text-slate-500 text-sm py-6">
        <div className="max-w-7xl mx-auto px-6 flex justify-between">
          <div>
            © {new Date().getFullYear()} RealMe AI. {t("footer.")}. @OwenVisuels
          </div>

          <div className="flex gap-4">
            <Link href={"/"}>{t("landing.footer.privacy")}</Link>
            <Link href={"/"}>{t("landing.footer.terms")}</Link>
            <Link href={"/"}>{t("landing.footer.contact")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
