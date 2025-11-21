"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Pencil } from "lucide-react";
import AvatarCropper from "./AvatarCropper";
import { useTranslations } from "next-intl";

interface Props {
  src: string;
  onChange: (imgUrl: string) => void; // Backend URL
}

export default function AvatarEditor({ src, onChange }: Props) {
  const t = useTranslations();
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const openFilePicker = () => fileRef.current?.click();

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageToCrop(URL.createObjectURL(file));
  };

  const handleSaveCropped = async (croppedImg: string) => {
    setLoading(true);

    try {
      const blob = await (await fetch(croppedImg)).blob();
      const fd = new FormData();
      fd.append("avatar", blob, "avatar.png");

      const res = await fetch("/api/user/avatar", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error(t("modal.avatar_upload_failed"));

      const data = await res.json();
      onChange(data.url); // backend URL of uploaded image
    } catch (err) {
      console.error(err);
      alert(t("modal.avatar_upload_failed"));
    } finally {
      setLoading(false);
      setImageToCrop(null);
    }
  };

  return (
    <div className="relative group">
      <Image
        src={src}
        alt={t("account_info.avatar_alt", { name: "User" })}
        width={70}
        height={70}
        className="rounded-2xl object-cover shadow-sm"
      />

      <button
        onClick={openFilePicker}
        className="absolute -top-2 -right-2 bg-black/60 dark:bg-black/50 
                   hover:bg-black/80 transition p-1.5 rounded-full opacity-0 
                   group-hover:opacity-100"
      >
        <Pencil size={14} className="text-white" />
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelected}
        className="hidden"
      />

      {imageToCrop && (
        <AvatarCropper
          src={imageToCrop}
          onClose={() => setImageToCrop(null)}
          onSave={handleSaveCropped}
        />
      )}

      {loading && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-2xl">
          <span className="text-white text-sm">{t("modal.uploading")}</span>
        </div>
      )}
    </div>
  );
}
