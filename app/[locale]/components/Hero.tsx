"use client";
import { motion } from "framer-motion";
import { CheckCircle2, Languages, Brain } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

import Image from "next/image";
import CTAButtons from "./CTAButtons";

export default function Hero() {
  const t = useTranslations("landing.hero");

  return (
    <section className="relative overflow-hidden pt-10 bg-linear-to-br from-indigo-100 via-white to-indigo-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-colors duration-900">
      {/* Decorative blurred light */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
        {/* 🧪 Dev shortcut to Dashboard (NOT translated) */}
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-xl bg-slate-700 text-white hover:bg-slate-800 transition"
        >
          Go to Dashboard (Dev Only)
        </Link>

        {/* LEFT SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center lg:text-left space-y-8"
        >
          {/* Badge */}
          <div className="flex items-center justify-center md:justify-start gap-2 px-4 py-2 rounded-full text-sm font-semibold text-indigo-400 mb-4">
            <Brain className="w-5 h-5" />
            <span>{t("first")}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-600 dark:text-white/80 leading-tight">
            {t("title")}
          </h1>

          {/* Subtitle */}
          <p className="sm:text-xl text-lg text-slate-600 dark:text-slate-300 max-w-xl">
            {t("subtitle")}
          </p>

          <div className="mt-8">
            <CTAButtons />
          </div>

          {/* Feature list */}
          <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center lg:justify-start text-sm text-slate-700 dark:text-slate-400">
            {["offer1", "offer2", "offer3"].map((key) => (
              <div key={key} className="flex items-center gap-2 justify-center">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 dark:text-indigo-400" />
                <span>{t(key)}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT SECTION — IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <div className="rounded-3xl overflow-hidden shadow-xl ring-1 ring-indigo-100 dark:ring-indigo-900/30 transform transition duration-900 hover:scale-105 hover:shadow-indigo-100/30">
            <Image
              src="/hero-image.jpg"
              alt="AI visual"
              width={900}
              height={600}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          {/* "Languages" badge */}
          <motion.div
            whileHover={{ scale: 1.08, y: -4 }}
            transition={{ type: "spring", stiffness: 250 }}
            className="absolute -bottom-10 -left-6"
          >
            <div className="flex items-center gap-3 bg-white/90 dark:bg-gray-900/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-indigo-100 dark:border-indigo-900/30">
              <Languages className="w-6 h-6 text-indigo-400" />
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  4
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {t("badge2")}
                </span>
              </div>
            </div>
          </motion.div>

          {/* "GPT-5 AI Model" badge */}
          <motion.div
            whileHover={{ scale: 1.08, y: -4 }}
            transition={{ type: "spring", stiffness: 250 }}
            className="absolute -top-10 -right-6"
          >
            <div className="flex items-center gap-3 bg-white/90 dark:bg-gray-900/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-indigo-100 dark:border-indigo-900/30">
              <Brain className="w-6 h-6 text-indigo-400" />
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  GPT-5
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {t("badge1")}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
