"use client";

import { useTranslations } from "next-intl";
import { useSettings } from "../../hooks/useSettings";
import { useThemeStore } from "../../zustand/useThemeStore";

import CustomSelect from "./CustomSelect";

export default function ThemeSelect() {
  const t = useTranslations();

  const { theme, setTheme } = useSettings();
  const applyTheme = useThemeStore((s) => s.setTheme);

  const handleThemeChange = (selected: "light" | "dark" | "system") => {
    setTheme(selected);

    if (selected === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      applyTheme(prefersDark ? "dark" : "light");
    } else {
      applyTheme(selected);
    }
  };

  return (
    <CustomSelect
      label={""}
      options={[
        { label: t("settings.theme.Light"), value: "light" },
        { label: t("settings.theme.Dark"), value: "dark" },
        { label: t("settings.theme.System"), value: "system" },
      ]}
      value={theme}
      onChange={(v) => handleThemeChange(v as "light" | "dark" | "system")}
      icon={''}
    />
  );
}
