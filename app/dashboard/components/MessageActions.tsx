"use client";

import { Copy, RefreshCcw, Star, Pin } from "lucide-react";

export default function MessageActions() {
  const handleCopy = () => {
    navigator.clipboard.writeText("Message copied!");
  };

  return (
    <div className="flex flex-col gap-2 bg-white/70 dark:bg-slate-800/80 backdrop-blur-md rounded-xl p-2 shadow-lg border border-white/20">
      <button
        onClick={handleCopy}
        className="p-1.5 rounded-md hover:bg-indigo-100 dark:hover:bg-slate-700 transition"
      >
        <Copy size={14} className="text-slate-700 dark:text-slate-200" />
      </button>
      <button className="p-1.5 rounded-md hover:bg-indigo-100 dark:hover:bg-slate-700 transition">
        <RefreshCcw size={14} className="text-slate-700 dark:text-slate-200" />
      </button>
      <button className="p-1.5 rounded-md hover:bg-indigo-100 dark:hover:bg-slate-700 transition">
        <Star size={14} className="text-slate-700 dark:text-slate-200" />
      </button>
      <button className="p-1.5 rounded-md hover:bg-indigo-100 dark:hover:bg-slate-700 transition">
        <Pin size={14} className="text-slate-700 dark:text-slate-200" />
      </button>
    </div>
  );
}
