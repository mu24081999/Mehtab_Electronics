"use client";

import { useJourneyStore } from "@/store/useJourneyStore";
import { SCENES } from "@/lib/constants";
import { lenisRef } from "@/lib/lenisRef";

/** Horizontal scene picker for phones — hidden on md+ where the side rail shows. */
export default function MobileNav() {
  const activeScene = useJourneyStore((s) => s.activeScene);

  const jump = (i: number) => {
    const lenis = lenisRef.current;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const target = (i / (SCENES.length - 1)) * max;
    if (lenis) lenis.scrollTo(target, { duration: 1.2 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[color:var(--void)]/85 px-3 py-2 backdrop-blur-xl md:hidden"
      aria-label="Scene navigation"
    >
      <div className="flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SCENES.map((s, i) => {
          const active = i === activeScene;
          return (
            <button
              key={s.id}
              onClick={() => jump(i)}
              data-cursor="hover"
              className={`shrink-0 rounded-full px-3 py-1.5 font-display text-[0.62rem] uppercase tracking-[0.18em] transition-all duration-300 ${
                active
                  ? "bg-[color:var(--cyan)]/20 text-white shadow-[0_0_12px_rgba(34,211,238,0.35)]"
                  : "bg-white/5 text-white/55 active:bg-white/10"
              }`}
              aria-current={active ? "true" : undefined}
            >
              {s.navLabel}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
