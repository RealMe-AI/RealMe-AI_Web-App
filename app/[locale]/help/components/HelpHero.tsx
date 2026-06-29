"use client";

import Image from "next/image";

export function HelpHero() {
  return (
    <section className="relative flex min-h-[70vh] lg:h-screen w-full items-center overflow-hidden bg-linear-to-br from-indigo-100 via-white to-indigo-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-colors duration-900">
      <Image
        src="/Realme-mobile-banner.jpeg"
        alt="RealMe AI"
        fill
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
          Help & Support
        </h1>
        <p className="mt-4 max-w-lg text-sm sm:text-base text-white/75 leading-relaxed">
          Welcome to RealMe AI Support. Access guidance, troubleshooting steps,
          and expert assistance to ensure the best experience while using our
          platform.
        </p>
      </div>
    </section>
  );
}
