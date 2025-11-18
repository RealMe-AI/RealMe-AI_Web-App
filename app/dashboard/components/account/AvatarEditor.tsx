"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Pencil } from "lucide-react";
import AvatarCropper from "./AvatarCropper";

interface Props {
  src: string;
  onChange: (img: string) => void;
}

export default function AvatarEditor({ src, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const openFilePicker = () => fileRef.current?.click();

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageToCrop(URL.createObjectURL(file));
  };

  return (
    <div className="relative group">
      <Image
        src={src}
        alt="Avatar"
        width={70}
        height={70}
        className="rounded-2xl object-cover shadow-sm"
      />

      {/* Edit Icon */}
      <button
        onClick={openFilePicker}
        className="absolute -top-2 -right-2 bg-black/60 dark:bg-black/50 
                   hover:bg-black/80 transition p-1.5 rounded-full opacity-0 
                   group-hover:opacity-100"
      >
        <Pencil size={14} className="text-white" />
      </button>

      {/* Hidden File Input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelected}
        className="hidden"
      />

      {/* Cropper */}
      {imageToCrop && (
        <AvatarCropper
          src={imageToCrop}
          onClose={() => setImageToCrop(null)}
          onSave={(croppedImg) => {
            onChange(croppedImg);
            setImageToCrop(null);
          }}
        />
      )}
    </div>
  );
}
