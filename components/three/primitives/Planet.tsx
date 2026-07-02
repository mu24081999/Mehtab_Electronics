"use client";

import { useRef, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ShaderMesh } from "./ShaderMesh";
import { createPlanetMaterial, createFresnelMaterial } from "@/lib/three/shaders";

interface Props {
  position?: [number, number, number];
  radius?: number;
  colorA?: string;
  colorB?: string;
  colorC?: string;
  atmosphere?: string;
  ring?: boolean;
  ringColor?: string;
  spin?: number;
  lightDir?: [number, number, number];
}

/**
 * A themed planet: shader surface (fbm bands + day/night terminator), a fresnel
 * atmosphere halo, an optional dust ring, and a key light. One per section —
 * the celestial body the camera arrives at.
 */
export default function Planet({
  position = [0, 0, 0],
  radius = 16,
  colorA = "#0a1740",
  colorB = "#2f6bff",
  colorC = "#22d3ee",
  atmosphere = "#22d3ee",
  ring = false,
  ringColor = "#22d3ee",
  spin = 0.03,
  lightDir = [0.7, 0.4, 0.55],
}: Props) {
  const body = useRef<THREE.Group>(null);
  const surfaceFactory = useCallback(
    () => createPlanetMaterial(colorA, colorB, colorC, lightDir),
    [colorA, colorB, colorC, lightDir]
  );
  const atmoFactory = useCallback(() => createFresnelMaterial(atmosphere, 2.4), [atmosphere]);

  useFrame((_, dt) => {
    if (body.current) body.current.rotation.y += dt * spin;
  });

  return (
    <group position={position}>
      <group ref={body}>
        <ShaderMesh factory={surfaceFactory}>
          <sphereGeometry args={[radius, 96, 96]} />
        </ShaderMesh>
      </group>
      {/* Atmosphere halo */}
      <ShaderMesh factory={atmoFactory} scale={radius * 1.09}>
        <sphereGeometry args={[1, 48, 48]} />
      </ShaderMesh>
      {/* Key light from the "sun" direction */}
      <pointLight
        position={[lightDir[0] * radius * 3, lightDir[1] * radius * 3, lightDir[2] * radius * 3]}
        intensity={radius * 6}
        color={colorC}
        distance={radius * 12}
      />
      {ring && (
        <mesh rotation={[Math.PI / 2.2, 0.3, 0]}>
          <ringGeometry args={[radius * 1.5, radius * 2.4, 96]} />
          <meshBasicMaterial
            color={ringColor}
            side={THREE.DoubleSide}
            transparent
            opacity={0.28}
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
