import { Mail, MessageCircle, Bug, Lightbulb } from "lucide-react";

export interface ContactItem {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  action: string;
  badge?: boolean;
}

export const contacts: ContactItem[] = [
  {
    id: "email_support",
    icon: Mail,
    action: "mailto:officialrealme.ai@gmail.com",
  },
  {
    id: "live_chat",
    icon: MessageCircle,
    action: "#",
    badge: true,
  },
  {
    id: "report_bug",
    icon: Bug,
    action: "mailto:support@realmeai.com?subject=Bug Report",
  },
  {
    id: "suggest_feature",
    icon: Lightbulb,
    action: "mailto:support@realmeai.com?subject=Feature Suggestion",
  },
];
