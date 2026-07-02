"use client";

import dynamic from "next/dynamic";

// The WebGL canvas is client-only and code-split so it never runs during SSR
// and never blocks first paint of the DOM overlays.
const Experience = dynamic(() => import("@/components/three/Experience"), {
  ssr: false,
});

export default function ExperienceLoader() {
  return <Experience />;
}
