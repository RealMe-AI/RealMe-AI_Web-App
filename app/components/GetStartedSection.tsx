"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
// import aiImage from "/public/images/ai-lang.jpg";

export default function GetStarted() {
  return (
    <section className="relative py-20 lg:py28 bg-linear-to-br from-white via-purple-50 to-purple-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 lg-px-8 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Image */}
        <div className="order-2 lg:order-1">
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={"/"}
                alt="AI Conversation Interface"
                width={900}
                height={900}
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-6 left-6 bg-white dark:bg-gray-900 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
                <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                  💬
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-300">
                    Start chatting in
                  </p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    Seconds
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Steps */}
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
            Get Started in{" "}
            <span className="text-purple-600">3 Simple Steps</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
            Experience professional AI conversations in minutes no technical
            setup required.
          </p>

          <div className="space-y-8">
            {[
              {
                num: "1",
                title: "Create Your Account",
                desc: "Sign up with your email, phone, or Google account. Takes less than 30 seconds with no credit card required.",
              },
              {
                num: "2",
                title: "Customize Your Preferences",
                desc: "Choose your language, AI tone, and interface theme. Enable voice features for hands-free conversations.",
              },
              {
                num: "3",
                title: "Start Conversing",
                desc: "Ask questions, get insights, and evolve professionally with AI that learns your communication style.",
              },
            ].map((step) => (
              <div key={step.num} className="flex items-start gap-5">
                <div className="shrink-0 w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-10 inline-flex items-center text-lg gap-2 bg-linear-to-r from-purple-600 to-indigo-500 text-white px-8 py-4 rounded-lg font-semibold shadow-xl hover:opacity-90 transition-all transform hover:scale-105 group">
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
