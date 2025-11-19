"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useUserStore, UserData } from "../../../zustand/useUserStore";

interface UpdateProfileResponse {
  success: boolean;
  fullName?: string;
  message?: string;
}

export default function EditProfileModal() {
  const { user, setUser, isEditProfileOpen, closeEditProfile } = useUserStore();
  const [fullName, setFullName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (user?.fullName) setFullName(user.fullName);
  }, [user]);

  const handleSave = async () => {
    if (!fullName.trim()) {
      setError("Full name cannot be empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName }),
      });

      const data: UpdateProfileResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update Zustand store
      setUser({ fullName });

      // Close modal
      closeEditProfile();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isEditProfileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="w-[90%] max-w-md bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl relative"
          >
            <button
              onClick={closeEditProfile}
              className="absolute top-3 right-3 text-slate-600 hover:text-slate-800 dark:hover:text-slate-300"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Edit Profile
            </h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-slate-600 dark:text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="p-2 rounded-lg bg-white/60 dark:bg-slate-700/60 border border-slate-300 dark:border-slate-600 focus:outline-none"
                  placeholder="Enter full name"
                />
                {error && <p className="text-red-600 text-sm">{error}</p>}
              </div>

              <button
                onClick={handleSave}
                disabled={loading}
                className={`w-full px-4 py-2 rounded-lg text-white shadow-md transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
