"use client";

import { MeshReflectorMaterial } from "@react-three/drei";

interface Props {
  size?: number;
  position?: [number, number, number];
  color?: string;
  metalness?: number;
}

/** A wet, mirror-like floor using drei's reflector for real screen-space reflections. */
export default function ReflectiveFloor({
  size = 80,
  position = [0, 0, 0],
  color = "#05070d",
  metalness = 0.9,
}: Props) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position}>
      <planeGeometry args={[size, size]} />
      <MeshReflectorMaterial
        resolution={512}
        mirror={0.55}
        mixBlur={8}
        mixStrength={1.4}
        blur={[400, 100]}
        roughness={0.65}
        depthScale={1.1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.2}
        color={color}
        metalness={metalness}
      />
    </mesh>
  );
}
