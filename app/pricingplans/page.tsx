"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { freeFeatures } from "../data/planData";
import { proFeatures } from "../data/planData";

export default function PricingPlans() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-12">

      {/* Toggle + container */}
      <div className="flex flex-col gap-6 md:gap-8 md:flex-row items-stretch">
        
        {/*  FREE PLAN */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          className="flex-1 group"
        >
          <div className="h-full bg-linear-to-br from-indigo-100 to-white dark:from-neutral-900 dark:to-neutral-900 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-xl transition-shadow duration-200">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Free Plan
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Perfect for getting started
              </p>

              <div className="mt-6 text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
                <span className="line-through text-neutral-400 mr-2">₦0</span>
                <span className="text-2xl align-baseline">/month</span>
              </div>

              {/* FEATURES */}
              <ul className="mt-6 space-y-4 text-sm text-neutral-600 dark:text-neutral-300">
                {freeFeatures.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 leading-relaxed"
                  >
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

           
            <div className="mt-auto pt-6">
              <button
                className="w-full px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium shadow-sm"
                aria-label="Get started free"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </motion.div>

        {/* PRO PLAN  */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1"
        >
          <div className="relative h-full rounded-2xl p-6 bg-linear-to-br from-indigo-600 to-violet-500 dark:from-indigo-700 dark:to-violet-600 text-white flex flex-col">
            <div className="absolute -top-3 sm:left-50 inline-block bg-neutral-900/90 dark:bg-neutral-100/10 text-white text-xs font-semibold px-3 py-1 rounded-full">
              MOST POPULAR
            </div>

            <div>
              <h3 className="text-lg font-semibold">RealMe AI Pro</h3>
              <p className="text-sm opacity-90 mt-1">
                For professionals who need more
              </p>

              {/* Billing Row */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-end sm:gap-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold">
                    {isYearly ? "₦45,000" : "₦5,000"}
                  </span>
                  <span className="text-sm mt-2 opacity-90">
                    {isYearly ? "/year" : "/month"}
                  </span>
                </div>

                <div className="mt-4 sm:mt-0 flex items-center gap-3 ml-auto">
                  <div className="text-sm opacity-90">Monthly</div>

                  {/* Toggle */}
                  <button
                    aria-pressed={isYearly}
                    onClick={() => setIsYearly((s) => !s)}
                    className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${
                      isYearly ? "bg-white/30" : "bg-white/30"
                    }`}
                    title="Toggle billing cycle"
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        isYearly ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>

                  <div className="text-sm opacity-90">Yearly</div>
                </div>
              </div>

              {isYearly && (
                <div className="mt-3 text-sm font-medium text-white/90">
                  Save 25% when you pay yearly
                </div>
              )}

              {/* FEATURES */}
              <ul className="mt-6 space-y-4 text-sm opacity-95">
                {proFeatures.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 leading-relaxed"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Button aligned bottom */}
            <div className="mt-auto pt-6">
              <button className="w-full px-4 py-3 rounded-lg bg-white text-indigo-600 font-semibold shadow-sm">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 mt-6">
        All plans include secure authentication, persistent chat history, and
        multilingual support
      </p>
    </section>
  );
}
