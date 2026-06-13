import { useState, useEffect } from "react";

export interface UserData {
  fullName: string;
  username: string;
  email: string;
  provider: "Google" | "Email" | "Phone";
  avatar?: string;
}

export function useSettings() {
  const [user, setUser] = useState<UserData | null>(null);

  const [notifications, setNotifications] = useState(() => {
    if (typeof window === "undefined") return { email: true };
    const saved = localStorage.getItem("user-notifications");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { email: true };
      }
    }
    return { email: true };
  });

  const [isInitialized, setIsInitialized] = useState(() => {
    return typeof window !== "undefined";
  });

  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem("user-notifications", JSON.stringify(notifications));
  }, [notifications, isInitialized]);

  return {
    user,
    notifications,
    setNotifications,
  };
}
