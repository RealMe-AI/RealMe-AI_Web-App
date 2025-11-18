"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./cropUtils";
import { X } from "lucide-react";

interface Props {
  src: string;
  onClose: () => void;
  onSave: (img: string) => void;
}

export default function AvatarCropper({ src, onClose, onSave }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((_a, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleSave = async () => {
    const img = await getCroppedImg(src, croppedAreaPixels);
    onSave(img);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 w-[90%] max-w-sm relative">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-slate-600 dark:text-slate-300"
        >
          <X size={18} />
        </button>

        <div className="relative w-full h-64 rounded-lg overflow-hidden">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full mt-4 py-2 rounded-lg bg-indigo-600 text-white text-sm 
          hover:bg-indigo-700 transition"
        >
          Save Image
        </button>
      </div>
    </div>
  );
}
