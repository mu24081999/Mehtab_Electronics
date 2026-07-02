"use client";

import { useRef } from "react";
import { Float, Text, Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SCENES, COLORS } from "@/lib/constants";
import { brushedMetal, chrome, glass } from "@/lib/three/materials";
import Planet from "@/components/three/primitives/Planet";
import ParticleField from "@/components/three/primitives/ParticleField";

const S = SCENES[1];
const SETTINGS = ["ISO 100", "f/1.2", "1/8000s", "RAW", "4K 120p", "AF-C"];

/** Planet 2 — the imaging world: a giant DSLR whose lens blooms open, in orbit. */
export default function SceneCameras() {
  const lens = useRef<THREE.Group>(null);
  const settings = useRef<THREE.Group>(null);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (lens.current) {
      lens.current.rotation.z = t * 0.25;
      lens.current.position.z = 3 + Math.sin(t * 0.8) * 0.4;
    }
    if (settings.current) settings.current.rotation.y = t * 0.3;
  });

  return (
    <group position={S.anchor}>
      <Planet
        position={[6, -2, -14]}
        radius={15}
        colorA="#160a30"
        colorB="#5b3bd6"
        colorC={COLORS.purple}
        atmosphere={COLORS.purple}
      />

      {/* DSLR floating in front */}
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.8}>
        <group position={[-2, 1, 10]} rotation={[0, 0.5, 0]} scale={0.9}>
          <mesh castShadow>
            <boxGeometry args={[6, 4, 3]} />
            <meshPhysicalMaterial {...brushedMetal("#14161c")} />
          </mesh>
          <mesh position={[0, 2.4, 0]}>
            <boxGeometry args={[2.4, 1.2, 2.4]} />
            <meshPhysicalMaterial {...brushedMetal("#1b1e26")} />
          </mesh>
          <mesh position={[-3.2, -0.3, 0]}>
            <boxGeometry args={[1.2, 3.2, 3]} />
            <meshPhysicalMaterial {...brushedMetal("#0d0f14")} />
          </mesh>
          <group ref={lens} position={[0, 0, 3]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[2.4, 2.1, 3.2, 64]} />
              <meshPhysicalMaterial {...brushedMetal("#0a0c11")} />
            </mesh>
            {[2.2, 1.7, 1.2, 0.7].map((r, i) => (
              <mesh key={i} position={[0, 0, 1.6 + i * 0.05]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[r, 0.12, 16, 80]} />
                <meshPhysicalMaterial {...chrome(i % 2 ? "#d7def0" : "#7f8aa2")} />
              </mesh>
            ))}
            <mesh position={[0, 0, 1.8]}>
              <sphereGeometry args={[2, 48, 48, 0, Math.PI * 2, 0, Math.PI / 2.4]} />
              <meshPhysicalMaterial {...glass("#bfe9ff")} />
            </mesh>
            <mesh position={[0, 0, 1.5]}>
              <ringGeometry args={[0.5, 1.9, 48]} />
              <meshBasicMaterial color={COLORS.purple} toneMapped={false} transparent opacity={0.4} side={THREE.DoubleSide} />
            </mesh>
          </group>
        </group>
      </Float>

      {/* Orbiting camera settings */}
      <group ref={settings} position={[-2, 1, 8]}>
        {SETTINGS.map((label, i) => {
          const a = (i / SETTINGS.length) * Math.PI * 2;
          const r = 8;
          return (
            <Billboard key={label} position={[Math.cos(a) * r, Math.sin(a) * 2.4, Math.sin(a) * r]}>
              <Text fontSize={0.7} color={COLORS.purple} anchorX="center" anchorY="middle" outlineWidth={0.01} outlineColor={COLORS.white}>
                {label}
              </Text>
            </Billboard>
          );
        })}
      </group>

      <ParticleField count={200} radius={20} height={26} color={COLORS.purple} speed={0.4} />
      <pointLight position={[-4, 4, 12]} intensity={26} color={COLORS.purple} distance={40} />
      <spotLight position={[0, 12, 10]} angle={0.5} penumbra={1} intensity={50} color={COLORS.white} distance={50} />
    </group>
  );
}
