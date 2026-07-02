"use client";

import { ShaderMesh } from "./ShaderMesh";
import { createHoloGridMaterial } from "@/lib/three/shaders";
import { useCallback } from "react";

interface Props {
  size?: number;
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

/** A glowing holographic grid plane — the "floor" of most worlds. */
export default function HoloGrid({
  size = 60,
  color = "#22d3ee",
  position = [0, 0, 0],
  rotation = [-Math.PI / 2, 0, 0],
}: Props) {
  const factory = useCallback(() => createHoloGridMaterial(color), [color]);
  return (
    <ShaderMesh factory={factory} position={position} rotation={rotation}>
      <planeGeometry args={[size, size, 1, 1]} />
    </ShaderMesh>
  );
}
