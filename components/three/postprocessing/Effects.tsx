"use client";

import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
  Noise,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useMemo } from "react";
import { Vector2 } from "three";
import { useJourneyStore } from "@/store/useJourneyStore";

/**
 * The film grade. Bloom for neon glow, depth-of-field for the cinematic focus
 * falloff, chromatic aberration + grain for a real-lens feel, and a vignette
 * to draw the eye inward. Disabled entirely under reduced-motion.
 */
export default function Effects() {
  const reduced = useJourneyStore((s) => s.reducedMotion);
  const caOffset = useMemo(() => new Vector2(0.0007, 0.0009), []);
  if (reduced) return null;

  return (
    <EffectComposer multisampling={2}>
      <Bloom
        intensity={1.15}
        luminanceThreshold={0.18}
        luminanceSmoothing={0.5}
        mipmapBlur
        radius={0.85}
      />
      <DepthOfField focusDistance={0.012} focalLength={0.05} bokehScale={4} height={480} />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={caOffset}
        radialModulation={false}
        modulationOffset={0}
      />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.28} />
      <Vignette eskil={false} offset={0.22} darkness={0.92} />
    </EffectComposer>
  );
}
