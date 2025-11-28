"use client";

import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import Image from "next/image";

export default function GetStarted() {
  const t = useTranslations();

  return (
    <section className="relative py-20 lg:py28 bg-linear-to-br from-indigo-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 lg-px-8 grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT: IMAGE */}
        <div className="order-2 lg:order-1">
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={"/"}
                alt={t("landing.get_started.image.title")}
                width={900}
                height={900}
                className="w-full h-auto object-cover"
              />

              {/* Image Badge */}
              <div className="absolute bottom-6 left-6 bg-white dark:bg-gray-900 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
                <div className="bg-indigo-100 dark:bg-gray-300 p-2 rounded-lg">
                  💬
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-300">
                    {t("landing.get_started.image.title")}
                  </p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    {t("landing.get_started.image.desc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: TEXT */}
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
            {t("landing.get_started.title")}{" "}
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
            {t("landing.get_started.subtitle")}
          </p>

          {/* STEPS */}
          <div className="space-y-8">
            {[
              {
                num: "1",
                title: t("landing.get_started.step1.title"),
                desc: t("landing.get_started.step1.desc"),
              },
              {
                num: "2",
                title: t("landing.get_started.step2.title"),
                desc: t("landing.get_started.step2.desc"),
              },
              {
                num: "3",
                title: t("landing.get_started.step3.title"),
                desc: t("landing.get_started.step3.desc"),
              },
            ].map((step) => (
              <div key={step.num} className="flex items-start gap-5">
                <div className="shrink-0 w-14 h-14 rounded-full  bg-indigo-300 text-slate-800 dark:bg-indigo-600 dark:text-white flex items-center justify-center font-bold text-xl shadow-lg transition-transform">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/auth/sign-up"
            className="mt-10 inline-flex items-center text-lg gap-2  bg-indigo-300 text-slate-800 dark:bg-linear-to-r from-indigo-600 to-indigo-500 dark:text-white px-8 py-4 rounded-lg font-semibold shadow-xl hover:opacity-90 transition-all transform hover:scale-105 group"
          >
            {t("landing.get_started.cta")}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
