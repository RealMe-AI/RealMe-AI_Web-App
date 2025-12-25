"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share, Edit2, Pin, Trash2 } from "lucide-react";

interface ChatActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  onShare?: () => void;
  chatId?: number;
  onRename?: () => void;
  onPin?: () => void;
  onDelete?: () => void;
  triggerRef?: React.RefObject<any>;
}

export default function ChatActionsModal({
  isOpen,
  onClose,
  className,
  onShare,
  onRename,
  onPin,
  onDelete,
  triggerRef,
}: ChatActionsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [openUpwards, setOpenUpwards] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useLayoutEffect(() => {
    // If triggerRef is provided, use it. Otherwise, fallback to parentElement (legacy behavior if needed, or just return)
    const triggerEl = triggerRef?.current || modalRef.current?.parentElement;

    if (!isOpen || !triggerEl) return;

    const triggerRect = triggerEl.getBoundingClientRect();
    const menuHeight = 160;
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const shouldOpenUpwards = spaceBelow < menuHeight;

    setOpenUpwards(shouldOpenUpwards);
    setPosition({
      top: shouldOpenUpwards
        ? triggerRect.top - menuHeight - 8
        : triggerRect.bottom + 8,
      left: triggerRect.right - 192,
    });
  }, [isOpen, triggerRef]);

  const handleItemClick = (action?: () => void) => {
    action?.();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && position && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/10 dark:bg-black/30"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: openUpwards ? 8 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: openUpwards ? 8 : -8 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            style={{
              top: position.top,
              left: position.left,
            }}
            className={`
              fixed z-50 w-48
              bg-white dark:bg-slate-800
              shadow-xl rounded-lg
              border border-slate-200 dark:border-slate-700
              overflow-hidden
              ${className || ""}
            `}
          >
            <ul className="flex flex-col">
              <li
                onClick={() => handleItemClick(onShare)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                <Share size={16} /> <span>Share</span>
              </li>

              <li
                onClick={() => handleItemClick(onRename)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                <Edit2 size={16} /> <span>Rename</span>
              </li>

              <li
                onClick={() => handleItemClick(onPin)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                <Pin size={16} /> <span>Pin</span>
              </li>

              <li
                onClick={() => handleItemClick(onDelete)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 dark:hover:bg-red-700 text-red-600 dark:text-red-400 cursor-pointer"
              >
                <Trash2 size={16} /> <span>Delete</span>
              </li>
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
