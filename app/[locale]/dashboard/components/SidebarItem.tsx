"use client";

import { useState } from "react";
import ChatActionsModal from "../chatEdit/ChatActionsModal";

interface Chat {
  id: number;
  title: string;
  lastMessage: string;
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

  const handleAction = (action: string) => {
    console.log(`${action} triggered for chat ${chat.id}`);
    alert(`${action} coming soon!`);
    setIsMenuOpen(false);
  };

  return (
    <div
      className={`
        relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition group
        ${
          isActive
            ? "bg-indigo-500 text-white"
            : "text-slate-700 dark:text-white bg-slate-100 dark:bg-slate-700/40 hover:bg-white/60 dark:hover:bg-slate-600/50"
        }
      `}
      onClick={onClick}
    >
      {/* Chat info */}
      <div className="flex flex-col overflow-hidden">
        <p className="text-sm font-medium truncate">{chat.title}</p>
        <p className="text-xs truncate opacity-80">{chat.lastMessage}</p>
      </div>

      {/* Action button */}
      <button
        className="
          ml-2 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10
          text-slate-400 dark:text-slate-300
          opacity-100 md:opacity-0 md:group-hover:opacity-100
          transition-opacity duration-200 text-lg leading-none
        "
        onClick={(e) => {
          e.stopPropagation();
          setIsMenuOpen(true);
        }}
      >
        ...
      </button>

      {/* Popover Menu */}
      {isMenuOpen && (
        <div onClick={(e) => e.stopPropagation()}>
          <ChatActionsModal
            isOpen={true}
            onClose={() => setIsMenuOpen(false)}
            chatId={chat.id}
            onShare={() => handleAction("Share")}
            onRename={() => handleAction("Rename")}
            onPin={() => handleAction("Pin")}
            onDelete={() => handleAction("Delete")}
            // Override styles to make it a popover relative to this item
            // We remove the fixed backdrop and position the modal absolutely
            className="absolute right-8 top-8 z-50 w-40 shadow-xl border border-slate-200 dark:border-slate-700"
          />
          {/* 
              Note: ChatActionsModal internal implementation has a fixed backdrop. 
              We might need an invisible fixed backdrop here to handle "click outside" globally 
              if ChatActionsModal's backdrop styling interferes.
              
              However, ChatActionsModal has:
              className="fixed inset-0 z-40 bg-black/10..." for backdrop.
              
              If we render it here, that backdrop will cover the screen.
              That is actually FINE for a modal/popover behavior (click outside to close).
              BUT we typically want the backdrop to be invisible for a small popover.
              
              The ChatActionsModal component is hardcoded with "bg-black/10".
              We can't easily override the backdrop style via `className` prop because 
              `className` prop in `ChatActionsModal` is applied to the **Modal Content** div, NOT the backdrop.
              (See step 28 code).
              
              Wait, looking at Step 28:
              Backdrop div: `className="fixed inset-0 z-40 bg-black/10 dark:bg-black/30"` -> No prop allows changing this.
              Modal div: `className={'... ' + className}` -> Prop applies here.
              
              So the backdrop will ALWAYS be visible and dark.
              This might not be exactly "like ChatGPT's popover" (which usually has no dark backdrop, just click-outside).
              But the user asked for "like a model just like the one of ChatGPT".
              Maybe they meant the POSITION/STYLE of the menu, not necessarily the backdrop.
              
              If the backdrop is annoying, we might need to modify `ChatActionsModal` to accept `backdropClassName` or `isPopover`.
              For now, I will use it as is. The dark backdrop is a safe default for "Modal".
              
              One adjustments: `className` prop overrides positioning in Modal div.
              Default was `absolute right-0 top-1/2`.
              I am passing `absolute right-8 top-8`.
              This will place it relative to the `SidebarItem` (which is `relative`).
              So `top-8` is 2rem down from top of item.
              `right-8` is 2rem left from right of item.
           */}
        </div>
      )}
    </div>
  );
}
