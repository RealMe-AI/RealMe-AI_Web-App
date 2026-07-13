"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { useAutoClose } from "@/app/hooks/popUp/useAutoClose";
import { useUserProfile } from "@/app/hooks/user/useUserProfile";
import { useContactSupport } from "@/app/hooks/support/useContactSupport";
import { useTranslations } from "next-intl";

import StatusPopup from "./StatusPopup";
import { Loader2 } from "lucide-react";
import LazyLoading from "../../components/ui/LazyLoading";

type FormVariant = "report_bug" | "suggest_feature";

export function ReportForm({
  variant = "report_bug",
}: {
  variant?: FormVariant;
}) {
  const { user } = useUserProfile();
  const t = useTranslations("report_form");
  const { submit, status, isLoading, setStatus } = useContactSupport();

  const [formData, setFormData] = useState({
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
    const ok = await submit(formData.subject, formData.message);
    if (ok) {
      setFormData({ subject: "", message: "" });
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
          {t(
            variant === "report_bug"
              ? "title_report_bug"
              : "title_suggest_feature",
          )}
        </motion.h3>

        <motion.p
          className="text-gray-600 max-w-md dark:text-white mb-6 px-2 mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {t(
            variant === "report_bug"
              ? "subtitle_report_bug"
              : "subtitle_suggest_feature",
          )}
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
            <div className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-100 text-left">
              {user ? user.fullName || "" : <LazyLoading />}
            </div>
            <div className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-100 text-left">
              {user ? user.email || "" : <LazyLoading />}
            </div>
          </div>

          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder={t("subject_placeholder")}
            required
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-400 outline-none"
          />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={t("message_placeholder")}
            required
            rows={5}
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-400 outline-none"
          />

          <button
            type="submit"
            className="px-6 py-3 rounded-full flex justify-center bg-indigo-300 text-gray-800 hover:bg-indigo-400 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-600 transition disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : t("send_button")}
          </button>
        </motion.form>

        {/* Popup Component */}
        <StatusPopup status={status} t={t} />
      </div>
    </section>
  );
}
