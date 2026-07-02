"use client";

import { useMemo, useRef } from "react";
import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SCENES, COLORS } from "@/lib/constants";
import { chrome, brushedMetal } from "@/lib/three/materials";
import Planet from "@/components/three/primitives/Planet";
import EnergyCore from "@/components/three/primitives/EnergyCore";
import ElectricArc from "@/components/three/primitives/ElectricArc";
import ParticleField from "@/components/three/primitives/ParticleField";

const S = SCENES[0];

/** Planet 1 — the reactor core world: a glowing energy core orbited by chips. */
export default function SceneHero() {
  const orbit = useRef<THREE.Group>(null);
  const chips = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const r = 20 + (i % 3) * 2.5;
        return { a, r, y: (i % 4) * 2 - 3, s: 0.8 + (i % 3) * 0.4 };
      }),
    []
  );

  useFrame((_, dt) => {
    if (orbit.current) orbit.current.rotation.y += dt * 0.08;
  });

  return (
    <group position={S.anchor}>
      <Planet
        position={[0, 0, -10]}
        radius={17}
        colorA="#06122e"
        colorB="#2f6bff"
        colorC={COLORS.cyan}
        atmosphere={COLORS.cyan}
        ring
        ringColor={COLORS.cyan}
      />

      {/* Reactor core hovering in front of the planet */}
      <Float speed={2} floatIntensity={1.4} rotationIntensity={0.3}>
        <EnergyCore position={[0, 1, 12]} scale={1.5} color={COLORS.blue} color2={COLORS.cyan} />
      </Float>

      {/* Orbiting chips / components */}
      <group ref={orbit}>
        {chips.map((c, i) => (
          <group key={i} position={[Math.cos(c.a) * c.r, c.y, Math.sin(c.a) * c.r]}>
            <mesh>
              <boxGeometry args={[c.s * 1.6, c.s * 0.4, c.s * 1.6]} />
              <meshPhysicalMaterial {...brushedMetal(i % 2 ? "#10151f" : "#1b2233")} />
            </mesh>
            <mesh position={[0, c.s * 0.28, 0]}>
              <boxGeometry args={[c.s, 0.06, c.s]} />
              <meshPhysicalMaterial {...chrome(COLORS.cyan)} />
            </mesh>
          </group>
        ))}
      </group>

      <ElectricArc from={[0, 1, 12]} to={[13, 2, 4]} color={COLORS.cyan} />
      <ElectricArc from={[0, 1, 12]} to={[-12, -2, 6]} color={COLORS.blue} jitter={1.1} />

      <ParticleField count={260} radius={26} height={30} centerY={0} color={COLORS.cyan} speed={0.4} />
      <pointLight position={[0, 6, 16]} intensity={30} color={COLORS.cyan} distance={44} />
    </group>
  );
}
