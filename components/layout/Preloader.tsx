"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useJourneyStore } from "@/store/useJourneyStore";

/** Full-screen intro veil that dissolves once the WebGL world has painted. */
export default function Preloader() {
  const ready = useJourneyStore((s) => s.ready);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (ready) {
      const t = setTimeout(() => setGone(true), 900);
      return () => clearTimeout(t);
    }
  }, [ready]);

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[color:var(--void)]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div className="text-center">
            <motion.div
              className="mx-auto mb-6 h-12 w-12 rounded-full border-2 border-white/15 border-t-[color:var(--cyan)]"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
            />
            <motion.p
              className="font-display text-xs uppercase tracking-[0.5em] text-white/60"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
            >
              Entering the universe
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
