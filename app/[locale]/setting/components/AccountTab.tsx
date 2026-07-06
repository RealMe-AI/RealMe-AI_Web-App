"use client";

import { Pencil } from "lucide-react";

interface AccountTabProps {
  user: { fullName?: string; email?: string } | null;
  openEditProfile: () => void;
  setIsDeleteModalOpen: (open: boolean) => void;
  t: (key: string) => string;
}

export function AccountTab({ user, openEditProfile, setIsDeleteModalOpen, t }: AccountTabProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between gap-16 items-center py-3 border-b border-slate-100 dark:border-slate-700/50">
        <span className="text-slate-800 dark:text-slate-200 font-medium">{t("settings.account.name")}</span>
        <div className="flex items-center gap-2">
          <span className="text-slate-600 text-sm md:text-base dark:text-slate-400">{user?.fullName}</span>
          <button
            onClick={openEditProfile}
            className="p-1 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            title="Edit Profile"
          >
            <Pencil size={14} />
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700/50">
        <span className="text-slate-800 dark:text-slate-200 font-medium">{t("settings.account.email")}</span>
        <span className="text-slate-600 text-sm md:text-base dark:text-slate-400 truncate max-w-[150px]">{user?.email}</span>
      </div>
      <div className="flex justify-between items-center py-3">
        <span className="text-slate-800 dark:text-slate-200 font-medium">{t("settings.delete_account")}</span>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg transition"
        >
          {t("settings.account.delete")}
        </button>
      </div>
    </div>
  );
}