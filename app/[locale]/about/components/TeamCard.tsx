import Image from "next/image";
import { motion } from "framer-motion";
import { LinkedInIcon } from "../../components/icons/LinkedInIcon";
import { TwitterIcon } from "../../components/icons/TwitterIcon";
import Link from "next/link";


export function TeamCard({
  quote,
  image,
  name,
  role,
  alt,
  linkedin = "#",
  x = "#",
}: {
  quote: string;
  image: string;
  name: string;
  role: string;
  alt: string;
  linkedin?: string;
  x?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-lg border border-indigo-100 dark:border-indigo-900/30 bg-white p-8 shadow-sm dark:bg-gray-900 dark:shadow-none"
    >
      <p className="text-sm leading-relaxed text-slate-700 sm:text-base dark:text-slate-200">
        “{quote}”
      </p>

      <div className="mt-7 flex items-center gap-3">
        <Image
          src={image}
          alt={alt}
          width={80}
          height={80}
          className="h-20 w-20 rounded-sm object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {name}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{role}</p>
          <div className="mt-3 flex items-center gap-3">
            <Link
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} on LinkedIn`}
              className="text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 transition"
            >
              <LinkedInIcon width={18} height={18} />
            </Link>
            <Link
              href={x}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} on X`}
              className="text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 transition"
            >
              <TwitterIcon width={18} height={18} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
