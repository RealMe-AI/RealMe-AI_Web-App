"use client";

import React, { useRef, useEffect } from "react";

interface Props {
  otp: string[];
  onChange: (value: string, index: number) => void;
  expired?: boolean;
  isError?: boolean; 
}

export default function OTPInput({ otp, onChange, expired, isError }: Props) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const hasCleared = useRef(false);

  // Clear OTP when expired - run only once when expired becomes true
  useEffect(() => {
    if (expired && !hasCleared.current) {
      hasCleared.current = true;
      inputs.current.forEach((input, i) => {
        if (input) input.value = "";
        onChange("", i);
      });
      inputs.current[0]?.focus();
    }
    
    // Reset the flag when expired becomes false again
    if (!expired) {
      hasCleared.current = false;
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expired]);

  const handleInput = (value: string, i: number) => {
    if (!/^\d?$/.test(value)) return; 
    onChange(value, i);

    if (value && i < otp.length - 1) {
      inputs.current[i + 1]?.focus();
    }
  };

  const handleBackspace = (value: string, i: number) => {
    if (!value && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3 mt-4">
      {otp.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          value={digit}
          maxLength={1}
          onChange={(e) => handleInput(e.target.value, i)}
          onKeyDown={(e) => {
            if (e.key === "Backspace")
              handleBackspace((e.target as HTMLInputElement).value, i);
          }}
          className={`
            w-7 sm:w-12 h-12 sm:h-14
            text-center text-xl sm:text-2xl font-semibold
            bg-white/20 dark:bg-gray-800/40
            border rounded-xl
            focus:outline-none focus:ring-2 focus:ring-indigo-300
            text-gray-900 dark:text-white
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            transition-colors
            ${isError ? "border-red-500 focus:ring-red-400" : "border-white/20 dark:border-gray-700"}
          `}
        />
      ))}
    </div>
  );
}