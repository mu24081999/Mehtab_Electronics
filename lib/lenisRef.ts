import type Lenis from "lenis";

// Shared handle to the single Lenis instance so the navigation can drive
// smooth programmatic scrolls (scene jumps) through the same engine.
export const lenisRef: { current: Lenis | null } = { current: null };
