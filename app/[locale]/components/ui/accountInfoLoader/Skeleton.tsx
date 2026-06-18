export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`bg-gray-200 dark:bg-slate-700 animate-pulse rounded ${className ?? ""}`}
    />
  );
}

export function AvatarSkeleton() {
  return (
    <div className="w-[70px] h-[70px] rounded-2xl bg-gray-200 dark:bg-slate-700 animate-pulse" />
  );
}

export function BodySkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-5 w-32 bg-gray-200 dark:bg-slate-700 rounded" />
      <div className="h-5 w-48 bg-gray-200 dark:bg-slate-700 rounded" />
      <div className="h-5 w-24 bg-gray-200 dark:bg-slate-700 rounded" />
      <div className="h-5 w-36 bg-gray-200 dark:bg-slate-700 rounded" />
      <div className="h-5 w-40 bg-gray-200 dark:bg-slate-700 rounded" />
    </div>
  );
}
