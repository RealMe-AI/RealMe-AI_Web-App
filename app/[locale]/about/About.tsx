"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { TeamCard } from "./components/TeamCard";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function About() {
  const t = useTranslations("about");
  const tCTA = useTranslations("landing.cta");

  return (
    <main>
      <section className="relative flex min-h-[55vh] lg:h-screen w-full items-center overflow-hidden">
        <Image
          src="/Realme-mobile-banner.jpeg"
          alt="RealMe AI"
          fill
          sizes="100vw"
          priority
          className="object-fill lg:hidden"
        />
        <Image
          src="/realme-banner.png"
          alt="RealMe AI"
          fill
          priority
          className="object-cover hidden lg:block"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/55 to-black/10 block" />

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          className="relative z-10 mx-auto w-full max-w-7xl px-6 py-32 sm:px-10 lg:px-16"
        >
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-2xl text-4xl leading-[1.1] sm:text-5xl lg:text-6xl"
          >
            <span className="block font-bold text-white">
              {t("hero.title_line1")}
            </span>
            <span className="block font-light text-white/85">
              {t("hero.title_line2")}
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-6 max-w-md text-sm font-medium text-white/75 sm:text-ba"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-9"
          >
            <Link
              href="/auth"
              className="group inline-flex items-center gap-2 rounded-md bg-indigo-400 px-5 py-3 lg:text-sm font-semibold text-white shadow-lg shadow-indigo-400/20 transition hover:bg-indigo-500 text-[11px]"
            >
              {tCTA("primary")}
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-white px-6 py-20 sm:px-10 lg:px-16 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-7xl"
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <h2 className="text-2xl font-medium text-slate-900 sm:text-3xl lg:col-span-4 dark:text-white">
              {t("mission.heading_prefix")}{" "}
              <span className="font-bold text-indigo-400 md:text-indigo-400 dark:text-indigo-400">
                {t("mission.heading_highlight")}
              </span>
            </h2>

            <p className="text-sm leading-relaxed text-slate-600 sm:text-base lg:col-span-7 lg:col-start-6 dark:text-slate-300">
              {t("mission.description")}
            </p>
          </div>
        </motion.div>
      </section>

      <section className="px-6 py-20 sm:px-10 lg:px-16 bg-linear-to-br from-indigo-100 via-white to-indigo-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-colors duration-900">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-2">
          <TeamCard
            quote={t("team.member1.quote")}
            image="/agunwa.jpeg"
            name="Agunwa Chidiebele Calistus"
            role={t("team.member1.role")}
          />
          <TeamCard
            quote={t("team.member2.quote")}
            image="/daniel.jpeg"
            name="Ezechukwu Chukwudubem Daniel"
            role={t("team.member2.role")}
          />
        </div>
      </section>
    </main>
  );
}
