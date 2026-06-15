"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useUserStore } from "../../store/useUserStore";
import { useTranslations } from "next-intl";
import useUpdateProfile from "@/app/hooks/user/useUpdateProfile";

export default function EditProfileModal() {
  const t = useTranslations();

  const {
    editProfileName,
    setEditProfileName,
    isEditProfileOpen,
    closeEditProfile,
  } = useUserStore();
  const { updateProfile, isUpdating, error } = useUpdateProfile();

  const handleSave = async () => {
    if (!editProfileName.trim()) {
      return;
    }

    const success = await updateProfile(editProfileName);
    if (success) closeEditProfile();
  };

  return (
    <AnimatePresence>
      {isEditProfileOpen && (
        <>
          <motion.div
            onClick={closeEditProfile}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-60 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="w-[90%] max-w-md bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl relative pointer-events-auto"
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
                  value={editProfileName}
                  onChange={(e) => setEditProfileName(e.target.value)}
                  className="p-2 rounded-lg text-slate-700 dark:text-white bg-white/60 dark:bg-slate-700/60 border border-slate-300 dark:border-slate-600 focus:outline-none"
                  placeholder={t("modal.edit_profile.name_placeholder")}
                />

                {error && <p className="text-red-600 text-sm">{error}</p>}
              </div>

              <button
                onClick={handleSave}
                disabled={isUpdating}
                className={`w-full px-4 py-2 rounded-lg text-white shadow-md transition ${
                  isUpdating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isUpdating
                  ? t("modal.saving")
                  : t("modal.edit_profile.save_button")}
              </button>
            </div>
          </motion.div>
        </div>
      </>
      )}
    </AnimatePresence>
  );
}
