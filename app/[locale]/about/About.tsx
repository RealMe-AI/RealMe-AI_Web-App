"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAboutStore } from "../../zustand/useAboutStore";

export default function AboutOverlay() {
  const { showAbout, closeAbout } = useAboutStore();

  return (
    <AnimatePresence>
      {showAbout && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-center justify-center p-4"
        >
          {/* Modal */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            className="relative max-w-4xl w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 md:p-12 text-center"
          >
            {/* Close Button */}
            <button
              onClick={closeAbout}
              className="absolute right-4 top-4 p-2 rounded-full bg-gray-200 dark:bg-slate-700"
            >
              <X className="text-slate-800 dark:text-gray-200" size={18} />
            </button>

            {/* Founder Photo */}
            <img
              src="/owen.jpg"
              alt="OwenVisuals"
              className="w-28 h-28 mx-auto rounded-full object-cover shadow-lg border-4 border-indigo-500/40"
            />

            {/* Name */}
            <h2 className="mt-6 text-3xl font-bold text-slate-900 dark:text-white">
              OwenVisuals
            </h2>
            <p className="text-indigo-500 font-medium">Founder & CEO, RealMe AI</p>

            {/* About Text */}
            <p className="mt-6 text-slate-700 dark:text-gray-300 leading-relaxed">
              RealMe AI is a next-generation multilingual intelligence system built
              to help people communicate, learn, create, and express themselves with
              unmatched clarity. Designed by OwenVisuals, RealMe AI merges beautiful
              visual design with cutting-edge AI to deliver a premium user experience
              across chat, voice, and productivity tools.
            </p>

            <p className="mt-4 text-slate-700 dark:text-gray-300 leading-relaxed">
              From real-time voice synthesis to adaptive chat personalities,
              RealMe AI represents the future of human-centered AI. This project is
              powered by creativity, innovation, and a commitment to building tools
              that empower millions worldwide.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
