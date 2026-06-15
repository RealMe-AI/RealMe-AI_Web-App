"use client";
import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  isLoading?: boolean;
}

const DeleteConfirmationModal: FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
}) => {
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
            className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-70 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm pointer-events-auto border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4 text-red-600 dark:text-red-500">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <AlertTriangle size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {title}
                  </h3>
                </div>

                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  {message || (
                    <>
                      This will permanently delete{" "}
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {title}
                      </span>
                      . This action cannot be undone.
                    </>
                  )}
                </p>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition shadow-sm disabled:opacity-50 flex items-center justify-center min-w-[80px]"
                  >
                    {isLoading ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
