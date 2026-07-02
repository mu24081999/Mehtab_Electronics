import { create } from "zustand";

// Single global source of truth for "where are we in the ride".
// The Lenis scroll listener writes progress every frame; the camera rig,
// navigation, overlays and scenes all read from it. Using a plain zustand
// store (not React context) lets the R3F render loop read the latest value
// with getState() inside useFrame without forcing a React re-render per tick.
interface JourneyState {
  /** 0 -> 1 across the whole scroll length. */
  progress: number;
  /** Instantaneous scroll velocity (px/frame-ish), used for camera shake / FOV. */
  velocity: number;
  /** Active scene index for nav + overlay highlighting. */
  activeScene: number;
  /** Normalized -1..1 pointer, used for parallax + cursor. */
  pointer: { x: number; y: number };
  /** Raw pixel pointer for the DOM cursor. */
  mouse: { x: number; y: number };
  reducedMotion: boolean;
  /** Preloader complete + first frame painted. */
  ready: boolean;
  setProgress: (progress: number, velocity: number) => void;
  setActiveScene: (i: number) => void;
  setPointer: (x: number, y: number) => void;
  setMouse: (x: number, y: number) => void;
  setReducedMotion: (v: boolean) => void;
  setReady: (v: boolean) => void;
}

export const useJourneyStore = create<JourneyState>((set) => ({
  progress: 0,
  velocity: 0,
  activeScene: 0,
  pointer: { x: 0, y: 0 },
  mouse: { x: -100, y: -100 },
  reducedMotion: false,
  ready: false,
  setProgress: (progress, velocity) => set({ progress, velocity }),
  setActiveScene: (activeScene) => set({ activeScene }),
  setPointer: (x, y) => set({ pointer: { x, y } }),
  setMouse: (x, y) => set({ mouse: { x, y } }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setReady: (ready) => set({ ready }),
}));
