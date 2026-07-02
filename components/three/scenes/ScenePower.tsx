"use client";

import { useRef } from "react";
import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SCENES, COLORS } from "@/lib/constants";
import { brushedMetal, chrome, neon } from "@/lib/three/materials";
import Planet from "@/components/three/primitives/Planet";
import ElectricArc from "@/components/three/primitives/ElectricArc";
import ParticleField from "@/components/three/primitives/ParticleField";

const S = SCENES[6];

function Coil({ position }: { position: [number, number, number] }) {
  const orb = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (orb.current) {
      const m = orb.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.7 + Math.sin(s.clock.elapsedTime * 8 + position[0]) * 0.3;
    }
  });
  return (
    <group position={position}>
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.8, 1, 3, 24]} />
        <meshPhysicalMaterial {...brushedMetal("#1a1e28")} />
      </mesh>
      <mesh position={[0, 1.4, 0]}>
        <torusGeometry args={[0.9, 0.35, 20, 40]} />
        <meshPhysicalMaterial {...chrome("#c9d3e6")} />
      </mesh>
      <mesh ref={orb} position={[0, 1.4, 0]}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshBasicMaterial color={COLORS.amber} toneMapped={false} transparent />
      </mesh>
      <pointLight position={[0, 1.4, 0]} intensity={16} color={COLORS.amber} distance={16} />
    </group>
  );
}

/** Planet 7 — the power world: coils firing arcs around an industrial battery bank. */
export default function ScenePower() {
  const bank = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (bank.current) bank.current.rotation.y += dt * 0.2;
  });

  return (
    <group position={S.anchor}>
      <Planet
        position={[5, 0, -14]}
        radius={15}
        colorA="#241403"
        colorB="#c77a1e"
        colorC={COLORS.amber}
        atmosphere={COLORS.amber}
      />

      {/* Coils arranged in front, firing arcs */}
      <Coil position={[-7, 0, 10]} />
      <Coil position={[7, 0, 10]} />
      <Coil position={[0, 0, 15]} />

      <ElectricArc from={[-7, 1.4, 10]} to={[7, 1.4, 10]} color={COLORS.amber} jitter={1.4} segments={20} />
      <ElectricArc from={[-7, 1.4, 10]} to={[0, 1.4, 15]} color={COLORS.cyan} jitter={1.2} segments={18} />
      <ElectricArc from={[7, 1.4, 10]} to={[0, 1.4, 15]} color={COLORS.purple} jitter={1.2} segments={18} />

      {/* Industrial battery bank */}
      <Float speed={1.2} floatIntensity={0.7}>
        <group ref={bank} position={[0, 3.5, 9]}>
          {[-1.4, 0, 1.4].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]}>
              <boxGeometry args={[1.1, 2, 1.1]} />
              <meshPhysicalMaterial {...brushedMetal("#1c2230")} />
            </mesh>
          ))}
          {[-1.4, 0, 1.4].map((x, i) => (
            <mesh key={`t${i}`} position={[x, 1.1, 0]}>
              <boxGeometry args={[1.15, 0.2, 1.15]} />
              <meshPhysicalMaterial {...neon(COLORS.emerald, 1.5)} />
            </mesh>
          ))}
        </group>
      </Float>

      <ParticleField count={200} radius={20} height={28} color={COLORS.amber} speed={0.4} />
      <pointLight position={[0, 6, 16]} intensity={26} color={COLORS.amber} distance={44} />
      <pointLight position={[-8, 2, 8]} intensity={14} color={COLORS.purple} distance={36} />
    </group>
  );
}
