"use client";

import SplashScreen from "./components/SplashScreen";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import GetStartedSection from "./components/GetStartedSection";
import Footer from "./components/Footer";

import { useState } from "react";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <SplashScreen
        visible={showSplash}
        onFinish={() => setShowSplash(false)}
      />
      {!showSplash && (
        <div className="min-h-screen flex flex-col">
          <Navbar />
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
