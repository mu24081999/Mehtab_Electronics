"use client";

import { useMemo, useRef } from "react";
import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SCENES, COLORS } from "@/lib/constants";
import { solarGlass, brushedMetal, chrome } from "@/lib/three/materials";
import Planet from "@/components/three/primitives/Planet";
import DataStream from "@/components/three/primitives/DataStream";
import ParticleField from "@/components/three/primitives/ParticleField";

const S = SCENES[3];

function Battery({ position, level }: { position: [number, number, number]; level: number }) {
  const glow = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((s) => {
    if (glow.current) glow.current.opacity = 0.5 + Math.sin(s.clock.elapsedTime * 2 + level) * 0.3;
  });
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.9, 0.9, 3, 32]} />
        <meshPhysicalMaterial {...brushedMetal("#1a2030")} />
      </mesh>
      <mesh position={[0, 1.65, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.4, 24]} />
        <meshPhysicalMaterial {...chrome("#c9d3e6")} />
      </mesh>
      <mesh position={[0, -1.5 + level * 1.5, 0]}>
        <cylinderGeometry args={[0.92, 0.92, level * 3, 32]} />
        <meshBasicMaterial ref={glow} color={COLORS.emerald} transparent opacity={0.6} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Planet 4 — the solar world: a panel array in orbit feeding glowing batteries. */
export default function SceneSolar() {
  const array = useRef<THREE.Group>(null);
  const panels = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      arr.push([Math.cos(a) * 21, Math.sin(a) * 6, Math.sin(a) * 21]);
    }
    return arr;
  }, []);

  const flow = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-6, -2, 8),
        new THREE.Vector3(0, 2, 12),
        new THREE.Vector3(6, 0, 9),
        new THREE.Vector3(9, -2, 6),
      ]),
    []
  );

  useFrame((_, dt) => {
    if (array.current) array.current.rotation.y += dt * 0.06;
  });

  return (
    <group position={S.anchor}>
      <Planet
        position={[-6, 0, -14]}
        radius={16}
        colorA="#1c1103"
        colorB="#c77a1e"
        colorC={COLORS.amber}
        atmosphere={COLORS.amber}
        ring
        ringColor={COLORS.amber}
        lightDir={[1, 0.3, 0.4]}
      />

      {/* Orbiting solar array */}
      <group ref={array}>
        {panels.map((p, i) => (
          <group key={i} position={p} rotation={[-0.5, i, 0]}>
            <mesh>
              <boxGeometry args={[3, 0.12, 2.2]} />
              <meshPhysicalMaterial {...solarGlass()} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Charging batteries in front */}
      <Float speed={1.5} floatIntensity={0.9}>
        <group position={[6, -1, 9]}>
          <Battery position={[0, 0, 0]} level={0.8} />
          <Battery position={[2.4, 0, -0.5]} level={0.6} />
          <Battery position={[1.2, 0, 2]} level={0.95} />
        </group>
      </Float>

      <DataStream curve={flow} count={24} color={COLORS.emerald} size={0.22} speed={0.35} />

      <directionalLight position={[-16, 6, 8]} intensity={2.2} color="#fff2d8" />
      <ParticleField count={200} radius={22} height={28} color={COLORS.amber} speed={0.4} />
      <pointLight position={[0, 6, 14]} intensity={26} color={COLORS.amber} distance={44} />
    </group>
  );
}
