"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowLeft  } from "lucide-react";
import { useTranslations } from "next-intl";
import { freeFeatures, proFeatures } from "../../data/planData";
import { useRouter } from "@/i18n/routing";


export default function PricingPlans() {
  // Use the correct namespace matching your en.ts root key "plans"
  const t = useTranslations("plans");
  const tBack = useTranslations("auth");
  const [isYearly, setIsYearly] = useState(false);
  
  const router = useRouter();
  
  return (
    <section className="w-full py-12 from-indigo-100 via-white to-indigo-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-colors duration-900">
        {/* BACK BUTTON */}
    <div className="max-w-5xl mx-auto px-4 mb-3">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        {tBack("page.back_button")}
      </button>
    </div>
      <div className="flex flex-col max-w-5xl mx-auto gap-6 md:gap-8 md:flex-row justify-center">

        {/* FREE PLAN */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          
          className="flex-1 group"
        >
          <div className="h-full bg-linear-to-br from-indigo-100 to-white dark:from-neutral-900 dark:to-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-xl transition-shadow duration-200">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {t("free.title")}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {t("free.subtitle")}
              </p>

              <div className="mt-6 text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
                <span className="line-through text-neutral-400 mr-2">₦0</span>
                <span className="text-2xl align-baseline">
                  /{t("free.price")}
                </span>
              </div>

              {/* FEATURES */}
              <ul className="mt-6 space-y-4 text-sm text-neutral-600 dark:text-neutral-300">
                {freeFeatures.map((key) => (
                  <li key={key} className="flex items-start gap-3 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto pt-6">
              <button className="w-full px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium shadow-sm">
                {t("free.cta")}
              </button>
            </div>
          </div>
        </motion.div>

        {/* PRO PLAN */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          className="flex-1"
        >
          <div className="relative h-full rounded-2xl p-6 bg-linear-to-br from-indigo-600 to-violet-500 dark:from-indigo-700 dark:to-violet-600 text-white flex flex-col">
            <div className="absolute -top-3 sm:left-48 inline-block bg-neutral-900/90 dark:bg-neutral-100/10 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {t("pro.most_popular")}
            </div>

            <div>
              <h3 className="text-lg font-semibold">{t("pro.title")}</h3>
              <p className="text-sm opacity-90 mt-1">{t("pro.subtitle")}</p>

              {/* Billing */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-end sm:gap-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold">
                    {isYearly ? "₦45,000" : "₦5,000"}
                  </span>
                  <span className="text-sm mt-2 opacity-90">
                    {isYearly
                      ? `/${t("pro.price_yearly")}`
                      : `/${t("pro.price_monthly")}`}
                  </span>
                </div>

                <div className="mt-4 sm:mt-0 flex items-center gap-3 ml-auto">
                  <div className="text-sm opacity-90">{t("billing.monthly")}</div>
                  <button
                    aria-pressed={isYearly}
                    onClick={() => setIsYearly((s) => !s)}
                    className="relative inline-flex items-center h-6 w-11 rounded-full transition-colors bg-white/30"
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        isYearly ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <div className="text-sm opacity-90">{t("billing.yearly")}</div>
                </div>
              </div>

              {isYearly && (
                <div className="mt-3 text-sm font-medium text-white/90">
                  {t("pro.yearly_discount")}
                </div>
              )}

              {/* Pro FEATURES */}
              <ul className="mt-6 space-y-4 text-sm opacity-95">
                {proFeatures.map((key) => (
                  <li key={key} className="flex items-start gap-3 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto pt-6">
              <button className="w-full px-4 py-3 rounded-lg bg-white text-indigo-600 font-semibold shadow-sm">
                {t("pro.cta")}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 mt-6">
        {t("pricing_footer.billing_note")}
      </p>
    </section>
  );
}
