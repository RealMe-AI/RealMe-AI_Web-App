"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// You can replace this hook with your real auth provider, e.g. useSession() or useUser()
import { useEffect, useState } from "react";

interface AccountInfoModalProps {
  open: boolean;
  close: () => void;
}

interface UserData {
  fullName: string;
  username: string;
  email: string;
  accountType: "Free" | "Pro" | "Business";
  plan: "Free Plan" | "Pro User" | "Business Suite";
  provider: "Google" | "Email" | "Phone";
  avatar?: string;
  dateJoined: string;
  lastLogin: string;
}

export default function AccountInfoModal({
  open,
  close,
}: AccountInfoModalProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();

  // Example dynamic mock — replace with your real data fetch or session context
  useEffect(() => {
    // simulate async fetch
    const timeout = setTimeout(() => {
      setUser({
        fullName: "Owens Chikere",
        username: "@owensvisuels",
        email: "owensvisuels@gmail.com",
        accountType: "Free",
        plan: "Free Plan",
        provider: "Google",
        avatar: "/avatar.png",
        dateJoined: "July 2024",
        lastLogin: "November 12, 2025",
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="relative w-[90%] max-w-md bg-white/70 dark:bg-slate-800/80 
                       backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20"
          >
            {/* Close Button */}
            <button
              onClick={close}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="flex flex-col items-center text-center space-y-3">
              <Image
                src={user?.avatar || "/avatar.png"}
                alt="User Avatar"
                width={70}
                height={70}
                className="rounded-full border border-white/30 shadow-sm"
              />

              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {user?.fullName || "Loading..."}
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Signed in with {user?.provider || "—"}
              </p>

              <span
                className={`px-3 py-1 text-xs rounded-full border
                ${
                  user?.accountType === "Pro"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-700/30 dark:text-emerald-300 border-emerald-300/20"
                    : user?.accountType === "Business"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-700/30 dark:text-amber-300 border-amber-300/20"
                    : "bg-indigo-100 text-indigo-700 dark:bg-indigo-700/30 dark:text-indigo-300 border-indigo-300/20"
                }`}
              >
                {user?.plan || "—"}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-white/20 dark:border-slate-700/60 my-4" />

            {/* Body Info Section */}
            {user ? (
              <div className="space-y-2 text-sm">
                <InfoItem label="Full Name" value={user.fullName} />
                <InfoItem label="Username" value={user.username} />
                <InfoItem label="Email Address" value={user.email} />
                <InfoItem label="Account Type" value={user.accountType} />
                <InfoItem label="Date Joined" value={user.dateJoined} />
                <InfoItem label="Last Login" value={user.lastLogin} />
              </div>
            ) : (
              <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-6">
                Loading account info...
              </p>
            )}

            {/* Divider */}
            <div className="border-t border-white/20 dark:border-slate-700/60 my-4" />

            {/* Billing / Manage Subscription */}
            <button
              onClick={() => router.push("/pricingplans")}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg 
                         text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 
                         dark:bg-indigo-700 dark:hover:bg-indigo-800 transition"
            >
              <CreditCard size={16} />
              Manage Subscription
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Reusable Info Item Row */
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
      <span className="font-medium text-slate-600 dark:text-slate-400">
        {label}
      </span>
      <span className="text-right text-slate-800 dark:text-slate-100">
        {value}
      </span>
    </div>
  );
}
