"use client";

import { Fragment, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SquarePen,
  LogOut,
  Settings,
  User,
  ArrowUpCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Transition,
} from "@headlessui/react";
import Image from "next/image";
import { useSidebarStore } from "@/app/store/useSidebarStore";
import { useChatStore } from "@/app/store/useChatStore";
import { useUserProfile } from "@/app/hooks/user/useUserProfile";
import { useTranslate } from "@/app/hooks/useTranslate";
import useModalStore from "@/app/store/modalStore";
import { useLanguageStore, type Language } from "@/app/store/useLanguageStore";
import useLogout from "@/app/hooks/auth/useLogout";
import DeleteConfirmationModal from "@/app/[locale]/components/ui/DeleteConfirmationModal";
import AccountInfoModal from "../../account/AccountInfoModal";
import { useTranslations } from "next-intl";

const LANG_OPTIONS = [
  { label: "English", shortLabel: "EN", value: "en" },
  { label: "Hausa", shortLabel: "HA", value: "ha" },
  { label: "Igbo", shortLabel: "IG", value: "ig" },
  { label: "Yoruba", shortLabel: "YO", value: "yo" },
];

export default function MiniSidebar() {
  const params = useParams();
  const router = useRouter();
  const currentLocale = params.locale as string;

  const setIsOpen = useSidebarStore((s) => s.setIsOpen);
  const setAutoFocusSearch = useSidebarStore((s) => s.setAutoFocusSearch);
  const setActiveConversationId = useChatStore(
    (s) => s.setActiveConversationId,
  );
  const setMessages = useChatStore((s) => s.setMessages);
  const triggerInputFocus = useChatStore((s) => s.triggerInputFocus);

  const { user } = useUserProfile();
  const { t } = useTranslate();
  const tRich = useTranslations();
  const { handleLogout, isLoggingOut } = useLogout();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const {
    isProfileOpen,
    openProfile,
    isAccountInfoOpen,
    openAccountInfo,
    openSettings,
    closeAll,
  } = useModalStore();

  const avatarSrc =
    typeof user?.avatar === "string" && user.avatar.trim().length > 0
      ? user.avatar.replace("http://", "https://")
      : "/avatar.png";

  const handleNewChat = () => {
    closeAll();
    setActiveConversationId(null);
    setMessages([]);
    triggerInputFocus();
  };

  const handleSearchClick = () => {
    closeAll();
    setAutoFocusSearch(true);
    setIsOpen(true);
  };

  const handleLogoClick = () => {
    closeAll();
    setIsOpen(true);
  };

  const handleLanguageChange = (value: string) => {
    useLanguageStore.getState().setLanguage(value as Language);
    const pathname = window.location.pathname;
    const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");
    const newPath = `/${value}${pathnameWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <>
      <aside
        className="
          hidden lg:flex flex-col items-center
          fixed right-0 top-0 z-40 h-full w-16
          bg-white/90 dark:bg-slate-800/95
          backdrop-blur-xl
          border-l border-slate-200 dark:border-slate-700/50
          py-4
        "
      >
        {/* Logo */}
        <button
          onClick={handleLogoClick}
          className="
            p-2 rounded-lg
            transition transform hover:scale-105
          "
        >
          <Image
            src="/logo.png"
            alt="RealMe AI"
            width={32}
            height={32}
            className="rounded-full border border-gray-300 dark:border-white/20"
          />
        </button>

        {/* New Chat */}
        <button
          onClick={handleNewChat}
          className="
            mt-6 p-2 rounded-lg
            text-slate-500 hover:text-slate-700 dark:hover:text-slate-300
            hover:bg-slate-100 dark:hover:bg-slate-700/40
            transition transform hover:scale-105
          "
        >
          <SquarePen size={18} />
        </button>

        {/* Search */}
        <button
          onClick={handleSearchClick}
          className="
            mt-3 p-2 rounded-lg
            text-slate-500 hover:text-slate-700 dark:hover:text-slate-300
            hover:bg-slate-100 dark:hover:bg-slate-700/40
            transition transform hover:scale-105
          "
        >
          <Search size={18} />
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Language Dropup */}
        <div className="mb-2">
          <Listbox value={currentLocale} onChange={handleLanguageChange}>
            <div className="relative">
              <ListboxButton
                className="
                  w-10 h-10 flex items-center justify-center
                  rounded-lg text-xs font-semibold
                  text-slate-600 dark:text-slate-300
                  hover:bg-slate-100 dark:hover:bg-slate-700/40
                  transition cursor-pointer transform hover:scale-105
                "
              >
                {LANG_OPTIONS.find((o) => o.value === currentLocale)
                  ?.shortLabel || "En"}
              </ListboxButton>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ListboxOptions
                  className="
                    absolute bottom-full right-1/2 translate-x-1/2 mb-2
                    w-15 overflow-auto rounded-md
                    bg-white dark:bg-slate-800 py-1 text-sm
                    shadow-lg ring-1 ring-black/10 dark:ring-white/20
                    focus:outline-none z-50
                  "
                >
                  {LANG_OPTIONS.map((opt) => (
                    <ListboxOption
                      key={opt.value}
                      value={opt.value}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-1.5 text-center ${
                          active
                            ? "bg-indigo-100 dark:bg-indigo-700/50 text-indigo-900 dark:text-white"
                            : "text-slate-800 dark:text-slate-100"
                        }`
                      }
                    >
                      {({ selected }) => (
                        <span
                          className={`block ${
                            selected ? "font-semibold" : "font-normal"
                          }`}
                        >
                          {opt.shortLabel}
                        </span>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Transition>
            </div>
          </Listbox>
        </div>

        {/* Avatar */}
        <button
          onClick={() => (isProfileOpen ? closeAll() : openProfile())}
          className="p-1 transition transform hover:scale-105"
        >
          <Image
            key={avatarSrc}
            src={avatarSrc}
            alt="Profile"
            width={36}
            height={36}
            unoptimized
            loading="lazy"
            className="w-9 h-9 rounded-full object-cover"
          />
        </button>
      </aside>

      {/* Profile Popover */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            <motion.div
              onClick={closeAll}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-60 bg-black/20 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="
                fixed bottom-24 right-[72px] w-56
                bg-white/60 dark:bg-slate-800/90
                backdrop-blur-xl shadow-lg rounded-xl p-2
                z-70
              "
            >
              <button
                onClick={openAccountInfo}
                className="
                  flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm
                  text-slate-700 dark:text-slate-200
                  hover:bg-indigo-100/50 dark:hover:bg-slate-700/60
                  transition
                "
              >
                <User size={16} /> {t("account_info.title")}
              </button>
              <button
                onClick={() => router.push("/pricingplans")}
                className="
                  flex items-center gap-2 w-full px-3 py-2 mt-1 rounded-md text-sm font-medium
                  text-indigo-600 dark:text-indigo-300
                  hover:bg-indigo-100/50 dark:hover:bg-slate-700/60
                  transition
                "
              >
                <ArrowUpCircle size={16} /> {t("dashboard.sidebar.upgrade")}
              </button>
              <button
                onClick={openSettings}
                className="
                  flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm
                  text-slate-700 dark:text-slate-200
                  hover:bg-indigo-100/50 dark:hover:bg-slate-700/60
                  transition
                "
              >
                <Settings size={16} /> {t("settings.title")}
              </button>
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="
                  flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-red-600
                  hover:bg-red-100/50 dark:hover:bg-red-800/60
                  transition
                "
              >
                <LogOut size={16} /> {t("dashboard.sidebar.logout")}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Account Info Modal */}
      <AccountInfoModal open={isAccountInfoOpen} close={closeAll} />

      {/* Logout Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title={t("dashboard.sidebar.logout_confirm_title")}
        message={tRich.rich("dashboard.sidebar.logout_confirm_message", {
          name: user?.fullName?.split(" ")[0] || t("dashboard.greeting.fallback_name"),
          styled: (chunks) => (
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {chunks}
            </span>
          ),
        })}
        isLoading={isLoggingOut}
      />
    </>
  );
}
