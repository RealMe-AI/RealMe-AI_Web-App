"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CircleHelp, Settings, User, ShieldCheck, Mic } from "lucide-react";
import { useSettings } from "../../hooks/useSettings";
import { useUserStore } from "../../store/useUserStore";
import { useTranslations } from "next-intl";
import useDeleteAccount from "@/app/hooks/user/useDeleteAccount";
import DeleteConfirmationModal from "@/app/[locale]/components/ui/DeleteConfirmationModal";

import EditProfileModal from "./EditProfileModal";

import {SettingsSidebar} from "./components/SettingsSidebar";
import {SettingsMobileTabs} from "./components/SettingsMobileTabs";
import {AccountTab} from "./components/AccountTab";
import {PreferencesTab} from "./components/PreferencesTab";
import {SecurityTab} from "./components/SecurityTab";
import {VoiceTab} from "./components/VoiceTab";
import {SupportTab} from "./components/SupportTab";

interface SettingsPanelProps {
  open: boolean;
  close: () => void;
}

type TabId = 'account' | 'preferences' | 'security' | 'voice' | 'support';

export default function SettingsPanel({ open, close }: SettingsPanelProps) {
  const t = useTranslations();

  const { notifications, setNotifications } = useSettings();
  const user = useUserStore((s) => s.user);
  const openEditProfile = useUserStore((s) => s.openEditProfile);
  const { handleDeleteAccount, isDeleting } = useDeleteAccount();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<TabId>('account');

  const tabs = [
    { id: 'account' as TabId, label: t("settings.account.label"), icon: User },
    { id: 'preferences' as TabId, label: t("settings.preferences.label"), icon: Settings },
    { id: 'security' as TabId, label: t("settings.security.label"), icon: ShieldCheck },
    { id: 'voice' as TabId, label: t("settings.voice.label"), icon: Mic },
    { id: 'support' as TabId, label: t("settings.support.label"), icon: CircleHelp },
  ];

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
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4 sm:p-6">
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-4xl h-[85vh] sm:h-[80vh] flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden pointer-events-auto"
            >
              <SettingsSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={tabs}
              />
              <SettingsMobileTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={tabs}
              />

              <button
                onClick={close}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition z-10"
              >
                <X size={20} />
              </button>

              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white dark:bg-slate-800/50">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/50">
                    {tabs.find(t => t.id === activeTab)?.label}
                  </h3>

                  <div className="flex flex-col gap-6">
                    {activeTab === 'account' && (
                      <AccountTab
                        user={user}
                        openEditProfile={openEditProfile}
                        setIsDeleteModalOpen={setIsDeleteModalOpen}
                        t={t}
                      />
                    )}

                    {activeTab === 'preferences' && (
                      <PreferencesTab
                        notifications={notifications}
                        setNotifications={setNotifications}
                        t={t}
                      />
                    )}

                    {activeTab === 'security' && (
                      <SecurityTab
                        t={t}
                        close={close}
                      />
                    )}

                    {activeTab === 'voice' && (
                      <VoiceTab />
                    )}

                    {activeTab === 'support' && (
                      <SupportTab
                        t={t}
                        close={close}
                      />
                    )}
                  </div>
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