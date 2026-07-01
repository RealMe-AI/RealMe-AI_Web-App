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
    action: "https://mail.google.com/mail/?view=cm&fs=1&to=officialrealme.ai@gmail.com",
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
    action: "/help/report?type=report_bug",
  },
  {
    id: "suggest_feature",
    icon: Lightbulb,
    action: "/help/report?type=suggest_feature",
  },
];
