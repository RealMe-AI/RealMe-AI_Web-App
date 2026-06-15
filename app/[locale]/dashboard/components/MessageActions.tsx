"use client";

import { Copy, Pencil, Check } from "lucide-react";
import { useCopyToClipboard } from "@/app/hooks/copyToClipboard/useCopyToClipboard";
import Tooltip from "@/app/[locale]/components/ui/Tooltip";

export default function MessageActions({
  sender,
  text,
}: {
  sender: "user" | "ai";
  text?: string;
}) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="flex flex-row gap-1 bg-white/70 dark:bg-slate-800/80 backdrop-blur-md rounded-lg p-1 shadow-md border border-white/20">
      <Tooltip content="Copy Message">
        <button
          onClick={() => text && copy(text)}
          className="p-1.5 rounded-md hover:bg-indigo-100 dark:hover:bg-slate-700 transition"
        >
          {copied ? (
            <Check size={14} className="text-slate-700 dark:text-slate-200" />
          ) : (
            <Copy size={14} className="text-slate-700 dark:text-slate-200" />
          )}
        </button>
      </Tooltip>
      {sender === "user" && (
        <button className="p-1.5 rounded-md hover:bg-indigo-100 dark:hover:bg-slate-700 transition">
          <Pencil size={14} className="text-slate-700 dark:text-slate-200" />
        </button>
      )}
    </div>
  );
}
