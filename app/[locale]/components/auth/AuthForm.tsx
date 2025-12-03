"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Tabs from "./Tabs";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="mt-8 relative">
      <Tabs 
        isSignUp={isSignUp}
        setIsSignUp={(v) => setIsSignUp(v)}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={isSignUp ? "signup" : "signin"}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35 }}
        >
          {isSignUp ? <SignUpForm /> : <SignInForm />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
