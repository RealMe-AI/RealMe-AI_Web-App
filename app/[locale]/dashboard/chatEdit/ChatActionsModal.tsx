"use client";

import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share, Edit2, Pin, Trash2 } from "lucide-react";

interface ChatActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: number;
  className?: string;

  // Optional callbacks for parent sync
  onDeleted?: (chatId: number) => void;
  onRenamed?: (chatId: number, newTitle: string) => void;
}

const ChatActionsModal: FC<ChatActionsModalProps> = ({
  isOpen,
  onClose,
  chatId,
  className,
  onDeleted,
  onRenamed,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  /* -------------------- ACTION LOGIC -------------------- */

  const deleteConversation = async () => {
    try {
      setIsLoading(true);

      const res = await fetch(`/conversations/${chatId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete conversation");
      }

      onDeleted?.(chatId);
      onClose();
    } catch (err) {
      console.error(err);
      // later: toast / error UI
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder logic – endpoint coming soon
  const renameConversation = async () => {
    try {
      setIsLoading(true);

      // TEMP: prompt-based rename until endpoint exists
      const newTitle = prompt("Enter new chat name");
      if (!newTitle) return;

      /**
       * FUTURE ENDPOINT EXAMPLE
       * await fetch(`/conversations/${chatId}`, {
       *   method: "PATCH",
       *   headers: { "Content-Type": "application/json" },
       *   body: JSON.stringify({ title: newTitle }),
       * });
       */

      onRenamed?.(chatId, newTitle);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------- UI -------------------- */

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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`z-50 w-48 bg-white dark:bg-slate-800 shadow-lg 
                        rounded-lg border border-slate-200 dark:border-slate-700 
                        overflow-hidden ${className || ""}`}
          >
            <ul className="flex flex-col text-sm">
              {/* Share (UI only for now) */}
              <li className="flex items-center gap-2 px-4 py-2 text-slate-400 cursor-not-allowed">
                <Share size={16} />
                <span>Share</span>
              </li>

              {/* Rename */}
              <li
                onClick={renameConversation}
                className="flex items-center gap-2 px-4 py-2
                           text-slate-900 dark:text-white
                           hover:bg-slate-100 dark:hover:bg-slate-700
                           cursor-pointer transition disabled:opacity-50"
              >
                <Edit2 size={16} />
                <span>Rename</span>
              </li>

              {/* Pin (future) */}
              <li className="flex items-center gap-2 px-4 py-2 text-slate-400 cursor-not-allowed">
                <Pin size={16} />
                <span>Pin</span>
              </li>

              {/* Delete */}
              <li
                onClick={deleteConversation}
                className="flex items-center gap-2 px-4 py-2
                           text-red-600 dark:text-red-400
                           hover:bg-red-100 dark:hover:bg-red-700/40
                           cursor-pointer transition"
              >
                <Trash2 size={16} />
                <span>{isLoading ? "Deleting..." : "Delete"}</span>
              </li>
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatActionsModal;
