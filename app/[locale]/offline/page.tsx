import type { Metadata } from "next";
import OfflineContent from "./OfflineContent";

export const metadata: Metadata = {
  title: "You're offline | RealMe AI",
  description: "RealMe AI needs an internet connection to chat.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfflinePage() {
  return <OfflineContent />;
}
