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
const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
const [language, setLanguage] = useState<string>("en");
const [notifications, setNotifications] = useState({ email: true });


// Load user data
useEffect(() => {
const timeout = setTimeout(() => {
setUser({
fullName: "Owens Chikere",
username: "@owensvisuels",
email: "owensvisuels@gmail.com",
provider: "Google",
avatar: "/avatar.png",
});
}, 300);
return () => clearTimeout(timeout);
}, []);


// Persist preferences
useEffect(() => {
localStorage.setItem("user-theme", theme);
localStorage.setItem("user-language", language);
localStorage.setItem("user-notifications", JSON.stringify(notifications));
}, [theme, language, notifications]);


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