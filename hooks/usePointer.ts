"use client";

import { useEffect } from "react";
import { useJourneyStore } from "@/store/useJourneyStore";

/**
 * Tracks the pointer once, globally. Writes both a normalized -1..1 value
 * (for 3D parallax) and raw pixel coordinates (for the DOM cursor) into the
 * store. Mounted a single time near the app root.
 */
export function usePointer() {
  const setPointer = useJourneyStore((s) => s.setPointer);
  const setMouse = useJourneyStore((s) => s.setMouse);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      setPointer(nx, ny);
      setMouse(e.clientX, e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [setPointer, setMouse]);
}
