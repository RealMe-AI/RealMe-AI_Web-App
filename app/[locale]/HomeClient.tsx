"use client";

import SplashScreen from "../slash-screen/SplashScreen";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import GetStartedSection from "./components/GetStartedSection";
import Footer from "./components/Footer";

import { useState } from "react";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [active] = useState<string>("home");
  

  return (
    <>
      <SplashScreen
        visible={showSplash}
        onFinish={() => setShowSplash(false)}
      />
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
