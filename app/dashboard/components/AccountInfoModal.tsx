"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Pencil } from "lucide-react";
import Cropper from "react-easy-crop";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface AccountInfoModalProps {
  open: boolean;
  close: () => void;
}

interface UserData {
  fullName: string;
  username: string;
  email: string;
  accountType: "Free" | "Pro" | "Business";
  plan: "Free Plan" | "Pro User" | "Business Suite";
  provider: "Google" | "Email" | "Phone";
  avatar?: string;
  dateJoined: string;
  lastLogin: string;
}

export default function AccountInfoModal({ open, close }: AccountInfoModalProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // ⬇️ Cropper states
  const [cropModal, setCropModal] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  useEffect(() => {
    setTimeout(() => {
      setUser({
        fullName: "Owens Chikere",
        username: "@owensvisuels",
        email: "owensvisuels@gmail.com",
        accountType: "Free",
        plan: "Free Plan",
        provider: "Google",
        avatar: "/avatar.png",
        dateJoined: "July 2024",
        lastLogin: "November 12, 2025",
      });
    }, 400);
  }, []);

  // Load image into cropper
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setCropModal(true);
  };

  // Convert cropped area to final blob/base64
  async function getCroppedImage(imageSrc: string, cropPixels: any) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;

    ctx.drawImage(
      image,
      cropPixels.x,
      cropPixels.y,
      cropPixels.width,
      cropPixels.height,
      0,
      0,
      cropPixels.width,
      cropPixels.height
    );

    return canvas.toDataURL("image/png");
  }

  function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = url;
    });
  }

  const handleCropComplete = (_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const saveCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    const cropped = await getCroppedImage(imageSrc, croppedAreaPixels);
    setPreview(cropped);
    setCropModal(false);
  };

  return (
    <>
      {/* ======================= MAIN ACCOUNT MODAL ======================= */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-[90%] max-w-md bg-white/70 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20"
            >
              {/* Close */}
              <button
                onClick={close}
                className="absolute top-3 right-3 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
              >
                <X size={18} />
              </button>

              {/* Avatar */}
              <div className="flex flex-col items-center space-y-3 relative">
                <div className="relative group">
                  <Image
                    src={preview || user?.avatar || "/avatar.png"}
                    alt="Avatar"
                    width={60}
                    height={60}
                    className="rounded-2xl object-cover shadow"
                  />

                  {/* Edit Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -top-2 -right-2 bg-black/60 dark:bg-slate-900/60 hover:bg-black/80 transition p-1.5 rounded-full opacity-0 group-hover:opacity-100"
                  >
                    <Pencil size={14} className="text-white" />
                  </button>

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </div>

                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {user?.fullName}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Signed in with {user?.provider}
                </p>
              </div>

              <div className="border-t border-white/20 dark:border-slate-700/60 my-4" />

              {user ? (
                <div className="space-y-2 text-sm">
                  <InfoItem label="Full Name" value={user.fullName} />
                  <InfoItem label="Username" value={user.username} />
                  <InfoItem label="Email" value={user.email} />
                  <InfoItem label="Account Type" value={user.accountType} />
                  <InfoItem label="Date Joined" value={user.dateJoined} />
                  <InfoItem label="Last Login" value={user.lastLogin} />
                </div>
              ) : (
                <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-5">
                  Loading…
                </p>
              )}

              <div className="border-t border-white/20 dark:border-slate-700/60 my-5" />

              <button
                onClick={() => router.push("/pricingplans")}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 transition"
              >
                <CreditCard size={16} />
                Manage Subscription
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================= CROPPER MODAL ======================= */}
      <AnimatePresence>
        {cropModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative bg-white dark:bg-slate-900 rounded-2xl p-5 w-[90%] max-w-md shadow-xl"
            >
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">
                Crop Image
              </h2>

              <div className="relative h-64 bg-black/20 dark:bg-slate-800 rounded-lg overflow-hidden">
                <Cropper
                  image={imageSrc ?? ""}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                />
              </div>

              {/* Slider */}
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full mt-4"
              />

              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => setCropModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                >
                  Cancel
                </button>

                <button
                  onClick={saveCroppedImage}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Save Crop
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-slate-700 dark:text-slate-300">
      <span className="font-medium">{label}</span>
      <span>{value}</span>
    </div>
  );
}
