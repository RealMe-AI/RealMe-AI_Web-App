"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, Bell, Trash2, Edit2, } from "lucide-react";

// Types
interface SettingsPanelProps {
  open: boolean;
  close: () => void;
}

// Mocked user data for now; replace with your session/auth data
interface UserData {
  fullName: string;
  username: string;
  email: string;
  provider: "Google" | "Email" | "Phone";
  avatar?: string;
}

export default function SettingsPanel({ open, close }: SettingsPanelProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [language, setLanguage] = useState<string>("en");
  const [notifications, setNotifications] = useState({
    email: true,
  });

  // Simulate fetching user data dynamically
  useEffect(() => {
    const timeout = setTimeout(() => {
      setUser({
        fullName: "Owens Chikere",
        username: "@owensvisuels",
        email: "owensvisuels@gmail.com",
        provider: "Google",
        avatar: "/avatar.png",
      });
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  // Persist preferences (simulate localStorage or backend)
  useEffect(() => {
    localStorage.setItem("user-theme", theme);
    localStorage.setItem("user-language", language);
    localStorage.setItem("user-notifications", JSON.stringify(notifications));
  }, [theme, language, notifications]);

  return (
    <AnimatePresence>
      {open && (
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
            className="relative w-[95%] max-w-2xl bg-white/70 dark:bg-slate-800/80 
                       backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 overflow-y-auto max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={close}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Settings
            </h2>

            {/* 1. Account Settings */}
            <Section title="Account Settings">
              <button className="flex items-center gap-2 p-2 rounded-lg w-full hover:bg-indigo-100/50 dark:hover:bg-slate-700/60 transition">
                <Edit2 size={16} /> Edit Profile
              </button>
            </Section>

            {/* 2. Preferences */}
            <Section title="Preferences">
              {/* Theme Mode */}
              <Select
                label="Theme Mode"
                options={[
                  { label: "Light", value: "light" },
                  { label: "Dark", value: "dark" },
                  { label: "System", value: "system" },
                ]}
                value={theme}
                onChange={(v) => setTheme(v as "light" | "dark" | "system")}
                icon={<Globe size={16} />}
              />

              {/* Language */}
              <Select
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

              {/* Notifications */}
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

            {/* 5. Support & Help */}
            <Section title="Support & Help">
              <button className="flex items-center gap-2 p-2 rounded-lg w-full hover:bg-indigo-100/50 dark:hover:bg-slate-700/60 transition">
                <Globe size={16} /> Contact Support
              </button>
              <button className="flex items-center gap-2 p-2 rounded-lg w-full hover:bg-indigo-100/50 dark:hover:bg-slate-700/60 transition">
                <Globe size={16} /> FAQs / Help Center
              </button>
            </Section>

            {/* 6. Danger Zone */}
            <Section title="Danger Zone">
              <button className="flex items-center gap-2 p-2 rounded-lg w-full text-red-600 hover:bg-red-100/50 dark:hover:bg-red-800/60 transition">
                <Trash2 size={16} /> Delete Account
              </button>
            </Section>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Section Wrapper */
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

/* Toggle Component */
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

/* Select Component */
function Select({
  label,
  options,
  value,
  onChange,
  icon,
}: {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-indigo-100/50 dark:hover:bg-slate-700/60 transition">
      <div className="flex items-center gap-2">
        {icon} <span>{label}</span>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-none focus:ring-0 text-slate-800 dark:text-slate-100 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
