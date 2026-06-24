"use client";

import { useTranslations } from "next-intl";
import { useThemeStore } from "../../store/useThemeStore";

import CustomSelect from "./CustomSelect";

export default function ThemeSelect() {
  const t = useTranslations();

  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <CustomSelect
    className="w-25"
      label={""}
      options={[
        { label: t("settings.theme.Light"), value: "light" },
        { label: t("settings.theme.Dark"), value: "dark" },
        { label: t("settings.theme.System"), value: "system" },
      ]}
      value={theme}
      onChange={(v) => setTheme(v as "light" | "dark" | "system")}
      icon={""}
    />
  );
}
