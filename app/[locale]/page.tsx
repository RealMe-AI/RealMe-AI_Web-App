import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "RealMe AI | Multilingual AI Assistant",
  description:
    "RealMe AI is a multilingual AI assistant powered by GPT-5 that helps you chat, write, translate, learn, create, and communicate naturally with voice and text in English, Hausa, Igbo, and Yoruba.",
};

export default function Home() {
  return <HomeClient />;
}
