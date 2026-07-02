"use client";

import { JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StatusPopupProps {
  status: "success" | "error" | null;
}
// popup component to show success or error message for contact form
export default function StatusPopup({
  status,
}: StatusPopupProps): JSX.Element | null {
  if (!status) return null;

  return (
    <AnimatePresence>
      {status && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
        >
          <motion.div
            initial={{ y: -30 }}
            animate={{ y: 0 }}
            exit={{ y: 30 }}
            className={`p-6 rounded-2xl shadow-lg text-center ${
              status === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            <p className="text-lg font-semibold mb-2">
              {status === "success"
                ? "Message Sent Successfully!"
                : "Failed to Send Message"}
            </p>
            <p className="text-sm opacity-80">
              {status === "success"
                ? "Thank you! We’ll get back to you soon."
                : "Please try again later."}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
