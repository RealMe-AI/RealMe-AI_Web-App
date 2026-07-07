import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface ProPlanCardProps {
  t: (key: string) => string;
  features: string[];
  isYearly: boolean;
  onToggleBilling: () => void;
}

export function ProPlanCard({
  t,
  features,
  isYearly,
  onToggleBilling,
}: ProPlanCardProps) {
  return (
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
                onClick={onToggleBilling}
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

          <ul className="mt-6 space-y-4 text-sm opacity-95">
            {features.map((key) => (
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
  );
}
