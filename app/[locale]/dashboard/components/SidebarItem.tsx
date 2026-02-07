"use client";

import { useState, useRef, useEffect } from "react";
import ChatActionsModal from "../chatEdit/ChatActionsModal";
import { useChatActionsModal } from "../chatEdit/useChatActionsModal";
import DeleteConfirmationModal from "../chatEdit/DeleteConfirmationModal";
// import { Check, X as XIcon } from "lucide-react";

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

  // Rename state
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(chat.title);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { handleDelete, handleRename, isLoading } = useChatActionsModal();

  // Focus input when renaming starts
  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const onRenameSubmit = async () => {
    if (!renameValue.trim() || renameValue.trim() === chat.title) {
      setIsRenaming(false);
      return;
    }
    await handleRename(chat.id, renameValue.trim());
    setIsRenaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onRenameSubmit();
    } else if (e.key === "Escape") {
      setIsRenaming(false);
      setRenameValue(chat.title);
    }
  };

  const handleConfirmDelete = async () => {
    await handleDelete(chat.id);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div
        className={`relative w-70 max-sm:w-full flex items-center justify-between p-3 rounded-xl cursor-pointer transition group ${
          isActive
            ? "bg-slate-100 dark:bg-slate-700/40 text-slate-700 dark:text-white"
            : "text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700/40"
        } ${
          isRenaming ? "ring-2 ring-indigo-400 bg-white dark:bg-slate-800" : ""
        }`}
        onClick={() => {
          if (!isRenaming) onClick();
        }}
      >
        {/* Chat info / Rename Input */}
        <div className="flex-1 flex flex-col overflow-hidden mr-2">
          {isRenaming ? (
            <div
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                ref={inputRef}
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={onRenameSubmit}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-0 p-0 text-sm font-medium focus:ring-0 text-slate-900 dark:text-white"
              />
            </div>
          ) : (
            <p className="text-sm font-medium truncate">{chat.title}</p>
          )}
        </div>

        {/* Action button - Hide when renaming */}
        {!isRenaming && (
          <button
            ref={buttonRef}
            className={"dark:text-slate-300 text-slate-600 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 text-lg font-bold leading-none "}
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
        )}

        {/* Popover Menu */}
        {isMenuOpen && (
          <div className="contents" onClick={(e) => e.stopPropagation()}>
            <ChatActionsModal
              isOpen={true}
              onClose={() => setIsMenuOpen(false)}
              chatId={chat.id}
              // Pass handlers to override default behavior
              onRename={() => {
                setRenameValue(chat.title);
                setIsRenaming(true);
              }}
              onDelete={() => setIsDeleteModalOpen(true)}
              className={`absolute right-8 z-50 w-40 shadow-xl border border-slate-200 dark:border-slate-700 ${
                openUpwards ? "bottom-8" : "top-8"
              }`}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={chat.title}
        isLoading={isLoading}
      />
    </>
  );
}
