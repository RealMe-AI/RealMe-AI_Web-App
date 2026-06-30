import type { Metadata } from "next";
import { About } from "./About";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about RealMe AI, our mission, vision, and who's building multilingual AI for everyone.",
};

export default function AboutPage() {
  return <About />;
}
