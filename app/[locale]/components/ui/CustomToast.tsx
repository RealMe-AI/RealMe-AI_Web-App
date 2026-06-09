"use client";

import { X } from "lucide-react";

interface CustomToastProps {
  message: string;
  type: "success" | "error";
  closeToast?: () => void;
}

export const CustomToast = ({
  message,
  type,
  closeToast,
}: CustomToastProps) => {
  const isSuccess = type === "success";

  return (
    <div className="flex w-full items-start gap-3 py-1">
      <div className="flex flex-1 flex-col gap-1">
        <p className="text-sm font-semibold text-navy">
          {isSuccess ? "Success" : "Error"}
        </p>
        <p className="text-xs leading-relaxed text-ink-muted">{message}</p>
      </div>

      {closeToast && (
        <button
          onClick={closeToast}
          className="ml-auto -mr-1 rounded-md p-1 text-ink-subtle hover:bg-black/5 hover:text-navy transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
