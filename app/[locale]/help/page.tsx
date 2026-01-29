"use client";

import { Mail, MessageSquare, BookOpen, RefreshCcw, Bell } from "lucide-react";

export default function HelpSupport() {
  return (
    <section className="min-h-screen bg-linear-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 py-20">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Help & Support
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Welcome to RealMe AI Support. Access guidance, troubleshooting steps, 
            and expert assistance to ensure the best experience while using our platform.
          </p>
        </div>

        {/* Grid  */}
        <div className="grid md:grid-cols-2 gap-10">

          {/*   */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8">
            <BookOpen className="w-10 h-10 text-indigo-500" />
            <h2 className="text-xl font-semibold mt-4 text-slate-900 dark:text-white">
              Knowledge Base
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Browse detailed guides, documentation, and tutorials designed to help you 
              navigate RealMe AI features seamlessly.
            </p>
          </div>

          {/* Contact Support */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8">
            <Mail className="w-10 h-10 text-indigo-500" />
            <h2 className="text-xl font-semibold mt-4 text-slate-900 dark:text-white">
              Contact Support
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Need personalized assistance? Reach out to our support team anytime.
            </p>

            <div className="mt-4 space-y-1 text-slate-700 dark:text-slate-200">
              <p><span className="font-medium">Email:</span> support@realmeai.com</p>
              <p><span className="font-medium">Response Time:</span> Within 24 hours</p>
              <p><span className="font-medium">Availability:</span> Monday–Saturday</p>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8">
            <MessageSquare className="w-10 h-10 text-indigo-500" />
            <h2 className="text-xl font-semibold mt-4 text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Find quick answers to common questions about accounts, billing, AI usage, 
              supported languages, and more.
            </p>
          </div>

          {/* Troubleshooting */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8">
            <RefreshCcw className="w-10 h-10 text-indigo-500" />
            <h2 className="text-xl font-semibold mt-4 text-slate-900 dark:text-white">
              Troubleshooting
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Solve common problems including login issues, performance problems, 
              payment errors, or chat interruptions.
            </p>
          </div>

          {/* Product Updates */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8">
            <Bell className="w-10 h-10 text-indigo-500" />
            <h2 className="text-xl font-semibold mt-4 text-slate-900 dark:text-white">
              Product Updates
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Stay informed about new features, system improvements, and 
              RealMe AI announcements.
            </p>
          </div>

        </div>

        {/* Footer */}
        <p className="text-center mt-20 text-slate-500 dark:text-slate-400 text-sm">
          If you need additional help, feel free to contact our team anytime.
        </p>
      </div>
    </section>
  );
}
