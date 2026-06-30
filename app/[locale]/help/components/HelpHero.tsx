"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export function HelpHero() {
  const t = useTranslations();
  return (
    <section className="relative flex min-h-[70svh] lg:h-screen w-full items-center overflow-hidden">
      <Image
        src="/Realme-mobile-banner.jpeg"
        alt="RealMe AI"
        fill
        sizes="100vw"
        priority
        className="object-cover lg:hidden"
      />
      <Image
        src="/realme-banner.png"
        alt="RealMe AI"
        fill
        priority
        className="object-cover hidden md:block"
      />
      <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/55 to-black/10" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 sm:px-10 lg:px-16">
        <h1 className="max-w-2xl text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
          {t("help.hero.title")}
        </h1>
        <p className="mt-4 max-w-lg text-sm sm:text-base text-white/75 leading-relaxed">
          {t("help.hero.subtitle")}
        </p>
      </div>
    </section>
  );
}
