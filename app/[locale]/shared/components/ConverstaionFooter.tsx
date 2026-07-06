import { useTranslations } from "next-intl";
import Image from "next/image";

export function ConversationFooter() {
  const t = useTranslations();
  return (
    <div className="border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-center gap-2">
        <Image
          src="/logo.png"
          alt="RealMe AI"
          width={14}
          height={14}
          className="rounded-full"
        />
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {t("shared.powered_by")}
        </span>
      </div>
    </div>
  );
}
