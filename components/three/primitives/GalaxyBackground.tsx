"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { COLORS } from "@/lib/constants";

// A soft radial sprite used for nebula clouds.
function useGlowTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(255,255,255,0.9)");
    g.addColorStop(0.25, "rgba(255,255,255,0.35)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }, []);
}

/** Procedural spiral galaxy — points swirling from a hot core out to cool arms. */
function SpiralGalaxy() {
  const points = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 14000;
    const branches = 4;
    const radiusMax = 120;
    const spin = 1.1;
    const randomness = 0.35;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const inside = new THREE.Color(COLORS.amber);
    const outside = new THREE.Color(COLORS.purple);
    const mid = new THREE.Color(COLORS.cyan);
    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 1.6) * radiusMax;
      const branch = ((i % branches) / branches) * Math.PI * 2;
      const angle = branch + r * spin * 0.05;
      const spread = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
      positions[i * 3] = Math.cos(angle) * r + spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * (2 + r * 0.05);
      positions[i * 3 + 2] = Math.sin(angle) * r + spread;
      const c = inside.clone();
      c.lerp(mid, Math.min((r / radiusMax) * 1.6, 1));
      c.lerp(outside, Math.max((r / radiusMax - 0.4) / 0.6, 0));
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, []);

  useFrame((_, dt) => {
    if (points.current) points.current.rotation.y += dt * 0.015;
  });

  return (
    <points ref={points} rotation={[Math.PI * 0.46, 0, 0.25]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.6}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        fog={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Drifting nebula clouds spaced along the flight corridor (camera flies past them). */
function Nebulae() {
  const tex = useGlowTexture();
  const clouds = useMemo(
    () => [
      { pos: [-70, 30, -80], color: COLORS.purple, scale: 150 },
      { pos: [90, -30, -300], color: COLORS.cyan, scale: 170 },
      { pos: [-80, 40, -520], color: COLORS.magenta, scale: 150 },
      { pos: [80, -20, -740], color: COLORS.emerald, scale: 160 },
      { pos: [0, 50, -930], color: COLORS.amber, scale: 180 },
    ],
    []
  );
  return (
    <group>
      {clouds.map((c, i) => (
        <sprite key={i} position={c.pos as [number, number, number]} scale={[c.scale, c.scale, 1]}>
          <spriteMaterial
            map={tex}
            color={c.color}
            transparent
            opacity={0.2}
            depthWrite={false}
            fog={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  );
}

/**
 * The deep-space stage. The starfield recentres on the camera every frame so
 * the void feels infinite; the galaxy hangs far ahead down the corridor as a
 * slowly turning destination; nebulae are scattered along the route so the
 * camera visibly flies past them between planets.
 */
export default function GalaxyBackground() {
  const sky = useRef<THREE.Group>(null);
  const galaxy = useRef<THREE.Group>(null);

  useFrame(({ camera }) => {
    if (sky.current) sky.current.position.copy(camera.position);
    if (galaxy.current) {
      // Always far ahead down the flight path — a destination never reached.
      galaxy.current.position.set(camera.position.x * 0.3, camera.position.y + 12, camera.position.z - 240);
    }
  });

  return (
    <group>
      <group ref={sky}>
        <Stars radius={300} depth={140} count={8000} factor={6} saturation={0.4} fade speed={0.4} />
      </group>
      <group ref={galaxy}>
        <SpiralGalaxy />
      </group>
      <Nebulae />
    </group>
  );
}
