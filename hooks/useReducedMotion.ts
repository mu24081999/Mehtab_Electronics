"use client";

import { useEffect } from "react";
import { useJourneyStore } from "@/store/useJourneyStore";

/** Syncs the OS "reduce motion" preference into the global store. */
export function useReducedMotion() {
  const setReducedMotion = useJourneyStore((s) => s.setReducedMotion);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [setReducedMotion]);
}
