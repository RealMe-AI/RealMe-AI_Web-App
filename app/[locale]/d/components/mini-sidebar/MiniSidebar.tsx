"use client";

import { useState, useRef } from "react";
import { Search, SquarePen, MessageCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useSidebarStore } from "@/app/store/useSidebarStore";
import { useChatStore } from "@/app/store/useChatStore";
import { useUserProfile } from "@/app/hooks/user/useUserProfile";
import { useTranslate } from "@/app/hooks/useTranslate";
import useModalStore from "@/app/store/modalStore";
import { useLanguageStore, type Language } from "@/app/store/useLanguageStore";
import useLogout from "@/app/hooks/auth/useLogout";
import { useTranslations } from "next-intl";
import DeleteConfirmationModal from "@/app/[locale]/components/ui/DeleteConfirmationModal";
import AccountInfoModal from "../../../account/AccountInfoModal";
import { NavButton } from "./NavButton";
import { LanguageSelector } from "./LanguageSelector";
import { ProfilePopover } from "./ProfilePopover";
import { ConversationsModal } from "./ConversationsModal";

export function MiniSidebar() {
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
  const [isConversationModalOpen, setIsConversationModalOpen] = useState(false);
  const [chatAnchorRect, setChatAnchorRect] = useState<DOMRect | null>(null);
  const chatBtnRef = useRef<HTMLButtonElement>(null);

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

  const toggleConversations = () => {
    closeAll();
    if (chatBtnRef.current) {
      setChatAnchorRect(chatBtnRef.current.getBoundingClientRect());
    }
    setIsConversationModalOpen((prev) => !prev);
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
        <NavButton
          tooltip={t("dashboard.sidebar.tooltips.open_sidebar")}
          onClick={handleLogoClick}
        >
          <Image
            src="/logo.png"
            alt="RealMe AI"
            width={32}
            height={32}
            className="rounded-full border border-gray-300 dark:border-white/20"
          />
        </NavButton>

        <NavButton
          tooltip={t("dashboard.sidebar.tooltips.new_chat")}
          onClick={handleNewChat}
          className="mt-6 p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/40 transition transform hover:scale-105"
        >
          <SquarePen size={18} />
        </NavButton>

        <NavButton
          tooltip={t("dashboard.sidebar.tooltips.search")}
          onClick={handleSearchClick}
        >
          <Search size={18} />
        </NavButton>

        <NavButton
          ref={chatBtnRef}
          tooltip={t("dashboard.sidebar.tooltips.chats")}
          onClick={toggleConversations}
        >
          <MessageCircle size={18} />
        </NavButton>

        <div className="flex-1" />

        <LanguageSelector
          currentLocale={currentLocale}
          onChange={handleLanguageChange}
        />

        <NavButton
          tooltip={t("dashboard.sidebar.tooltips.profile")}
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
        </NavButton>
      </aside>

      <ProfilePopover
        isOpen={isProfileOpen}
        onClose={closeAll}
        onAccountInfo={openAccountInfo}
        onUpgrade={() => router.push("/pricingplans")}
        onSettings={openSettings}
        onLogout={() => setIsLogoutModalOpen(true)}
      />

      <ConversationsModal
        isOpen={isConversationModalOpen}
        onClose={() => setIsConversationModalOpen(false)}
        anchorRect={chatAnchorRect}
      />

      <AccountInfoModal open={isAccountInfoOpen} close={closeAll} />

      <DeleteConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title={t("dashboard.sidebar.logout_confirm_title")}
        message={tRich.rich("dashboard.sidebar.logout_confirm_message", {
          name:
            user?.fullName?.split(" ")[0] ||
            t("dashboard.greeting.fallback_name"),
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
