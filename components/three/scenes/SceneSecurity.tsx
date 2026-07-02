"use client";

import { useRef, useCallback } from "react";
import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SCENES, COLORS } from "@/lib/constants";
import { brushedMetal, chrome, neon } from "@/lib/three/materials";
import Planet from "@/components/three/primitives/Planet";
import { ShaderMesh } from "@/components/three/primitives/ShaderMesh";
import { createHolographicMaterial } from "@/lib/three/shaders";
import ParticleField from "@/components/three/primitives/ParticleField";

const S = SCENES[2];

function CCTV({ position, rot }: { position: [number, number, number]; rot: number }) {
  const head = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (head.current) head.current.rotation.y = rot + Math.sin(s.clock.elapsedTime * 0.6 + rot) * 0.6;
  });
  return (
    <group position={position}>
      <group ref={head}>
        <mesh>
          <boxGeometry args={[1.6, 0.9, 0.9]} />
          <meshPhysicalMaterial {...brushedMetal("#e8edf5")} />
        </mesh>
        <mesh position={[1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.35, 0.4, 0.5, 24]} />
          <meshPhysicalMaterial {...chrome("#0a0c11")} />
        </mesh>
        <mesh position={[1.28, 0, 0]}>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshPhysicalMaterial {...neon(COLORS.cyan, 3)} />
        </mesh>
        <mesh position={[3.4, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[1.8, 6, 24, 1, true]} />
          <meshBasicMaterial color={COLORS.cyan} transparent opacity={0.12} side={THREE.DoubleSide} toneMapped={false} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}

/** Planet 3 — the surveillance world: CCTV satellites scanning, an AI hologram core. */
export default function SceneSecurity() {
  const holoFactory = useCallback(() => createHolographicMaterial(COLORS.cyan), []);
  const orbit = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (orbit.current) orbit.current.rotation.y += dt * 0.12;
  });

  return (
    <group position={S.anchor}>
      <Planet
        position={[-4, 2, -14]}
        radius={16}
        colorA="#03141c"
        colorB="#0e6b7a"
        colorC={COLORS.cyan}
        atmosphere={COLORS.cyan}
      />
      {/* wireframe scan shell over the planet */}
      <mesh position={[-4, 2, -14]}>
        <sphereGeometry args={[17.4, 24, 24]} />
        <meshBasicMaterial color={COLORS.cyan} wireframe transparent opacity={0.15} toneMapped={false} />
      </mesh>

      {/* AI hologram core in front */}
      <Float speed={1.6} floatIntensity={1} rotationIntensity={0.3}>
        <ShaderMesh factory={holoFactory} position={[0, 0, 11]} scale={2.4}>
          <icosahedronGeometry args={[1, 1]} />
        </ShaderMesh>
      </Float>

      {/* Orbiting CCTV satellites */}
      <group ref={orbit}>
        <CCTV position={[12, 4, 4]} rot={-0.4} />
        <CCTV position={[-11, -3, 6]} rot={2.4} />
        <CCTV position={[3, 9, -4]} rot={1.2} />
      </group>

      <ParticleField count={200} radius={22} height={28} color={COLORS.cyan} speed={0.3} />
      <pointLight position={[0, 6, 14]} intensity={26} color={COLORS.cyan} distance={44} />
      <pointLight position={[-10, 4, 4]} intensity={14} color={COLORS.blue} distance={36} />
    </group>
  );
}
