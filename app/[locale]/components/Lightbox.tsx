"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLightboxStore } from "@/app/store/useLightboxStore";

export default function Lightbox() {
  const src = useLightboxStore((s) => s.src);
  const close = useLightboxStore((s) => s.close);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (src) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [src, close]);

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 cursor-zoom-out"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-6 right-7 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl leading-none transition"
          >
            ×
          </button>

          <Image
            src={src}
            alt=""
            width={0}
            height={0}
            unoptimized
            objectFit="contain"
            sizes="40vw"
            onClick={(e) => e.stopPropagation()}
            className="max-w-[80vw] max-h-[80vh] sm:max-w-[40vw] sm:max-h-[50vh] w-auto h-auto rounded-xl cursor-auto"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
