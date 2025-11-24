"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Languages, Brain } from "lucide-react";
import { offers } from "../../data/heroData";

import Image from "next/image";
import CTAButtons from "./CTAButtons";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations();

  return (
    <section className="relative overflow-hidden pt-20 bg-linear-to-br from-indigo-100 via-white to-indigo-200/40 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-700">

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center lg:text-left space-y-8"
        >
          {/* Badge */}
          <div className="flex items-center justify-center lg:justify-start gap-2 px-4 py-2 w-max mx-auto lg:mx-0 rounded-full text-sm font-semibold bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 shadow-sm border border-indigo-200/40 dark:border-indigo-900/20">
            <Brain className="w-5 h-5" />
            <span>{t("landing.hero.first")}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-700 dark:text-white/90 leading-tight">
            {t("landing.hero.title")}
          </h1>

          {/* Subtitle */}
          <p className="sm:text-xl text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0">
            {t("landing.hero.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="pt-4">
            <CTAButtons />
          </div>

          {/* Offer List */}
          <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-6 justify-center lg:justify-start text-sm text-slate-700 dark:text-slate-400">
            {offers.map((key) => (
              <div
                key={key}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>{t(key)}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT SECTION — IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative group"
        >
          {/* Image Wrapper */}
          <div className="rounded-3xl overflow-hidden shadow-xl ring-1 ring-indigo-200/40 dark:ring-indigo-900/50 transition duration-700 transform group-hover:scale-105 group-hover:shadow-indigo-200/40 dark:group-hover:shadow-indigo-900/30">
            <Image
              src="/hero-image.jpg"
              alt="AI illustration showing multilingual and intelligent model capabilities"
              width={900}
              height={600}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
              priority
            />
          </div>

          {/* Languages Badge */}
          <motion.div
            whileHover={{ scale: 1.08, y: -4 }}
            transition={{ type: "spring", stiffness: 260 }}
            className="absolute -bottom-10 -left-6"
          >
            <div className="flex items-center gap-3 bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl p-4 rounded-xl shadow-lg border border-indigo-100 dark:border-indigo-900/40">
              <Languages className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  4
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {t("landing.hero.badge2")}
                </span>
              </div>
            </div>
          </motion.div>

          {/* GPT-5 Badge */}
          <motion.div
            whileHover={{ scale: 1.08, y: -4 }}
            transition={{ type: "spring", stiffness: 260 }}
            className="absolute -top-10 -right-6"
          >
            <div className="flex items-center gap-3 bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl p-4 rounded-xl shadow-lg border border-indigo-100 dark:border-indigo-900/40">
              <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  GPT-5
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {t("landing.hero.badge1")}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
