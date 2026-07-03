"use client";

import { useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useTtsStore } from "@/app/store/useTtsStore";

export default function VoiceSettings() {
  const t = useTranslations();
  const { enabled, speed, autoRead, setEnabled, setSpeed, setAutoRead } =
    useTtsStore();

  const [showSpeed, setShowSpeed] = useState(false);
  const speedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSpeedTimer = useCallback(() => {
    if (speedTimerRef.current) {
      clearTimeout(speedTimerRef.current);
      speedTimerRef.current = null;
    }
  }, []);

  const handleSpeedStart = useCallback(() => {
    clearSpeedTimer();
    setShowSpeed(true);
  }, [clearSpeedTimer]);

  const handleSpeedEnd = useCallback(() => {
    clearSpeedTimer();
    speedTimerRef.current = setTimeout(() => {
      setShowSpeed(false);
    }, 3000);
  }, [clearSpeedTimer]);

  const handleSpeedChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSpeed(Number(e.target.value));
    },
    [setSpeed],
  );

  const pct = ((speed - 1) / 9) * 100;

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
        {t("settings.voice.label")}
      </h3>

      <div className="flex flex-col gap-2">
        {/* Allow AI Voice Toggle */}
        <div
          onClick={() => setEnabled(!enabled)}
          className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-indigo-100/50 dark:hover:bg-slate-700/60 transition"
        >
          <div className="flex items-center gap-2">
            <span className="text-slate-800 dark:text-slate-100">
              {t("settings.voice.allow")}
            </span>
          </div>

          <div
            className={`w-10 h-5 rounded-full p-0.5 flex items-center transition-colors ${
              enabled ? "bg-indigo-600" : "bg-slate-400"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                enabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </div>

        {/* Speed Control */}
        {enabled && (
          <div className="px-2 py-3 relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {t("settings.voice.speed")}
              </p>
            </div>

            <div className="relative flex items-center h-6">
              {/* Speed badge */}
              {showSpeed && (
                <div
                  className="absolute -top-8 text-xs font-semibold text-white bg-indigo-600 dark:bg-indigo-500 rounded-md px-2 py-0.5 shadow pointer-events-none transition-opacity"
                  style={{ left: `calc(${pct}% - 12px)` }}
                >
                  {speed}
                </div>
              )}

              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={speed}
                onChange={handleSpeedChange}
                onMouseDown={handleSpeedStart}
                onMouseUp={handleSpeedEnd}
                onTouchStart={handleSpeedStart}
                onTouchEnd={handleSpeedEnd}
                className="
                  w-full h-2 appearance-none cursor-pointer rounded-full
                  bg-slate-200 dark:bg-slate-600
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-indigo-600
                  dark:[&::-webkit-slider-thumb]:border-indigo-400
                  [&::-webkit-slider-thumb]:transition-transform
                  [&::-webkit-slider-thumb]:active:scale-110
                  [&::-moz-range-thumb]:w-4
                  [&::-moz-range-thumb]:h-4
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-white
                  [&::-moz-range-thumb]:shadow-md
                  [&::-moz-range-thumb]:border-2
                  [&::-moz-range-thumb]:border-indigo-600
                  dark:[&::-moz-range-thumb]:border-indigo-400
                "
                style={{
                  background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`,
                }}
              />
            </div>
          </div>
        )}

        {/* Auto-read Toggle */}
        {enabled && (
          <label
            onClick={() => setAutoRead(!autoRead)}
            className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-indigo-100/50 dark:hover:bg-slate-700/60 transition"
          >
            <div
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition ${
                autoRead
                  ? "bg-indigo-600 border-indigo-600"
                  : "border-slate-400 dark:border-slate-500 bg-transparent"
              }`}
            >
              {autoRead && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span className="text-sm text-slate-700 dark:text-slate-200">
              {t("settings.voice.autoRead")}
            </span>
          </label>
        )}
      </div>
    </div>
  );
}
