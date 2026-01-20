"use client";

import { useState, useRef } from "react";
import ChatActionsModal from "../chatEdit/ChatActionsModal";

interface Chat {
  id: number;
  title: string;
}

interface SidebarItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
}

export default function SidebarItem({
  chat,
  isActive,
  onClick,
}: SidebarItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleAction = (action: string) => {
    console.log(`${action} triggered for chat ${chat.id}`);
    alert(`${action} coming soon!`);
    setIsMenuOpen(false);
  };

  return (
    <div
      className={`relative w-75 flex items-center justify-between p-3 rounded-xl cursor-pointer transition group ${
        isActive
          ? "bg-indigo-500 text-white"
          : "text-slate-700 dark:text-white bg-slate-100 dark:bg-slate-700/40 hover:bg-white/60 dark:hover:bg-slate-600/50"
      }`}
      onClick={onClick}
    >
      {/* Chat info */}
      <div className="flex flex-col overflow-hidden">
        <p className="text-sm font-medium truncate">{chat.title}</p>
      </div>

      {/* Action button */}
      <button
        ref={buttonRef}
        className={`ml-2 dark:text-slate-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 text-lg leading-none ${
          isActive ? "text-slate-300" : "text-slate-600"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          const rect = buttonRef.current?.getBoundingClientRect();
          if (rect) {
            const spaceBelow = window.innerHeight - rect.bottom;
            setOpenUpwards(spaceBelow < 280);
          }
          setIsMenuOpen(true);
        }}
      >
        ...
      </button>

      {/* Popover Menu */}
      {isMenuOpen && (
        <div className="contents" onClick={(e) => e.stopPropagation()}>
          <ChatActionsModal
            isOpen={true}
            onClose={() => setIsMenuOpen(false)}
            chatId={chat.id}
            onShare={() => handleAction("Share")}
            onRename={() => handleAction("Rename")}
            onPin={() => handleAction("Pin")}
            onDelete={() => handleAction("Delete")}
            className={`absolute right-8 z-50 w-40 shadow-xl border border-slate-200 dark:border-slate-700 ${
              openUpwards ? "bottom-8" : "top-8"
            }`}
          />
        </div>
      )}
    </div>
  );
}
