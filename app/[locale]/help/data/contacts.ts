import { Mail, MessageCircle, Bug, Lightbulb } from "lucide-react";

export const contacts = [
  {
    icon: Mail,
    label: "Email Support",
    description: "Get a response within 24 hours",
    action: "https://mail.google.com/mail/?view=cm&fs=1&to=officialrealme.ai@gmail.com",
    cta: "officialrealme.ai@gmail.com",
  },
  {
    icon: MessageCircle,
    label: "Live Chat",
    description: "Real-time support from our team",
    action: "#",
    cta: "Coming Soon",
    badge: true,
  },
  {
    icon: Bug,
    label: "Report a Bug",
    description: "Help us improve by reporting issues",
    action: "mailto:support@realmeai.com?subject=Bug Report",
    cta: "Report Now",
  },
  {
    icon: Lightbulb,
    label: "Suggest a Feature",
    description: "Share your ideas with our team",
    action: "mailto:support@realmeai.com?subject=Feature Suggestion",
    cta: "Suggest",
  },
];
