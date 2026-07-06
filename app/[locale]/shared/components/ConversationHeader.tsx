import { useTranslations } from "next-intl";
import Image from "next/image";

interface Conversation {
  title: string;
  user: {
    name: string;
  };
}

export function ConversationHeader({ conversation }: { conversation: Conversation }) {
  const t = useTranslations();

  return (
    <div className="sticky top-0 z-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="RealMe AI"
          width={28}
          height={28}
          className="rounded-full shrink-0"
        />
        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
            {conversation.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("shared.shared_by")} {conversation.user.name}
          </p>
        </div>
      </div>
    </div>
  );
}
