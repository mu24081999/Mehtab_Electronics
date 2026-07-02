"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface Props {
  src: string;
  alt: string;
  accent: string;
  alignRight?: boolean;
}

/** Contextual service illustration with glass frame and accent glow. */
export default function SceneImage({ src, alt, accent, alignRight = false }: Props) {
  return (
    <motion.div
      className={`pointer-events-none mb-5 mx-auto w-full max-w-[220px] sm:max-w-[260px] md:mb-5 md:max-w-[300px] ${
        alignRight ? "md:ml-auto md:mr-0" : "md:mr-auto md:ml-0"
      }`}
      initial={{ opacity: 0, scale: 0.92, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="glass-border overflow-hidden rounded-2xl"
        style={{ boxShadow: `0 0 40px -12px ${accent}55` }}
      >
        <div className="glass p-1.5">
          <div className="relative aspect-[10/7] w-full overflow-hidden rounded-xl bg-[color:var(--void-soft)]">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 640px) 220px, (max-width: 768px) 260px, 300px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
