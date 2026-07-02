"use client";

import { motion, Variants } from "framer-motion";

interface Props {
  text: string;
  active: boolean;
  className?: string;
  delay?: number;
}

const container: Variants = {
  hidden: {},
  show: (delay: number) => ({
    transition: { staggerChildren: 0.045, delayChildren: delay },
  }),
  exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
};

const char: Variants = {
  hidden: { y: "0.75em", opacity: 0, filter: "blur(14px)", rotateX: -55 },
  show: {
    y: "0em",
    opacity: 1,
    filter: "blur(0px)",
    rotateX: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { y: "-0.5em", opacity: 0, filter: "blur(10px)", transition: { duration: 0.35, ease: "easeIn" } },
};

/**
 * Cinematic per-character reveal: each glyph blurs up out of nothing with a
 * 3D flip. Lines split on "\n". Animates in when `active`, out otherwise.
 */
export default function SplitText({ text, active, className = "", delay = 0 }: Props) {
  const lines = text.split("\n");
  return (
    <motion.span
      className={className}
      style={{ display: "inline-block", perspective: 800 }}
      variants={container}
      custom={delay}
      initial="hidden"
      animate={active ? "show" : "hidden"}
    >
      {lines.map((line, li) => (
        <span key={li} style={{ display: "block", overflow: "hidden" }}>
          {Array.from(line).map((c, i) => (
            <motion.span key={i} className="split-char" variants={char}>
              {c === " " ? " " : c}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  );
}
