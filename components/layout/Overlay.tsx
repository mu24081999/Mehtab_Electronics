"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useJourneyStore } from "@/store/useJourneyStore";
import { SCENES, SERVICE_CARDS, CONTACT_CARDS } from "@/lib/constants";
import SplitText from "@/components/ui/SplitText";
import GlassCard from "@/components/ui/GlassCard";
import MagneticButton from "@/components/ui/MagneticButton";
import SceneImage from "@/components/ui/SceneImage";

/**
 * Fixed, full-viewport text layer. Nothing here scrolls — the active world's
 * copy fades/blurs in and out as the camera arrives, driven purely by the
 * store's activeScene. Alternating alignment keeps text clear of each 3D
 * subject on desktop; mobile centers everything for readability.
 */
export default function Overlay() {
  const active = useJourneyStore((s) => s.activeScene);
  const scene = SCENES[active] ?? SCENES[0];
  const alignRight = active % 2 === 1;
  const isContact = scene.id === "contact";

  return (
    <div className="overlay-root pointer-events-none fixed inset-0 z-40 flex items-center overflow-y-auto px-4 pb-24 pt-20 sm:px-6 md:overflow-visible md:px-16 md:pb-0 md:pt-0">
      <div
        className={`overlay-content w-full max-w-2xl md:max-w-2xl ${
          alignRight
            ? "md:ml-auto md:text-right"
            : "md:mr-auto md:text-left"
        } mx-auto text-center md:mx-0 md:text-inherit`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <SceneImage
              src={scene.image}
              alt={scene.eyebrow}
              accent={scene.accent}
              alignRight={alignRight}
            />

            <motion.p
              className="eyebrow mb-3 text-[0.62rem] sm:mb-5 sm:text-[0.72rem]"
              style={{ color: scene.accent }}
              initial={{ opacity: 0, x: alignRight ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {scene.eyebrow}
            </motion.p>

            <h1 className="hero-title text-gradient mb-4 sm:mb-6">
              <SplitText text={scene.title} active delay={0.15} />
            </h1>

            <motion.p
              className="mx-auto max-w-lg text-sm leading-relaxed text-white/75 sm:text-base md:text-lg md:mx-0"
              style={{ marginLeft: alignRight ? "auto" : undefined }}
              initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {scene.copy}
            </motion.p>

            {scene.details && (
              <motion.p
                className="mx-auto mt-3 max-w-lg text-xs leading-relaxed text-white/50 sm:text-sm md:mx-0"
                style={{ marginLeft: alignRight ? "auto" : undefined }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.58, duration: 0.5 }}
              >
                {scene.details}
              </motion.p>
            )}

            {scene.features && scene.features.length > 0 && (
              <motion.ul
                className={`mt-4 flex flex-wrap gap-2 ${
                  alignRight ? "md:justify-end" : "md:justify-start"
                } justify-center`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.62, duration: 0.5 }}
              >
                {scene.features.map((f) => (
                  <li
                    key={f}
                    className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[0.65rem] text-white/65 sm:text-xs"
                  >
                    {f}
                  </li>
                ))}
              </motion.ul>
            )}

            {/* Hero CTA */}
            {active === 0 && (
              <motion.div
                className="pointer-events-auto mt-6 flex flex-wrap justify-center gap-3 sm:mt-9 md:justify-start"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <MagneticButton href="#contact">Explore Services</MagneticButton>
                <MagneticButton href={`tel:+923000000000`} className="!bg-transparent">
                  <span className="btn-fill !opacity-0" />
                  <span className="text-white/80">Call Now</span>
                </MagneticButton>
              </motion.div>
            )}

            {/* Power scene → service cards */}
            {active === 6 && (
              <div className="pointer-events-auto mt-6 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:mt-8">
                {SERVICE_CARDS.map((c, i) => (
                  <GlassCard key={c.title} glow="none" delay={0.1 * i} className="p-4 text-left">
                    <span className="text-lg" aria-hidden>
                      {c.icon}
                    </span>
                    <h3 className="mt-1 font-display text-sm font-semibold text-white">{c.title}</h3>
                    <p className="mt-1 text-xs text-white/60">{c.copy}</p>
                  </GlassCard>
                ))}
              </div>
            )}

            {/* Contact scene → contact cards + CTA */}
            {isContact && (
              <div className="pointer-events-auto mt-6 sm:mt-8">
                <div
                  className={`grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 ${
                    alignRight ? "md:justify-end" : ""
                  }`}
                >
                  {CONTACT_CARDS.map((c, i) => {
                    const inner = (
                      <>
                        <p className="eyebrow text-[0.6rem] text-white/45 sm:text-[0.72rem]">{c.label}</p>
                        <p className="mt-1 font-display text-sm text-white">{c.value}</p>
                      </>
                    );

                    return c.href ? (
                      <a key={c.label} href={c.href} data-cursor="hover" className="block">
                        <GlassCard glow="cyan" delay={0.1 * i} className="px-4 py-3 text-left sm:px-5 sm:py-4">
                          {inner}
                        </GlassCard>
                      </a>
                    ) : (
                      <GlassCard key={c.label} glow="cyan" delay={0.1 * i} className="px-4 py-3 text-left sm:px-5 sm:py-4">
                        {inner}
                      </GlassCard>
                    );
                  })}
                </div>
                <div className={`mt-5 flex justify-center sm:mt-6 ${alignRight ? "md:justify-end" : "md:justify-start"}`}>
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
