"use client";

import { items } from "../../data/featuresData";
import { JSX } from "react";
import { Languages, Brain, Mic, History, Shield, Sliders } from "lucide-react";
import { useTranslate } from "../../hooks/useTranslate";

const iconMap: Record<string, JSX.Element> = {
  Languages: <Languages />,
  Brain: <Brain />,
  Mic: <Mic />,
  History: <History />,
  Shield: <Shield />,
  Sliders: <Sliders />,
};

export default function Features(): JSX.Element {
  const {t} = useTranslate();

  return (
    <section className="bg-white dark:bg-gray-800 max-w-full mx-auto px-6 py-12">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl text-slate-600 dark:text-white/80 font-bold text-center mb-6 leading-tight">
        {t("landing.features.title")}{" "}
        <span className="bg-linear-to-b from-indigo-300 to-indigo-600 bg-clip-text text-transparent">
          RealMe AI?
        </span>
      </h2>

      <p className="text-center text-lg text-slate-500 mt-2">
        {t("landing.features.subtitle")}
      </p>

      <div className="max-w-7xl mx-auto mt-8 grid md:grid-cols-3 gap-6">
        {items.map((it) => (
          <div
            key={it.key}
            className="p-8 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-linear-to-br from-indigo-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 glass hover:shadow-2xl hover:-translate-y-2 transition-all duration-900"
          >
            <div className="w-12 h-12 bg-primary-200 rounded-lg flex items-center justify-center mb-4 text-primary-700">
              <span className="p-4 rounded-2xl bg-linear-to-b from-indigo-300 to-indigo-600">
                {iconMap[it.icon]}
              </span>
            </div>

            <h3 className="font-bold text-slate-600 dark:text-white/80 text-xl">
              {t(`landing.features.items.${it.key}.title`)}
            </h3>

            <p className="text-slate-600 mt-4">
              {t(`landing.features.items.${it.key}.desc`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
