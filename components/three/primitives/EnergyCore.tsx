"use client";

import { useRef, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ShaderMesh } from "./ShaderMesh";
import { createEnergyMaterial, createFresnelMaterial } from "@/lib/three/shaders";

interface Props {
  position?: [number, number, number];
  scale?: number;
  color?: string;
  color2?: string;
}

/** A pulsing molten energy core wrapped in a fresnel halo and orbiting rings. */
export default function EnergyCore({
  position = [0, 0, 0],
  scale = 1,
  color = "#2f6bff",
  color2 = "#22d3ee",
}: Props) {
  const group = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Group>(null);

  const energyFactory = useCallback(() => createEnergyMaterial(color, color2), [color, color2]);
  const fresnelFactory = useCallback(() => createFresnelMaterial(color2, 2.6), [color2]);

  const ringDefs = useMemo(
    () =>
      [0, 1, 2].map((i) => ({
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [
          number,
          number,
          number
        ],
        r: 1.6 + i * 0.5,
        speed: 0.3 + i * 0.2,
      })),
    []
  );

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (group.current) {
      const b = 1 + Math.sin(t * 1.4) * 0.05;
      group.current.scale.setScalar(scale * b);
      group.current.rotation.y = t * 0.15;
    }
    if (rings.current) rings.current.rotation.z = t * 0.1;
  });

  return (
    <group ref={group} position={position}>
      <ShaderMesh factory={energyFactory}>
        <icosahedronGeometry args={[1, 6]} />
      </ShaderMesh>
      <ShaderMesh factory={fresnelFactory} scale={1.35}>
        <icosahedronGeometry args={[1, 4]} />
      </ShaderMesh>
      <pointLight color={color2} intensity={12} distance={14} />
      <group ref={rings}>
        {ringDefs.map((r, i) => (
          <mesh key={i} rotation={r.rot}>
            <torusGeometry args={[r.r, 0.02, 8, 80]} />
            <meshBasicMaterial color={color2} toneMapped={false} transparent opacity={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
