"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { PanelLeft } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useSidebarStore } from "../../store/useSidebarStore";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useFetchMessages } from "@/app/hooks/messages/useFetchMessages";
import useModalStore from "../../store/modalStore";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import SettingsPanel from "../setting/SettingsPanel";

export default function Page() {
  // useGoogleAuth();
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isSidebarOpen = useSidebarStore((s) => s.isOpen);
  const setIsSidebarOpen = useSidebarStore((s) => s.setIsOpen);
  const isSettingsOpen = useModalStore((s) => s.isSettingsOpen);
  const closeAll = useModalStore((s) => s.closeAll);
  const setActiveConversationId = useChatStore(
    (s) => s.setActiveConversationId,
  );
  const { fetchMessages } = useFetchMessages();

  useEffect(() => {
    if (!accessToken) {
      router.push("/auth");
    }
  }, [accessToken, router]);

  if (!accessToken) return null;

  return (
    <div className="h-screen w-full flex bg-linear-to-br from-indigo-50 via-white to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden relative">
      {/* Toggle Button */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 right-4 z-50  hover:text-slate-700 text-slate-500 shadow-lg transition"
        >
          <PanelLeft size={20} />
        </button>
      )}

      {/* Chat Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className={`flex-1 flex flex-col h-full min-h-0 transition-all duration-500 ${
          isSidebarOpen ? "mr-0 sm:mr-[360px]" : "mx-auto max-w-4xl w-full"
        } p-2 md:p-6`}
      >
        <ChatWindow />
      </motion.div>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onSelectChat={(chat) => {
          setActiveConversationId(chat.id);
          fetchMessages(chat.id);
        }}
      />

      {/* Settings Modal */}
      <SettingsPanel open={isSettingsOpen} close={closeAll} />
    </div>
  );
}
