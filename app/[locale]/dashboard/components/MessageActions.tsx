"use client";

import { Copy, Pencil } from "lucide-react";

export default function MessageActions({sender}: {sender: "user" | "ai"}) {
  const handleCopy = () => {
    navigator.clipboard.writeText("Message copied!");
  };

  return (
    <div className="flex flex-row gap-1 bg-white/70 dark:bg-slate-800/80 backdrop-blur-md rounded-lg p-1 shadow-md border border-white/20">
      <button
        onClick={handleCopy}
        className="p-1.5 rounded-md hover:bg-indigo-100 dark:hover:bg-slate-700 transition"
      >
        <Copy size={14} className="text-slate-700 dark:text-slate-200" />
      </button>
      {/* <button className="p-1.5 rounded-md hover:bg-indigo-100 dark:hover:bg-slate-700 transition">
        <RefreshCcw size={14} className="text-slate-700 dark:text-slate-200" />
      </button>
      <button className="p-1.5 rounded-md hover:bg-indigo-100 dark:hover:bg-slate-700 transition">
        <Star size={14} className="text-slate-700 dark:text-slate-200" />
      </button> */}
      {sender === "user" && <button className="p-1.5 rounded-md hover:bg-indigo-100 dark:hover:bg-slate-700 transition">
        <Pencil size={14} className="text-slate-700 dark:text-slate-200" />
      </button>}
    </div>
  );
}
