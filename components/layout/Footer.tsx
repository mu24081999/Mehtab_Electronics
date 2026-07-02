"use client";

import { COMPANY, STATS } from "@/lib/constants";
import Logo from "@/components/ui/Logo";

/** Fixed footer strip — company info visible on larger screens, compact on mobile. */
export default function Footer() {
  return (
    <footer className="pointer-events-none fixed bottom-0 left-0 right-0 z-30 hidden md:block">
      <div className="flex items-end justify-between px-10 pb-8">
        <div className="pointer-events-auto max-w-sm">
          <Logo className="mb-2 opacity-80" />
          <p className="text-xs leading-relaxed text-white/45">{COMPANY.tagline}</p>
        </div>

        <div className="pointer-events-auto flex gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-right">
              <p className="font-display text-lg font-semibold text-white/90">{s.value}</p>
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="pointer-events-auto text-right text-xs text-white/40">
          <p>{COMPANY.location}</p>
          <p className="mt-1">{COMPANY.hours}</p>
        </div>
      </div>
    </footer>
  );
}
