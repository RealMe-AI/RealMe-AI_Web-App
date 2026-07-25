import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface FreePlanCardProps {
  t: (key: string) => string;
  features: string[];
}

export function FreePlanCard({ t, features }: FreePlanCardProps) {
  return (
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
            <span className="text-2xl align-baseline">/{t("free.price")}</span>
          </div>

          <ul className="mt-6 space-y-4 text-sm text-neutral-600 dark:text-neutral-300">
            {features.map((key) => (
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
  );
}
