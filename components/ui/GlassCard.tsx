"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  className?: string;
  glow?: "cyan" | "purple" | "none";
  delay?: number;
}

/** Liquid-acrylic card: refraction film, moving light streak, animated border. */
export default function GlassCard({ children, className = "", glow = "cyan", delay = 0 }: Props) {
  const glowClass = glow === "cyan" ? "glass-glow-cyan" : glow === "purple" ? "glass-glow-purple" : "";
  return (
    <motion.div
      className="glass-border"
      initial={{ opacity: 0, y: 28, filter: "blur(14px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.015 }}
    >
      <div className={`glass ${glowClass} ${className}`} data-cursor="hover">
        {children}
      </div>
    </motion.div>
  );
}
