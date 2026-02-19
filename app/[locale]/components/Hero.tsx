"use client";
import { motion } from "framer-motion";
import { CheckCircle2, Languages, Brain } from "lucide-react";
import { useTranslations } from "next-intl";

import Image from "next/image";
import CTAButtons from "./CTAButtons";

export default function Hero() {
  const t = useTranslations("landing.hero");

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-indigo-100 via-white to-indigo-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-colors duration-900">

      <div className="max-w-7xl mx-auto px-6 py-15 grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center lg:text-left space-y-8"
        >
          {/* Badge */}
            <div className="py-2 px-4 rounded-full bg-indigo-100 dark:bg-gray-900/50 max-w-max mx-auto lg:mx-0 mb-4">
          <div className="flex items-center justify-center md:justify-start gap-2 text-sm font-semibold text-indigo-400">

            <Brain className="w-5 h-5" />
            <span>{t("first")}</span>
          </div>
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
          className="relative group "
        >
          <div className="rounded-3xl overflow-hidden shadow-xl ring-1 ring-indigo-100 dark:ring-indigo-900/30 transform transition duration-900 hover:scale-105 hover:shadow-indigo-100/30">
            <Image
              src="/hero-image.png"
              alt="hero-image"
              width={900}
              height={600}
              priority
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          {/* "Languages" badge */}
          <motion.div
            whileHover={{ scale: 1.08, y: -4 }}
            transition={{ type: "spring", stiffness: 250 }}
            className="absolute -bottom-10 -left-6"
          >
            <div className="max-sm:p-2 max-sm:gap-1 flex items-center gap-3 bg-white/90 dark:bg-gray-900/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-indigo-100 dark:border-indigo-900/30">
              <Languages className="max-sm:w-4 w-6 h-6 text-indigo-400" />
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  4
                </span>
                <span className=" text-xs text-gray-500 dark:text-gray-400">
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
            <div className="max-sm:p-2 max-sm:gap-1 flex items-center gap-3 bg-white/90 dark:bg-gray-900/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-indigo-100 dark:border-indigo-900/30">
              <Brain className="max-sm:w-4 w-6 h-6 text-indigo-400" />
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
