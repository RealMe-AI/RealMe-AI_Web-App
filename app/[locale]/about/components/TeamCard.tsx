import Image from "next/image";
import { motion } from "framer-motion";


export function TeamCard({
  quote,
  image,
  name,
  role,
}: {
  quote: string;
  image: string;
  name: string;
  role: string;
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
          alt={name}
          width={80}
          height={80}
          loading="lazy"
          className="h-20 w-20 rounded-sm object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {name}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}
