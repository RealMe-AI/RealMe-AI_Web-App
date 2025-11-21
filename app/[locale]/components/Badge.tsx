export default function Badge({
  title,
  subtitle,
}: {
  title: string | number;
  subtitle: string;
}) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-md flex items-center gap-3">
      <div className="w-12 h-12 bg-primary-200 rounded-lg flex items-center justify-center text-primary-700 font-semibold text-lg">
        {title}
      </div>
      <div>
        <div className="text-sm font-medium">{subtitle}</div>
        <div className="text-xs text-slate-500">Available</div>
      </div>
    </div>
  );
}
