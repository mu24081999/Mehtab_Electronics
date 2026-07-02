"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useJourneyStore } from "@/store/useJourneyStore";
import { sceneAtProgress } from "@/lib/three/cameraPath";
import { lenisRef } from "@/lib/lenisRef";
import { usePointer } from "@/hooks/usePointer";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * Replaces native scroll entirely. Lenis smooths the wheel into inertial
 * motion; GSAP's ticker drives Lenis's rAF so both share one clock; every
 * tick we publish 0..1 progress + velocity + active scene to the store, which
 * the fixed WebGL canvas and the DOM overlays read from. No element is ever
 * translated by scroll — only numbers change, and the camera reads them.
 */
export default function SmoothScroll() {
  const setProgress = useJourneyStore((s) => s.setProgress);
  const setActiveScene = useJourneyStore((s) => s.setActiveScene);

  usePointer();
  useReducedMotion();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lenis = new Lenis({
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduced,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.5,
      // Lower lerp = longer, floatier glide — the "voyaging through space" feel.
      lerp: reduced ? 1 : 0.055,
      syncTouch: true,
    });
    lenisRef.current = lenis;

    let lastScene = -1;
    const onScroll = () => {
      const progress = clamp01(lenis.progress ?? 0);
      const velocity = lenis.velocity ?? 0;
      setProgress(progress, velocity * 0.01);
      const scene = sceneAtProgress(progress);
      if (scene !== lastScene) {
        lastScene = scene;
        setActiveScene(scene);
      }
      ScrollTrigger.update();
    };
    lenis.on("scroll", onScroll);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    requestAnimationFrame(onScroll);
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
      window.removeEventListener("resize", onResize);
      lenisRef.current = null;
      lenis.destroy();
    };
  }, [setProgress, setActiveScene]);

  return null;
}

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
