export function CustomLoader({
  size,
  progress,
}: {
  size?: number;
  progress?: number;
}) {
  const s = size ?? 50;

  if (progress !== undefined) {
    const stroke = 3;
    const r = (s - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ * (1 - progress / 100);

    return (
      <div
        style={{ width: s, height: s }}
        className="relative flex items-center justify-center"
      >
        <svg width={s} height={s} className="-rotate-90">
          <circle
            cx={s / 2}
            cy={s / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-black/30 dark:text-white/30"
          />
          <circle
            cx={s / 2}
            cy={s / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="text-black dark:text-white transition-[stroke-dashoffset] duration-200"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      style={{ width: s, height: s }}
      className="border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin"
    />
  );
}
