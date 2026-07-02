"use client";

import { useRef, useMemo } from "react";
import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SCENES, COLORS } from "@/lib/constants";
import { frosted, chrome, neon } from "@/lib/three/materials";
import Planet from "@/components/three/primitives/Planet";
import ParticleField from "@/components/three/primitives/ParticleField";

const S = SCENES[7];

/** Planet 8 — the destination: a holographic homeworld ringed by control consoles. */
export default function SceneContact() {
  const rings = useRef<THREE.Group>(null);
  const consolesGroup = useRef<THREE.Group>(null);

  const consoles = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2;
        const r = 13;
        return { pos: [Math.cos(a) * r, Math.sin(a) * 3, 8 + Math.sin(a) * 4] as [number, number, number], rot: -a };
      }),
    []
  );

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (rings.current) {
      rings.current.rotation.x = t * 0.15;
      rings.current.rotation.z = t * 0.08;
    }
    if (consolesGroup.current) consolesGroup.current.rotation.y = t * 0.1;
  });

  return (
    <group position={S.anchor}>
      <Planet
        position={[0, 0, -12]}
        radius={16}
        colorA="#03231a"
        colorB="#127a63"
        colorC={COLORS.emerald}
        atmosphere={COLORS.emerald}
      />
      {/* Holographic wireframe over the homeworld */}
      <mesh position={[0, 0, -12]}>
        <sphereGeometry args={[16.6, 40, 40]} />
        <meshBasicMaterial color={COLORS.emerald} wireframe transparent opacity={0.2} toneMapped={false} />
      </mesh>

      {/* Orbit rings + a satellite */}
      <group ref={rings} position={[0, 0, -12]}>
        {[20, 23].map((r, i) => (
          <mesh key={i} rotation={[Math.PI / 2 + i * 0.4, i * 0.3, 0]}>
            <torusGeometry args={[r, 0.04, 8, 120]} />
            <meshBasicMaterial color={COLORS.cyan} toneMapped={false} transparent opacity={0.5} />
          </mesh>
        ))}
        <mesh position={[20, 0, 0]}>
          <boxGeometry args={[0.6, 0.3, 0.3]} />
          <meshPhysicalMaterial {...neon(COLORS.white, 2)} />
        </mesh>
      </group>

      {/* Curved control consoles orbiting in front */}
      <group ref={consolesGroup}>
        {consoles.map((c, i) => (
          <Float key={i} speed={1.2} floatIntensity={0.6}>
            <group position={c.pos} rotation={[0, c.rot, 0]}>
              <mesh rotation={[-0.5, 0, 0]}>
                <boxGeometry args={[3.4, 2, 0.14]} />
                <meshPhysicalMaterial {...frosted("#9fe9d6")} />
              </mesh>
              <mesh position={[0, -1.2, 0.5]}>
                <boxGeometry args={[3.6, 0.28, 1.4]} />
                <meshPhysicalMaterial {...chrome("#1a2230")} />
              </mesh>
            </group>
          </Float>
        ))}
      </group>

      <ParticleField count={300} radius={24} height={30} color={COLORS.emerald} speed={0.4} />
      <pointLight position={[0, 8, 14]} intensity={30} color={COLORS.emerald} distance={54} />
      <pointLight position={[-10, 0, 6]} intensity={16} color={COLORS.cyan} distance={40} />
    </group>
  );
}
