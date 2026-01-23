"use client";

import { useState, useRef } from "react";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

import AvatarCropper from "./AvatarCropper";
import { useAvatarEditor } from "./useAvatarEditor";

interface Props {
  src: string;
  onChange: (imgUrl: string) => void;
  onSuccess?: () => void;
}

export default function AvatarEditor({ src, onChange, onSuccess }: Props) {
  const t = useTranslations();
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const { uploadAvatar, loading } = useAvatarEditor();

  const openFilePicker = () => fileRef.current?.click();

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageToCrop(URL.createObjectURL(file));
  };

  const handleSaveCropped = async (croppedImg: string) => {
    const newUrl = await uploadAvatar(croppedImg);
    if (newUrl) {
      onChange(newUrl);
      onSuccess?.();
    }
    setImageToCrop(null);
  };

  console.log("AvatarEditor src value →", {
  src,
  type: typeof src,
  length: src?.length,
});

 const avatarSrc =
  typeof src === "string" && src.trim().length > 0
    ? src.replace("http://", "https://")
    : "/avatar.png";
    
    console.log("Avatar src:", src);
  return (
    <div className="relative group">
      {avatarSrc && (
        <Image
          key={avatarSrc} // forces refresh when URL changes
          src={avatarSrc}
          alt={t("account_info.avatar_alt", { name: "User" })}
          width={70}
          height={70}
          unoptimized
          priority
          className="rounded-2xl object-cover shadow-sm"
        />
      )}

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
