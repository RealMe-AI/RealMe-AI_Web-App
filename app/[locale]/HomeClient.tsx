"use client";

import SplashScreen from "../slash-screen/SplashScreen";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import GetStartedSection from "./components/GetStartedSection";
import Footer from "./components/Footer";

import { useState } from "react";
import { useSplashScreen } from "../hooks/useSplashScreen";

export default function Home() {
  const { mounted, showSplash, finishSplash } = useSplashScreen();
  const [isOpen, setIsOpen] = useState(false);
  const [active] = useState<string>("home");

  // ❗ Prevent SSR/client mismatch
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
