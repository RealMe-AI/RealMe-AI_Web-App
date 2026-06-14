"use client";

import SplashScreen from "../splash-screen/SplashScreen";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import GetStartedSection from "./components/GetStartedSection";
import Footer from "./components/Footer";

import { useState, useEffect } from "react";
import { useSplashScreen } from "../hooks/useSplashScreen";
import { useRouter } from "@/i18n/routing";
import { useAuthStore } from "@/app/store/useAuthStore";

export default function Home() {
  const { mounted, showSplash, finishSplash } = useSplashScreen();
  const [isOpen, setIsOpen] = useState(false);
  const [active] = useState<string>("home");
  const router = useRouter();

  useEffect(() => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      router.push("/dashboard");
    }
  }, [router]);

  // Prevent SSR/client mismatch
  if (!mounted) return null;

  return (
    <>
      <SplashScreen visible={showSplash} onFinish={finishSplash} />

      {!showSplash && (
        <div className="min-h-screen flex flex-col">
          <Navbar isOpen={isOpen} setIsOpen={setIsOpen} active={active} />
          <main className="flex-1">
            <Hero />
            <Features />
            <GetStartedSection />
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}
