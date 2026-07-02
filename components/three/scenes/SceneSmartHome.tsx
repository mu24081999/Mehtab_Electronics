"use client";

import { useMemo, useRef } from "react";
import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SCENES, COLORS } from "@/lib/constants";
import { glass, frosted, neon } from "@/lib/three/materials";
import Planet from "@/components/three/primitives/Planet";
import ParticleField from "@/components/three/primitives/ParticleField";
import DataStream from "@/components/three/primitives/DataStream";

const S = SCENES[4];

/** Planet 5 — the smart-home world: a floating glass house wired to orbiting devices. */
export default function SceneSmartHome() {
  const nodes = useRef<THREE.Group>(null);

  const devices = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const r = 8 + (i % 3);
        return {
          base: [Math.cos(a) * r, (i % 4) * 1.6 - 2.4, 10 + Math.sin(a) * r] as [number, number, number],
          color: [COLORS.magenta, COLORS.cyan, COLORS.purple][i % 3],
        };
      }),
    []
  );

  const links = useMemo(
    () =>
      devices.map(
        (d) =>
          new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 10),
            new THREE.Vector3(d.base[0] * 0.5, d.base[1] * 0.5, 10 + (d.base[2] - 10) * 0.5),
            new THREE.Vector3(...d.base),
          ])
      ),
    [devices]
  );

  useFrame((_, dt) => {
    if (nodes.current) nodes.current.rotation.y += dt * 0.12;
  });

  return (
    <group position={S.anchor}>
      <Planet
        position={[5, 0, -14]}
        radius={15}
        colorA="#22052a"
        colorB="#a12a95"
        colorC={COLORS.magenta}
        atmosphere={COLORS.magenta}
      />

      {/* Floating glass house */}
      <Float speed={1.4} floatIntensity={1.1} rotationIntensity={0.2}>
        <group position={[0, 0, 10]}>
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[4, 3, 4]} />
            <meshPhysicalMaterial {...glass("#d7c8ff")} />
          </mesh>
          <mesh position={[0, 1.8, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[3.4, 2, 4]} />
            <meshPhysicalMaterial {...frosted("#c9b8ff")} />
          </mesh>
          <pointLight position={[0, 0, 0]} intensity={14} color={COLORS.magenta} distance={12} />
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[1.6, 1.6, 1.6]} />
            <meshPhysicalMaterial {...neon(COLORS.magenta, 1.5)} />
          </mesh>
        </group>
      </Float>

      <group ref={nodes}>
        {devices.map((d, i) => (
          <group key={i}>
            <Float speed={2} floatIntensity={0.8}>
              <mesh position={d.base}>
                <icosahedronGeometry args={[0.5, 0]} />
                <meshPhysicalMaterial {...neon(d.color, 2.2)} />
              </mesh>
            </Float>
            <DataStream curve={links[i]} count={8} color={d.color} size={0.12} speed={0.4} />
          </group>
        ))}
      </group>

      <ParticleField count={180} radius={18} height={26} color={COLORS.magenta} speed={0.35} />
      <pointLight position={[8, 6, 12]} intensity={24} color={COLORS.purple} distance={40} />
    </group>
  );
}
