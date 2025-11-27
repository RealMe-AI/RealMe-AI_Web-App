"use client";

import { Fragment } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Transition,
} from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}

export default function CustomSelect({
  label,
  options,
  value,
  onChange,
  icon,
}: CustomSelectProps) {
  const selected = options.find((opt) => opt.value === value);

  return (
    <div>
      <span>
        {icon} {label}
      </span>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1">
          <ListboxButton
            className="relative w-30 cursor-pointer rounded-lg bg-white/60 dark:bg-slate-700/60 
                       border border-slate-300 dark:border-slate-600 py-2 pl-3 pr-10 text-left
                       shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                       focus:ring-opacity-50"
          >
            <span className="block truncate text-slate-800 dark:text-slate-100">
              {selected?.label}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-300" />
            </span>
          </ListboxButton>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions
              className="absolute mt-1 max-h-60 w-30 overflow-auto rounded-md 
                         bg-white dark:bg-slate-800 py-1 text-base shadow-lg ring-1 ring-black/10 dark:ring-white/20
                         focus:outline-none sm:text-sm z-50"
            >
              {options.map((opt) => (
                <ListboxOption
                  key={opt.value}
                  value={opt.value}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-3 pr-10 ${
                      active
                        ? "bg-indigo-100 dark:bg-indigo-700/50 text-indigo-900 dark:text-white"
                        : "text-slate-800 dark:text-slate-100"
                    }`
                  }
                >
                  {({ selected: isSelected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          isSelected ? "font-semibold" : "font-normal"
                        }`}
                      >
                        {opt.label}
                      </span>
                      {isSelected && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600 dark:text-indigo-300">
                          <Check className="w-4 h-4" />
                        </span>
                      )}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
