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

  // Use lazy initializers to load from localStorage during first render
  const [theme, setTheme] = useState<"light" | "dark" | "system">(() => {
    if (typeof window === "undefined") return "system";
    const saved = localStorage.getItem("user-theme") as
      | "light"
      | "dark"
      | "system"
      | null;
    return saved ?? "system";
  });

  const [language, setLanguage] = useState<string>(() => {
    if (typeof window === "undefined") return "en";
    return localStorage.getItem("user-language") ?? "en";
  });

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
    // Already initialized if we're on the client
    return typeof window !== "undefined";
  });

  // Persist preferences - only after initial load to prevent overwriting
  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem("user-theme", theme);
    localStorage.setItem("user-language", language);
    localStorage.setItem("user-notifications", JSON.stringify(notifications));
  }, [theme, language, notifications, isInitialized]);

  return {
    user,
    theme,
    setTheme,
    language,
    setLanguage,
    notifications,
    setNotifications,
  };
}
