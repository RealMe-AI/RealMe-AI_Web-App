"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share, Edit2, Pin, Trash2 } from "lucide-react";

interface ChatActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  onShare?: () => void;
  onRename?: () => void;
  onPin?: () => void;
  onDelete?: () => void;
}

export default function ChatActionsModal({
  isOpen,
  onClose,
  className,
  onShare,
  onRename,
  onPin,
  onDelete,
}: ChatActionsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [openUpwards, setOpenUpwards] = useState(false);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const rect = modalRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // If not enough space below, flip upwards
    setOpenUpwards(spaceBelow < 160 && spaceAbove > spaceBelow);
  }, [isOpen]);

  const handleItemClick = (action?: () => void) => {
    action?.();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            initial={{ opacity: 0, y: openUpwards ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: openUpwards ? 10 : -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`
              absolute right-8 z-50 w-48
              ${openUpwards ? "bottom-full mb-2" : "top-full mt-2"}
              bg-white dark:bg-slate-800
              shadow-lg rounded-lg
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
