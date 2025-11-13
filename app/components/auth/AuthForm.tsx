"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, UserPlus, Mail, Lock, Phone } from "lucide-react";
import Tabs from "./Tabs";

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="mt-8 relative">
      {/* Tabs */}
      <Tabs isSignUp={isSignUp} setIsSignUp={setIsSignUp} />

      <AnimatePresence mode="wait">
        <motion.form
          key={isSignUp ? "signup" : "signin"}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
          className="mt-6 flex flex-col gap-4"
          autoComplete="off"
        >
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email address..."
              required
              autoComplete="off"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Password..."
              required
              autoComplete="new-password"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* If Sign Up → show phone */}
          {isSignUp && (
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                placeholder="Phone number (E.164 format)"
                autoComplete="off"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mt-2 flex items-center justify-center gap-2 bg-indigo-400 text-slate-800 dark:bg-indigo-600 dark:text-white font-semibold py-3 rounded-lg shadow-md hover:bg-indigo-300 dark:hover:bg-indigo-500 transition"
          >
            {isSignUp ? (
              <>
                <UserPlus size={18} /> Create Account
              </>
            ) : (
              <>
                <LogIn size={18} /> Sign In
              </>
            )}
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <hr className="flex-1 border-gray-300 dark:border-slate-600" />
            <span className="text-sm text-gray-500 dark:text-gray-400">OR</span>
            <hr className="flex-1 border-gray-300 dark:border-slate-600" />
          </div>

          {/* Email Continue Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex items-center justify-center gap-2 border border-gray-300 dark:border-slate-600 rounded-lg py-3 font-semibold text-slate-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
          >
            <Mail size={18} /> Continue with Email
          </motion.button>

          {/* Toggle Text */}
          <p className="text-center text-sm mt-4 text-gray-600 dark:text-gray-400">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-indigo-500 hover:underline"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-indigo-500 hover:underline"
                >
                  Sign Up
                </button>
              </>
            )}
          </p>
        </motion.form>
      </AnimatePresence>
    </div>
  );
}
