import { motion } from "framer-motion";
import { Play, Square } from "lucide-react";
import { cn } from "@/app/lib/utils";

export const formatAudioTime = (s: number) => {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

export type AudioPlayerApi = {
  audioDurations: Record<string, number>;
  activeSrc: string | null;
  isPlaying: boolean;
  currentTime: number;
  onTogglePlay: (src: string) => void;
};

export function renderAudioBubble(src: string, api: AudioPlayerApi) {
  if (!src) return null;

  const duration = api.audioDurations[src] ?? 0;
  const isBubbleActive = api.activeSrc === src;
  const isBubblePlaying = isBubbleActive && api.isPlaying;
  const shownTime = isBubbleActive ? api.currentTime : duration;

  const barCount = 8;

  return (
    <div
      className={cn(
        "p-3 bg-white/20 dark:bg-slate-700/20 rounded-xl mb-2 flex items-center justify-between gap-3",
        "max-w-[150px] w-[150px]"
      )}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button
          onClick={() => api.onTogglePlay(src)}
          className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white shrink-0"
        >
          {isBubblePlaying ? (
            <Square size={14} fill="currentColor" />
          ) : (
            <Play size={16} className="ml-0.5" />
          )}
        </button>

        {/* Wave animation — only animates while this bubble is playing */}
        <motion.div className="flex gap-1 items-center flex-1 justify-between min-w-0 pr-2">
          {Array.from({ length: barCount }).map((_, idx) => {
            const i = idx + 1;
            return isBubblePlaying ? (
              <motion.div
                key={i}
                className="w-[3px] h-1.5 rounded-full bg-indigo-400 shrink-0"
                animate={{ height: [6, 18, 10, 16, 8][i % 5] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.7,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }}
              />
            ) : (
              <div
                key={i}
                className="w-[3px] h-1.5 rounded-full bg-indigo-400/60 shrink-0"
              />
            );
          })}
        </motion.div>
      </div>
      <span className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums shrink-0">
        {formatAudioTime(shownTime)}
      </span>
    </div>
  );
}
