"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useJourneyStore } from "@/store/useJourneyStore";
import { SCENES, SERVICE_CARDS, CONTACT_CARDS } from "@/lib/constants";
import SplitText from "@/components/ui/SplitText";
import GlassCard from "@/components/ui/GlassCard";
import MagneticButton from "@/components/ui/MagneticButton";

/**
 * Fixed, full-viewport text layer. Nothing here scrolls — the active world's
 * copy fades/blurs in and out as the camera arrives, driven purely by the
 * store's activeScene. Alternating alignment keeps text clear of each 3D
 * subject.
 */
export default function Overlay() {
  const active = useJourneyStore((s) => s.activeScene);
  const scene = SCENES[active] ?? SCENES[0];
  const alignRight = active % 2 === 1;
  const isContact = scene.id === "contact";

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-center px-6 md:px-16">
      <div
        className={`w-full max-w-2xl ${alignRight ? "ml-auto text-right" : "mr-auto text-left"}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.p
              className="eyebrow mb-5"
              style={{ color: scene.accent }}
              initial={{ opacity: 0, x: alignRight ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {scene.eyebrow}
            </motion.p>

            <h1 className="hero-title text-gradient mb-6">
              <SplitText text={scene.title} active delay={0.15} />
            </h1>

            <motion.p
              className="max-w-lg text-base leading-relaxed text-white/70 md:text-lg"
              style={{ marginLeft: alignRight ? "auto" : 0 }}
              initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {scene.copy}
            </motion.p>

            {/* Hero CTA */}
            {active === 0 && (
              <motion.div
                className="pointer-events-auto mt-9 flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <MagneticButton href="#contact">Explore the Universe</MagneticButton>
              </motion.div>
            )}

            {/* Power scene → service cards */}
            {active === 6 && (
              <div className="pointer-events-auto mt-8 grid grid-cols-2 gap-3">
                {SERVICE_CARDS.map((c, i) => (
                  <GlassCard key={c.title} glow="none" delay={0.1 * i} className="p-4 text-left">
                    <h3 className="font-display text-sm font-semibold text-white">{c.title}</h3>
                    <p className="mt-1 text-xs text-white/60">{c.copy}</p>
                  </GlassCard>
                ))}
              </div>
            )}

            {/* Contact scene → contact cards + CTA */}
            {isContact && (
              <div className="pointer-events-auto mt-8">
                <div className={`flex flex-wrap gap-3 ${alignRight ? "justify-end" : ""}`}>
                  {CONTACT_CARDS.map((c, i) => (
                    <GlassCard key={c.label} glow="cyan" delay={0.1 * i} className="px-5 py-4 text-left">
                      <p className="eyebrow text-white/45">{c.label}</p>
                      <p className="mt-1 font-display text-sm text-white">{c.value}</p>
                    </GlassCard>
                  ))}
                </div>
                <div className={`mt-6 flex ${alignRight ? "justify-end" : ""}`}>
                  <MagneticButton href="mailto:info@mehtabelectronics.com">
                    Start a Project
                  </MagneticButton>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
