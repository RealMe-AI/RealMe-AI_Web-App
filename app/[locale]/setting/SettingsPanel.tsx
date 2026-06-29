"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Pencil, MoonStar, Info, CircleHelp } from "lucide-react";
import { useSettings } from "../../hooks/useSettings";
import { useUserStore } from "../../store/useUserStore";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import useDeleteAccount from "@/app/hooks/user/useDeleteAccount";
import DeleteConfirmationModal from "@/app/[locale]/components/ui/DeleteConfirmationModal";

import ThemeSelect from "./ThemeSelect";
import EditProfileModal from "./EditProfileModal";
import EmailToggle from "./EmailToggle";
import VoiceSettings from "./VoiceSettings";

interface SettingsPanelProps {
  open: boolean;
  close: () => void;
}

export default function SettingsPanel({ open, close }: SettingsPanelProps) {
  const t = useTranslations();

  const { notifications, setNotifications } = useSettings();

  const openEditProfile = useUserStore((s) => s.openEditProfile);
  const { handleDeleteAccount, isDeleting } = useDeleteAccount();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-sm bg-white/70 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 overflow-y-auto pointer-events-auto"
            >
              <button
                onClick={close}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition z-10"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">
                {t("settings.title")}
              </h2>

              <div className="grid grid-cols-1 gap-6">
                {/* Left Column */}
                <div className="flex flex-col gap-6">
                  {/* Account */}
                  <Section title={t("settings.account.label")}>
                    <button
                      onClick={openEditProfile}
                      className="flex items-center gap-2 p-2 rounded-lg w-full text-slate-800 dark:text-slate-100 hover:bg-indigo-100/50 dark:hover:bg-slate-700/60 transition"
                    >
                      <Pencil size={16} /> {t("settings.account.sync")}
                    </button>
                  </Section>

                  {/* Voice */}
                  <VoiceSettings />
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6">
                  {/* Preferences */}
                  <Section title={t("settings.preferences.label")}>
                    <span className="flex items-center gap-2 px-2 rounded-lg w-full text-slate-800 dark:text-slate-100">
                      <MoonStar size={16} />
                      {t("settings.theme.label")}:
                      <ThemeSelect />
                    </span>

                    <EmailToggle
                      enabled={notifications.email}
                      onToggle={() =>
                        setNotifications({
                          ...notifications,
                          email: !notifications.email,
                        })
                      }
                      className="text-slate-800 dark:text-slate-100"
                    />
                  </Section>

                  {/* Support */}
                  <Section title={t("settings.support.label")}>
                    <Link
                      href={"/help"}
                      className="flex items-center gap-2 p-2 rounded-lg w-full text-slate-800 dark:text-slate-100"
                    >
                      <CircleHelp size={16} /> {t("settings.support.contact")}
                    </Link>

                    <Link
                      href={"/about"}
                      className="flex items-center gap-2 p-2 rounded-lg w-full text-slate-800 dark:text-slate-100"
                    >
                      <Info size={16} /> {t("navbar.about")}
                    </Link>
                  </Section>

                  {/* Danger */}
                  <Section title={t("settings.danger_zone.label")}>
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="flex items-center gap-2 p-2 rounded-lg w-full text-red-600 hover:bg-red-100/50 dark:hover:bg-red-800/20 transition"
                    >
                      <Trash2 size={16} /> {t("settings.delete_account")}
                    </button>
                  </Section>
                </div>
              </div>
            </motion.div>
          </div>

          <EditProfileModal />

          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteAccount}
            title={t("settings.delete_account_title")}
            message={t("settings.delete_account_message")}
            isLoading={isDeleting}
          />
        </>
      )}
    </AnimatePresence>
  );
}

// Reusable Section Component
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
        {title}
      </h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
