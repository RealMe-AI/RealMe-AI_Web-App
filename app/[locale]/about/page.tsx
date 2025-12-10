"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AboutPage() {
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md 
                   flex items-center justify-center p-4">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="relative max-w-4xl w-full bg-white dark:bg-slate-900 
                   rounded-2xl shadow-2xl p-8 md:p-12 text-center"
      >
        <button
          onClick={() => router.back()}
          className="absolute right-4 top-4 p-2 rounded-full 
                     bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 
                     dark:hover:bg-slate-600 transition"
        >
          <X className="text-slate-800 dark:text-gray-200" size={18} />
        </button>

        <div className="flex justify-center">
          <Image
            src="/owen.jpg"
            alt="OwenVisuals"
            width={120}
            height={120}
            className="rounded-full object-cover shadow-lg 
                       border-4 border-indigo-500/40"
          />
        </div>

        <h2 className="mt-6 text-3xl font-bold text-slate-900 dark:text-white">
          OwenVisuals
        </h2>
        <p className="text-indigo-500 font-medium">
          Founder & CEO, RealMe AI
        </p>

        <p className="mt-6 text-slate-700 dark:text-gray-300 leading-relaxed">
          RealMe AI is a next-generation multilingual intelligence system
          built to help people communicate, learn, create, and express
          themselves with unmatched clarity. Designed by OwenVisuals,
          RealMe AI merges beautiful visual design with cutting-edge AI to
          deliver a premium user experience across chat, voice, and
          productivity tools.
        </p>

        <p className="mt-4 text-slate-700 dark:text-gray-300 leading-relaxed">
          From real-time voice synthesis to adaptive chat personalities,
          RealMe AI represents the future of human-centered AI. This project
          is powered by creativity, innovation, and a commitment to building
          tools that empower millions worldwide.
        </p>
      </motion.div>
    </div>
  );
}