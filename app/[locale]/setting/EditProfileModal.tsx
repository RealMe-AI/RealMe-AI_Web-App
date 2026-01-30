"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useUserStore } from "../../zustand/useUserStore";
import { useTranslations } from "next-intl";
import { baseUrl } from "@/app/lib/baseUrl";

interface UpdateProfileResponse {
  name?: string;
  picture?: string;
  preferences?: {
    theme?: string;
    language?: string;
    aiModel?: string;
  };
  message?: string;
}

export default function EditProfileModal() {
  const t = useTranslations();

  const { user, setUser, isEditProfileOpen, closeEditProfile } = useUserStore();
  const [fullName, setFullName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (user?.fullName) setFullName(user.fullName);
  }, [user]);

  const handleSave = async () => {
    if (!fullName.trim()) {
      setError(t("modal_edit_profile.error_empty_name"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("accessToken");

      const res = await fetch(`${baseUrl}/users/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ name: fullName }),
      });

      const data: UpdateProfileResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.message || t("modal_edit.no_data.success"));
      }

      // Update store with the returned name or the one we sent
      setUser({ fullName: data.name || fullName });
      closeEditProfile();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(t("modal_edit.no_data.success"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isEditProfileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="w-[90%] max-w-md bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl relative"
          >
            <button
              onClick={closeEditProfile}
              className="absolute top-3 right-3 text-slate-600 hover:text-slate-800 dark:hover:text-slate-300"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
              {t("modal.edit_profile.title")}
            </h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-slate-600 dark:text-slate-300">
                  {t("account_info.full_name")}
                </label>

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="p-2 rounded-lg text-slate-700 dark:text-white bg-white/60 dark:bg-slate-700/60 border border-slate-300 dark:border-slate-600 focus:outline-none"
                  placeholder={t("modal.edit_profile.name_placeholder")}
                />

                {error && <p className="text-red-600 text-sm">{error}</p>}
              </div>

              <button
                onClick={handleSave}
                disabled={loading}
                className={`w-full px-4 py-2 rounded-lg text-white shadow-md transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading
                  ? t("modal.saving")
                  : t("modal.edit_profile.save_button")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
