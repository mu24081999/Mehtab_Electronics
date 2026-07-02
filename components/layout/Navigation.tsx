"use client";

import { useJourneyStore } from "@/store/useJourneyStore";
import { SCENES } from "@/lib/constants";
import { lenisRef } from "@/lib/lenisRef";
import Logo from "@/components/ui/Logo";

/** Floating liquid-glass rail: a dot per world, active one highlighted, with a live progress spine. */
export default function Navigation() {
  const activeScene = useJourneyStore((s) => s.activeScene);
  const progress = useJourneyStore((s) => s.progress);

  const jump = (i: number) => {
    const lenis = lenisRef.current;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const target = (i / (SCENES.length - 1)) * max;
    if (lenis) lenis.scrollTo(target, { duration: 1.6 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <>
      {/* Brand */}
      <div className="fixed left-4 top-4 z-50 sm:left-6 sm:top-6 md:left-10 md:top-8">
        <Logo priority />
      </div>

      {/* Scene rail — desktop only */}
      <nav
        className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 md:block md:right-8"
        aria-label="Desktop scene navigation"
      >
        <div className="glass flex flex-col items-center gap-4 rounded-full px-3 py-5">
          {SCENES.map((s, i) => {
            const active = i === activeScene;
            return (
              <button
                key={s.id}
                onClick={() => jump(i)}
                data-cursor="hover"
                className="group relative flex items-center"
                aria-label={s.navLabel}
                aria-current={active ? "true" : undefined}
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    active
                      ? "h-3 w-3 bg-[color:var(--cyan)] shadow-[0_0_16px_var(--cyan)]"
                      : "h-1.5 w-1.5 bg-white/35 group-hover:bg-white/70"
                  }`}
                />
                <span
                  className={`pointer-events-none absolute right-6 whitespace-nowrap font-display text-[0.7rem] uppercase tracking-[0.24em] transition-all duration-300 ${
                    active ? "opacity-100 text-white" : "opacity-0 translate-x-2 group-hover:opacity-70"
                  }`}
                >
                  {s.navLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Progress spine */}
      <div className="fixed bottom-[4.5rem] left-4 z-50 flex items-center gap-2 sm:bottom-8 sm:left-6 sm:gap-3 md:left-10">
        <div className="h-[1px] w-16 overflow-hidden bg-white/15 sm:w-28">
          <div
            className="h-full bg-gradient-to-r from-[color:var(--cyan)] to-[color:var(--purple)]"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="font-display text-[0.65rem] tracking-[0.2em] text-white/60 sm:text-[0.7rem]">
          {String(Math.round(progress * 100)).padStart(2, "0")}%
        </span>
      </div>
    </>
  );
}
