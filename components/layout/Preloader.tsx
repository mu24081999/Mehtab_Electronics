"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useJourneyStore } from "@/store/useJourneyStore";
import Logo from "@/components/ui/Logo";

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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex justify-center"
            >
              <Logo priority />
            </motion.div>
            <motion.div
              className="mx-auto mb-6 h-10 w-10 rounded-full border-2 border-white/15 border-t-[color:var(--cyan)] sm:h-12 sm:w-12"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
            />
            <motion.p
              className="font-display text-[0.65rem] uppercase tracking-[0.4em] text-white/60 sm:text-xs sm:tracking-[0.5em]"
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
