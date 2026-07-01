"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { useAutoClose } from "@/app/hooks/popUp/useAutoClose";
import { baseUrl } from "@/app/lib/baseUrl";

import StatusPopup from "./StatusPopup";

type FormVariant = "report_bug" | "suggest_feature";

export function ReportForm({
  variant = "report_bug",
}: {
  variant?: FormVariant;
}) {
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  const [formData, setFormData] = useState({
    from_name: "",
    from_email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to send");
      setStatus("success");
      setFormData({ from_name: "", from_email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  //  Automatically closes popup after 3s
  useAutoClose(status, () => setStatus(null));

  return (
    <section
      id="Report-Form"
      className="min-h-screen flex flex-col justify-center bg-linear-to-br from-indigo-100 via-white to-indigo-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-colors duration-900"
    >
      <div className="w-full max-w-3xl mx-auto text-center relative">
        <motion.h3
          className="text-2xl font-semibold my-4 dark:text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {variant === "report_bug" ? "Report an Issue" : "Suggest a Feature"}
        </motion.h3>

        <motion.p
          className="text-gray-600 max-w-md dark:text-white mb-6 px-2 mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {variant === "report_bug"
            ? "Found something broken? Tell us what happened and we'll fix it."
            : "Have an idea that would make RealMe AI better? We'd love to hear it."}
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col gap-4 mb-5 lg:mb-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="from_name"
              value={formData.from_name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-400 outline-none"
            />
            <input
              type="email"
              name="from_email"
              value={formData.from_email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-400 outline-none"
            />
          </div>

          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject"
            required
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-400 outline-none"
          />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            required
            rows={5}
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-400 outline-none"
          />

          <button
            type="submit"
            // disabled={loading}
            className="px-6 py-3 rounded-full bg-indigo-300 text-gray-800 hover:bg-indigo-400 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-600 transition disabled:opacity-50"
          >
            {/* {loading ? "Sending..." : "Send Message"} */}
            Send Message
          </button>
        </motion.form>

        {/* Popup Component */}
        <StatusPopup status={status} />
      </div>
    </section>
  );
}
