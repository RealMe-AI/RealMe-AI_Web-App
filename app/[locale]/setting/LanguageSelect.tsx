"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useLanguageStore, type Language } from "@/app/store/useLanguageStore";

import CustomSelect from "./CustomSelect";

export default function LanguageSelect() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();

  const currentLocale = params.locale as string;

  const handleChange = (value: string) => {
    useLanguageStore.getState().setLanguage(value as Language);

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
      label={""}
      options={[
        {
          label: t("settings.language.english"),
          shortLabel: "En",
          value: "en",
        },
        { label: t("settings.language.hausa"), shortLabel: "Ha", value: "ha" },
        { label: t("settings.language.igbo"), shortLabel: "Ig", value: "ig" },
        { label: t("settings.language.yoruba"), shortLabel: "Yo", value: "yo" },
      ]}
      value={currentLocale}
      onChange={handleChange}
      icon={""}
    />
  );
}
