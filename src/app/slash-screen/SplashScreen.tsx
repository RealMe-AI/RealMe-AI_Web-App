"use client";
import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({
  visible,
  onFinish,
}: {
  visible: boolean;
  onFinish: () => void;
}) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => onFinish(), 3000); // 3 seconds
    return () => clearTimeout(t);
  }, [visible, onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-600"
        >
          <motion.div
            aria-hidden
            className="flex flex-col items-center gap-6"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Replace /logo.png later */}
            <div className="w-32 h-32">
              <Image
                src="/logo.png"
                alt="RealMe AI Logo"
                width={128}
                height={128}
                className="mx-auto"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
