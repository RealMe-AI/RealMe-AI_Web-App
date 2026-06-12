import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share, Pencil, Pin, Trash2 } from "lucide-react";
import { useChatActionsModal } from "./useChatActionsModal";

interface ChatActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: number;
  className?: string;
  onShare?: () => void;
  onRename?: () => void;
  onPin?: () => void;
  onDelete?: () => void;
}

const ChatActionsModal: FC<ChatActionsModalProps> = ({
  isOpen,
  onClose,
  className,
  onShare,
  onRename,
  onPin,
  onDelete,
  chatId,
}) => {
  const {
    handleDelete: defaultDelete,
    handleRename: defaultRename,
    handleShare: defaultShare,
    handlePin: defaultPin,
  } = useChatActionsModal();

  const handleItemClick = (
    action?: () => void,
    defaultAction?: (id: number) => void
  ) => {
    if (action) {
      action();
    } else if (defaultAction) {
      defaultAction(chatId);
    }
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`z-50 w-48 bg-white dark:bg-slate-800 shadow-lg rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden ${
              className || ""
            }`}
          >
            <ul className="flex flex-col">
              {/* Share */}
              <li
                onClick={() => handleItemClick(onShare, defaultShare)}
                className="flex items-center gap-2 px-4 py-2 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition"
              >
                <Share size={16} />
                <span>Share</span>
              </li>

              {/* Rename */}
              <li
                onClick={() => handleItemClick(onRename, defaultRename)}
                className="flex items-center gap-2 px-4 py-2 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition"
              >
                <Pencil size={16} />
                <span>Rename</span>
              </li>

              {/* Pin */}
              <li
                onClick={() => handleItemClick(onPin, defaultPin)}
                className="flex items-center gap-2 px-4 py-2 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition"
              >
                <Pin size={16} />
                <span>Pin</span>
              </li>

              {/* Delete */}
              <li
                onClick={() => handleItemClick(onDelete, defaultDelete)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 dark:hover:bg-red-800/20 text-red-600 dark:text-red-400 cursor-pointer transition"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </li>
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatActionsModal;
