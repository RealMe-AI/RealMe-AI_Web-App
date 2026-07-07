"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { freeFeatures, proFeatures } from "../../constants/planData";
import { useRouter } from "@/i18n/routing";
import { FreePlanCard } from "./components/FreePlanCard";
import { ProPlanCard } from "./components/ProPlanCard";

export function PricingPlans() {
  const t = useTranslations("plans");
  const tBack = useTranslations("auth");
  const [isYearly, setIsYearly] = useState(false);

  const router = useRouter();

  return (
    <section className="w-full py-12 from-indigo-100 via-white to-indigo-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-colors duration-900">
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
        <FreePlanCard t={t} features={freeFeatures} />
        <ProPlanCard
          t={t}
          features={proFeatures}
          isYearly={isYearly}
          onToggleBilling={() => setIsYearly((s) => !s)}
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-xs text-neutral-500 dark:text-neutral-400 mt-6"
      >
        {t("pricing_footer.billing_note")}
      </motion.p>
    </section>
  );
}
