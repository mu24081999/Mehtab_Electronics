"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, AdaptiveDpr, Preload } from "@react-three/drei";
import * as THREE from "three";
import { useJourneyStore } from "@/store/useJourneyStore";
import { COLORS } from "@/lib/constants";
import CameraRig from "@/components/three/CameraRig";
import Effects from "@/components/three/postprocessing/Effects";
import GalaxyBackground from "@/components/three/primitives/GalaxyBackground";

import SceneHero from "@/components/three/scenes/SceneHero";
import SceneCameras from "@/components/three/scenes/SceneCameras";
import SceneSecurity from "@/components/three/scenes/SceneSecurity";
import SceneSolar from "@/components/three/scenes/SceneSolar";
import SceneSmartHome from "@/components/three/scenes/SceneSmartHome";
import SceneNetworking from "@/components/three/scenes/SceneNetworking";
import ScenePower from "@/components/three/scenes/ScenePower";
import SceneContact from "@/components/three/scenes/SceneContact";

/** Marks the app "ready" once the first frame has painted (hides preloader). */
function ReadyGate() {
  const setReady = useJourneyStore((s) => s.setReady);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [setReady]);
  return null;
}

/**
 * The single, permanent WebGL canvas. It is never destroyed or replaced —
 * every planet lives inside it simultaneously, scattered across the universe,
 * and only the camera moves. A procedural HDRI (Lightformers) drives real
 * reflections on glass and metal without any network fetch.
 */
export default function Experience() {
  return (
    <div className="fixed inset-0 h-[100dvh] w-full">
      <Canvas
        shadows
        dpr={[1, 1.8]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        camera={{ fov: 52, near: 0.1, far: 420, position: [0, 3, 46] }}
      >
        <color attach="background" args={[COLORS.void]} />
        {/* Volumetric fog hides the next planet until the camera flies close. */}
        <fogExp2 attach="fog" args={[COLORS.void, 0.006]} />

        {/* The deep-space stage: starfield, spiral galaxy + drifting nebulae. */}
        <GalaxyBackground />

        {/* Cinematic key + fill lighting */}
        <ambientLight intensity={0.22} />
        <directionalLight
          position={[10, 30, 20]}
          intensity={1.0}
          color={COLORS.white}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        {/* Procedural environment for glass/metal reflections (no external HDRI) */}
        <Environment resolution={256} frames={1}>
          <Lightformer intensity={2} color={COLORS.cyan} position={[0, 5, -9]} scale={[10, 10, 1]} />
          <Lightformer intensity={1.4} color={COLORS.purple} position={[-8, 2, 4]} scale={[6, 6, 1]} />
          <Lightformer intensity={1.4} color={COLORS.emerald} position={[8, -2, 4]} scale={[6, 6, 1]} />
          <Lightformer intensity={1} color={COLORS.white} position={[0, 10, 0]} scale={[12, 3, 1]} />
        </Environment>

        <CameraRig />

        <Suspense fallback={null}>
          <SceneHero />
          <SceneCameras />
          <SceneSecurity />
          <SceneSolar />
          <SceneSmartHome />
          <SceneNetworking />
          <ScenePower />
          <SceneContact />
          <Preload all />
        </Suspense>

        <Effects />
        <AdaptiveDpr pixelated />
        <ReadyGate />
      </Canvas>
    </div>
  );
}
