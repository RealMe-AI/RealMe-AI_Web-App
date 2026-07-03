import { LinkedInIcon } from "@/app/[locale]/components/icons/LinkedInIcon";
import { MarkIcon } from "@/app/[locale]/components/icons/MarkIcon";
import SpinnerIcon from "@/app/[locale]/components/icons/SpinnerIcon";
import { TwitterIcon } from "@/app/[locale]/components/icons/TwitterIcon";
import { WhatsappIcon } from "@/app/[locale]/components/icons/WhatsappIcon";
import { useCopyToClipboard } from "@/app/hooks/copyToClipboard/useCopyToClipboard";
import { Check } from "lucide-react";

export function SocialButton({
  shareUrl,
  isSharing,
  title,
}: {
  shareUrl: string | null;
  isSharing: boolean;
  title: string;
}) {

  const { copied, copy } = useCopyToClipboard();

  const handleCopyLink = () => {
    if (shareUrl) copy(shareUrl);
  };

  const handleSocialShare = (platform: "x" | "linkedin" | "whatsapp") => {
    const url = shareUrl || window.location.origin;
    const text = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);
    const fullText = encodeURIComponent(`${title}\n${url}`);

    const links = {
      x: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://api.whatsapp.com/send?text=${fullText}`,
    };

    window.open(links[platform], "_blank", "noopener,noreferrer");
  };
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-8 mb-8">
      {/* Copy Link */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={handleCopyLink}
          disabled={!shareUrl || isSharing}
          className="flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full bg-gray-100 dark:bg-white text-gray-900 dark:text-black hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {isSharing ? (
            <SpinnerIcon />
          ) : copied ? (
            <Check size={20} />
          ) : (
            <MarkIcon />
          )}
        </button>
        <span className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">
          Copy
        </span>
      </div>

      {/* X */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={() => handleSocialShare("x")}
          className="flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full bg-gray-100 dark:bg-white text-gray-900 dark:text-black hover:opacity-80 transition-opacity"
        >
          <TwitterIcon />
        </button>
        <span className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">X</span>
      </div>

      {/* LinkedIn */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={() => handleSocialShare("linkedin")}
          className="flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full bg-gray-100 dark:bg-white text-gray-900 dark:text-black hover:opacity-80 transition-opacity"
        >
          <LinkedInIcon />
        </button>
        <span className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">
          LinkedIn
        </span>
      </div>

      {/* whatsapp */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={() => handleSocialShare("whatsapp")}
          className="flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full bg-gray-100 dark:bg-white text-gray-900 dark:text-black hover:opacity-80 transition-opacity"
        >
          <WhatsappIcon />
        </button>
        <span className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">
          Whatsapp
        </span>
      </div>
    </div>
  );
}
