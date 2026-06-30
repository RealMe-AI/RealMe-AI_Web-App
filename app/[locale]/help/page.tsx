import type { Metadata } from "next";
import { HelpSupport } from "./Help";

export const metadata: Metadata = {
  title: "Help Center",
  description:
    "Find answers to common questions about RealMe AI.",
};

export default function HelpPage() {
  return <HelpSupport />;
}