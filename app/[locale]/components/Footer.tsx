"use client";

// import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("landing.footer");

  return (
    <footer className="w-full bg-slate-900 text-slate-200">
      <div className="border-t border-slate-800 text-slate-500 text-sm py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-4">

          {/* Left side */}
          <div className="text-center md:text-left">
            © {new Date().getFullYear()} RealMe AI. {t("rights")}.
          </div>

          {/* Right side - links */}
          {/* <div className="flex flex-wrap justify-center md:justify-end gap-4">
            <Link href="/">{t("privacy")}</Link>
            <Link href="/">{t("terms")}</Link>
            <Link href="/">{t("contact")}</Link>
          </div> */}

        </div>
      </div>
    </footer>
  );
}
