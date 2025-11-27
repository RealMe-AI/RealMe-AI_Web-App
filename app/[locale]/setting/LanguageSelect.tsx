"use client";

import { Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import CustomSelect from "./CustomSelect";
import { useSettings } from "../hooks/useSettings";
import { useParams } from "next/navigation";

export default function LanguageSelect() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const { setLanguage } = useSettings();

  const currentLocale = params.locale as string;

  const handleChange = (value: string) => {
    setLanguage(value);

    const pathname = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);

    // Remove current locale prefix
    const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");

    // Build new path
    const newPath = `/${value}${pathnameWithoutLocale}`;
    const query = searchParams.toString();

    router.push(query ? `${newPath}?${query}` : newPath);
  };

  return (
    <CustomSelect
      label={t("settings.language.label")}
      options={[
        { label: t("settings.language.english"), value: "en" },
        { label: t("settings.language.hausa"), value: "ha" },
        { label: t("settings.language.igbo"), value: "ig" },
        { label: t("settings.language.yoruba"), value: "yo" },
      ]}
      value={currentLocale}
      onChange={handleChange}
      icon={<Globe size={16} />}
    />
  );
}
