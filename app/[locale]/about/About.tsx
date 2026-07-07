"use client";

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
              Human centered AI
            </span>
            <span className="block font-light text-white/85">
              for how you speak, think, and create
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-6 max-w-md text-sm font-medium text-white/75 sm:text-ba"
          >
            RealMe AI brings real-time voice, adaptive conversation, and
            multilingual understanding together in one platform designed to feel
            less like software, and more like you.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-9"
          >
            <Link
              href="/auth"
              className="group inline-flex items-center gap-2 rounded-md bg-indigo-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-400/20 transition hover:bg-indigo-500"
            >
              Get started
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
              Empowering{" "}
              <span className="font-bold text-indigo-400 md:text-indigo-400 dark:text-indigo-400">
                expression
              </span>
            </h2>

            <p className="text-sm leading-relaxed text-slate-600 sm:text-base lg:col-span-7 lg:col-start-6 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-white">
                RealMe AI
              </span>{" "}
              is a multilingual intelligence platform built to help people
              communicate, create, and express themselves without friction. By
              pairing real-time voice synthesis with adaptive chat
              personalities, RealMe AI turns everyday conversation into
              something more natural across language, tone, and context. Every
              interaction is shaped around one principle: technology should
              adapt to people, not the other way around.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="px-6 py-20 sm:px-10 lg:px-16 bg-linear-to-br from-indigo-100 via-white to-indigo-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-colors duration-900">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-2">
          <TeamCard
            quote="I believe the best technology doesn't just respond it understands. That's the standard we hold every part of RealMe AI to."
            image="/agunwa.jpeg"
            name="Agunwa Chidiebele Calistus"
            role="Founder & CEO at RealMe AI"
          />
          <TeamCard
            quote="Great products live at the intersection of design and engineering. RealMe AI is built right there, on purpose."
            image="/daniel.jpeg"
            name="Ezechukwu Chukwudubem Daniel"
            role="Co-Founder at RealMe AI"
          />
        </div>
      </section>
    </main>
  );
}
