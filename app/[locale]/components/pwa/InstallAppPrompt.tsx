"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useInstallAppPrompt } from "@/app/hooks/pwa/useInstallAppPrompt";

export default function InstallAppPrompt() {
  const t = useTranslations("pwa.install");
  const {
    visible,
    isDragging,
    isIos,
    showIosHelp,
    cardRef,
    positionStyle,
    handleInstall,
    handleDismiss,
    dragHandlers,
  } = useInstallAppPrompt();

  if (!visible) return null;

  return (
    <div
      ref={cardRef}
      role="dialog"
      aria-labelledby="pwa-install-title"
      className={`fixed z-50 touch-none select-none w-[20rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white/95 py-3 px-2 shadow-xl backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/95 ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={positionStyle}
      {...dragHandlers}
    >
      <div className="flex justify-between gap-2">
        <div className="min-w-0 flex items-center">
          <p
            id="pwa-install-title"
            className="text-sm font-semibold text-slate-900 dark:text-white"
          >
            {t("title")}
          </p>
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {isIos ? t("ios_hint") : t("description")}
          </p>

          {isIos && showIosHelp && (
            <p className="mt-2 rounded-lg bg-slate-100 px-2 py-1.5 text-xs leading-relaxed text-slate-600 dark:bg-slate-700/60 dark:text-slate-300">
              {t("ios_steps")}
            </p>
          )}

          <button
            type="button"
            onClick={handleInstall}
            className="rounded-lg ml-2 bg-indigo-300 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:bg-indigo-600 dark:text-white"
          >
            {isIos ? (showIosHelp ? t("hide_steps") : t("how_to")) : t("cta")}
          </button>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label={t("dismiss")}
          className="rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
