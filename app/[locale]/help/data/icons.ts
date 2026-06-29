import {
  MessageCircle,
  Mic,
  Globe,
  User,
  Zap,
  Phone,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const categoryIcons: Record<string, LucideIcon> = {
  "getting-started": MessageCircle,
  voice: Mic,
  languages: Globe,
  privacy: ShieldCheck,
  account: User,
  troubleshooting: Zap,
  contact: Phone,
};
