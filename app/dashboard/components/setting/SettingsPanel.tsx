"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, Bell, Trash2, Edit2 } from "lucide-react";
import { useSettings } from "../../../hooks/useSettings";
import { useUserStore } from "../../../zustand/useUserStore";
import { useThemeStore } from "../../../zustand/useThemeStore"; 
import EditProfileModal from "./EditProfileModal";
import CustomSelect from "./CustomSelect";

interface SettingsPanelProps {
  open: boolean;
  close: () => void;
}

export default function SettingsPanel({ open, close }: SettingsPanelProps) {
  const {
    theme,
    setTheme,
    language,
    setLanguage,
    notifications,
    setNotifications,
  } = useSettings();

  const applyTheme = useThemeStore((s) => s.setTheme); 
  const openEditProfile = useUserStore((s) => s.openEditProfile);

  // Handle theme change (sync both)
  const handleThemeChange = (selected: "light" | "dark" | "system") => {
    // Save preference
    setTheme(selected);

    // Apply real theme globally
    if (selected === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyTheme(prefersDark ? "dark" : "light");
    } else {
      applyTheme(selected);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative w-[95%] max-w-2xl bg-white/70 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={close}
                className="absolute top-3 right-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Settings
              </h2>

              {/* Account */}
              <Section title="Account Settings">
                <button
                  onClick={openEditProfile}
                  className="flex items-center gap-2 p-2 rounded-lg w-full hover:bg-indigo-100/50 dark:hover:bg-slate-700/60 transition"
                >
                  <Edit2 size={16} /> Edit Profile
                </button>
              </Section>

              {/* Preferences */}
              <Section title="Preferences">
                <CustomSelect
                  label="Theme Mode"
                  options={[
                    { label: "Light", value: "light" },
                    { label: "Dark", value: "dark" },
                    { label: "System", value: "system" },
                  ]}
                  value={theme}
                  onChange={(v) => handleThemeChange(v as "light" | "dark" | "system")} 
                  icon={<Globe size={16} />}
                />

                <CustomSelect
                  label="Language"
                  options={[
                    { label: "English", value: "en" },
                    { label: "Hausa", value: "ha" },
                    { label: "Igbo", value: "ig" },
                    { label: "Yoruba", value: "yo" },
                  ]}
                  value={language}
                  onChange={setLanguage}
                  icon={<Globe size={16} />}
                />

                <Toggle
                  label="Email Notifications"
                  enabled={notifications.email}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      email: !notifications.email,
                    })
                  }
                  icon={<Bell size={16} />}
                />
              </Section>

              {/* Support */}
              <Section title="Support & Help">
                <button className="flex items-center gap-2 p-2 rounded-lg w-full hover:bg-indigo-100/50 dark:hover:bg-slate-700/60 transition">
                  <Globe size={16} /> Contact Support
                </button>
                <button className="flex items-center gap-2 p-2 rounded-lg w-full hover:bg-indigo-100/50 dark:hover:bg-slate-700/60 transition">
                  <Globe size={16} /> FAQs / Help Center
                </button>
              </Section>

              {/* Danger */}
              <Section title="Danger Zone">
                <button className="flex items-center gap-2 p-2 rounded-lg w-full text-red-600 hover:bg-red-100/50 dark:hover:bg-red-800/60 transition">
                  <Trash2 size={16} /> Delete Account
                </button>
              </Section>
            </motion.div>
          </motion.div>

          <EditProfileModal />
        </>
      )}
    </AnimatePresence>
  );
}

// ----------------------------------------------------------------------
// Reusable UI Components
// ----------------------------------------------------------------------

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

function Toggle({
  label,
  enabled,
  onChange,
  icon,
}: {
  label: string;
  enabled: boolean;
  onChange: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <div
      onClick={onChange}
      className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-indigo-100/50 dark:hover:bg-slate-700/60 transition"
    >
      <div className="flex items-center gap-2">
        {icon} <span>{label}</span>
      </div>
      <div
        className={`w-10 h-5 rounded-full p-0.5 flex items-center transition-colors ${
          enabled ? "bg-indigo-600" : "bg-slate-400"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>
    </div>
  );
}
