"use client";

import { Fragment } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Transition,
} from "@headlessui/react";
import { useTranslate } from "@/app/hooks/useTranslate";
import Tooltip from "../../../components/ui/Tooltip";
import { LANG_OPTIONS } from "./constants";

interface LanguageSelectorProps {
  currentLocale: string;
  onChange: (value: string) => void;
}

export function LanguageSelector({
  currentLocale,
  onChange,
}: LanguageSelectorProps) {
  const { t } = useTranslate();

  return (
    <Tooltip
      className="bottom-1/2 -translate-x-1/1"
      content={t("dashboard.sidebar.tooltips.language")}
    >
      <div className="mb-2">
        <Listbox value={currentLocale} onChange={onChange}>
          <div className="relative">
            <ListboxButton
              className="
                w-10 h-10 flex items-center justify-center
                rounded-lg text-xs font-semibold
                text-slate-600 dark:text-slate-300
                hover:bg-slate-100 dark:hover:bg-slate-700/40
                transition cursor-pointer transform hover:scale-105
              "
            >
              {LANG_OPTIONS.find((o) => o.value === currentLocale)
                ?.shortLabel || "En"}
            </ListboxButton>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ListboxOptions
                className="
                  absolute bottom-full right-1/2 translate-x-1/2 mb-2
                  w-15 overflow-auto rounded-md
                  bg-white dark:bg-slate-800 py-1 text-sm
                  shadow-lg ring-1 ring-black/10 dark:ring-white/20
                  focus:outline-none z-50
                "
              >
                {LANG_OPTIONS.map((opt) => (
                  <ListboxOption
                    key={opt.value}
                    value={opt.value}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-1.5 text-center ${
                        active
                          ? "bg-indigo-100 dark:bg-indigo-700/50 text-indigo-900 dark:text-white"
                          : "text-slate-800 dark:text-slate-100"
                      }`
                    }
                  >
                    {({ selected }) => (
                      <span
                        className={`block ${
                          selected ? "font-semibold" : "font-normal"
                        }`}
                      >
                        {opt.shortLabel}
                      </span>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Transition>
          </div>
        </Listbox>
      </div>
    </Tooltip>
  );
}
