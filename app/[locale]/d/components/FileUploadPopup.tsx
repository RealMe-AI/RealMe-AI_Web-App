"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Upload, File } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/app/lib/utils";
import { MAX_IMAGE_ATTACHMENTS } from "@/app/lib/constants";

interface FileUploadPopupProps {
  close: () => void;
  onFileSelected: (file: File) => void;
  imagesAtLimit?: boolean;
  imageCount?: number;
  hoursRemaining?: number;
  // TEMP: remove with useSingleAttachmentGuard
  attachmentCount?: number;
}

export default function FileUploadPopup({
  close,
  onFileSelected,
  imagesAtLimit = false,
  imageCount = 0,
  hoursRemaining = 0,
  attachmentCount = 0,
}: FileUploadPopupProps) {
  const t = useTranslations();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
      close();
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close]);

  const isSingleBlocked = attachmentCount > 0;

  const TIME_DOWN =
    !isSingleBlocked && hoursRemaining > 0 && imagesAtLimit
      ? ` • ${(() => {
          const h = Math.floor(hoursRemaining / 3600000);
          const m = Math.floor((hoursRemaining % 3600000) / 60000);
          return h > 0 ? `${h}h ${m}m` : `${m}m`;
        })()}`
      : "";

  const isDisabled = isSingleBlocked || imagesAtLimit;

  return (
    <AnimatePresence>
      <motion.div
        ref={popupRef}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.22 }}
        className="absolute bottom-full mb-3 left-0 w-44 p-4 rounded-2xl
                   bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl
                   border border-white/20 shadow-xl text-center z-50"
      >
        {/* Arrow Pointer */}
        <div
          className="absolute -bottom-2 left-6 w-3 h-3 rotate-45 
                        bg-white/30 dark:bg-slate-800/50 border-r border-b border-white/20"
        />

        <File size={36} className="mx-auto text-indigo-500 mb-2" />

        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
          {t("fileupload.upload_title")}
        </h3>
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
          {isSingleBlocked ? (
            t("fileupload.single_attachment_only")
          ) : (
            <>
              {imageCount}/{MAX_IMAGE_ATTACHMENTS}
              {TIME_DOWN}
            </>
          )}
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isDisabled}
          title={
            isSingleBlocked
              ? t("fileupload.single_attachment_only")
              : imagesAtLimit
                ? t("fileupload.max_images", { count: MAX_IMAGE_ATTACHMENTS })
                : undefined
          }
          className={cn(
            "p-2 rounded-lg text-sm transition flex items-center justify-center mx-auto text-white shadow",
            isDisabled
              ? "bg-gray-500/50 cursor-not-allowed"
              : "bg-indigo-500 hover:bg-indigo-600",
          )}
        >
          <Upload size={14} className="mr-1" />
          {t("fileupload.button_label")}
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*,application/pdf,audio/*"
          className="hidden"
        />
      </motion.div>
    </AnimatePresence>
  );
}
