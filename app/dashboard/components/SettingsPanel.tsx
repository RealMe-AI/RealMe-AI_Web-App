"use client";
);
}


function Toggle({ label, enabled, onChange, icon }: {
label: string;
enabled: boolean;
onChange: () => void;
icon?: React.ReactNode;
}) {
return (
<div
onClick={onChange}
className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-indigo-100/50 dark:hover:bg-slate-700/60 transition"
>
<div className="flex items-center gap-2">{icon} <span>{label}</span></div>
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
);
}


function Select({ label, options, value, onChange, icon }: {
label: string;
options: { label: string; value: string }[];
value: string;
onChange: (v: string) => void;
icon?: React.ReactNode;
}) {
return (
<div className="flex items-center justify-between p-2 rounded-lg hover:bg-indigo-100/50 dark:hover:bg-slate-700/60 transition">
<div className="flex items-center gap-2">{icon} <span>{label}</span></div>
<select
value={value}
onChange={(e) => onChange(e.target.value)}
className="bg-transparent border-none focus:ring-0 text-slate-800 dark:text-slate-100 cursor-pointer"
>
{options.map((opt) => (
<option key={opt.value} value={opt.value}>
{opt.label}
</option>
))}
</select>
</div>
);
}