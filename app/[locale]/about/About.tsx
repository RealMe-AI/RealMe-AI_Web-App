"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutRealMe() {
  return (
    <section className="w-full py-16 px-6 md:px-14 lg:px-24">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE – ABOUT TEXT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-lg bg-white/40 dark:bg-slate-800/40 rounded-2xl p-8 shadow-xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-linear-to-r from-indigo-600 to-purple-600 
                         dark:from-indigo-300 dark:to-purple-300 text-transparent bg-clip-text">
            About RealMe AI
          </h2>

          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            RealMe AI is a next-generation multilingual AI companion designed to provide 
            intuitive conversations, real-time intelligence, and seamless interactions across 
            devices. Built with Next.js 16, powerful UI motion, and advanced OpenAI models, 
            RealMe AI delivers fast, human-like responses with personalization at the core.
          </p>

          <p className="mt-4 text-slate-700 dark:text-slate-300 leading-relaxed">
            Whether you&apos;re exploring ideas, improving productivity, or building complex 
            workflows, RealMe AI grows with you adapting to your language, tone, and goals.
          </p>
        </motion.div>

        {/* RIGHT SIDE – FOUNDER CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center text-center bg-white/40 dark:bg-slate-800/40 
                     backdrop-blur-xl rounded-2xl p-8 shadow-xl"
        >
          <div className="relative w-40 h-40 mb-4">
            <Image
              src="/images/owen.jpg"        // <-- Replace with your real image path
              alt="OwenVisuals"
              fill
              className="object-cover rounded-full border-4 border-indigo-500 dark:border-indigo-300"
            />
          </div>

          <h3 className="text-2xl font-semibold text-slate-800 dark:text-white">
            OwenVisuals
          </h3>

          <p className="text-indigo-600 dark:text-indigo-300 font-medium">
            Founder & CEO, RealMe AI
          </p>

          <p className="mt-3 text-slate-700 dark:text-slate-300 leading-relaxed">
            Passionate about AI, design, and digital experiences. OwenVisuals created 
            RealMe AI to push human–AI interaction into a more expressive, intuitive, 
            and creative era.
          </p>

        </motion.div>
      </div>
    </section>
  );
}
