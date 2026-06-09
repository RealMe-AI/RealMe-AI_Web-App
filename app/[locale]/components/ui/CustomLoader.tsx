export function CustomLoader({ size }: { size?: number }) {
  return (
    <div
      style={{ width: size ?? 50, height: size ?? 50 }}
      className="border-2 border-indigo-300 dark:border-indigo-600 border-t-transparent rounded-full animate-spin"
    />
  );
}
