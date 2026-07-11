"use client";

import { useState, useRef } from "react";
import { twMerge } from "tailwind-merge";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  className?: string;
}

export default function Tooltip({ children, content, className }: TooltipProps) {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => {
        clearTimeout(timeoutRef.current);
        setShow(true);
      }}
      onMouseLeave={() => {
        timeoutRef.current = setTimeout(() => setShow(false), 150);
      }}
    >
      {children}
      {show && (
        <div className={twMerge("absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 p-1 text-[10px] text-white dark:text-slate-900 bg-slate-800 dark:bg-slate-200 rounded shadow-lg whitespace-nowrap pointer-events-none z-50 hidden lg:block", className)}>
          {content}
          {/* <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-800 dark:border-t-slate-200" /> */}
        </div>
      )}
    </div>
  );
}
