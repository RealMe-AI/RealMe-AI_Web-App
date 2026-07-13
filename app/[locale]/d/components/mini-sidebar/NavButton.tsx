"use client";

import { forwardRef } from "react";
import Tooltip from "../../../components/ui/Tooltip";

interface NavButtonProps {
  tooltip: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export const NavButton = forwardRef<HTMLButtonElement, NavButtonProps>(
  ({ tooltip, onClick, children, className }, ref) => {
    return (
      <Tooltip className="bottom-1/2 -translate-x-1/1" content={tooltip}>
        <button
          ref={ref}
          onClick={onClick}
          className={
            className ||
            "mt-3 p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/40 transition transform hover:scale-105"
          }
        >
          {children}
        </button>
      </Tooltip>
    );
  },
);

NavButton.displayName = "NavButton";
