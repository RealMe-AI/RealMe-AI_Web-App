"use client";

import { useState } from "react";
import { HelpHero } from "./components/HelpHero";
import { HelpTabBar } from "./components/HelpTabBar";
import { TabDrawer } from "./components/MobileTabDrawer";
import { FaqCategory } from "./components/FaqCategory";
import { ContactTab } from "./components/ContactTab";

export default function HelpSupport() {
  const [activeTab, setActiveTab] = useState("getting-started");
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <main className="bg-white dark:bg-[#05070C] min-h-screen">
      <HelpHero />
      <HelpTabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onHamburgerClick={() => setDrawerOpen(true)}
      />
      <TabDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === "contact" ? (
        <ContactTab />
      ) : (
        <FaqCategory categoryId={activeTab} />
      )}
    </main>
  );
}
