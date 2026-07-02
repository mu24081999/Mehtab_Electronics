"use client";

import { useMemo, ReactNode } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Attaches a factory-built ShaderMaterial to a mesh and advances its uTime
 * uniform every frame. Keeps every custom-shader mesh from repeating the same
 * useFrame boilerplate.
 */
export function ShaderMesh({
  factory,
  children,
  ...props
}: {
  factory: () => THREE.ShaderMaterial;
  children: ReactNode;
} & ThreeElements["mesh"]) {
  const mat = useMemo(factory, [factory]);
  useFrame((s) => {
    if (mat.uniforms.uTime) mat.uniforms.uTime.value = s.clock.elapsedTime;
  });
  return (
    <mesh {...props}>
      {children}
      <primitive object={mat} attach="material" />
    </mesh>
  );
}
