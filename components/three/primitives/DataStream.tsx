"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  curve: THREE.Curve<THREE.Vector3>;
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
  radius?: number;
}

/**
 * Packets of light flowing along an arbitrary curve (fiber cable, energy
 * conduit). Instanced glowing sprites moving head-to-tail.
 */
export default function DataStream({
  curve,
  count = 20,
  color = "#22d3ee",
  size = 0.18,
  speed = 0.25,
  radius = 0.6,
}: Props) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const offsets = useMemo(
    () => Array.from({ length: count }, (_, i) => i / count),
    [count]
  );

  useFrame((s) => {
    const m = mesh.current;
    if (!m) return;
    const t = s.clock.elapsedTime * speed;
    for (let i = 0; i < count; i++) {
      const u = (offsets[i] + t) % 1;
      curve.getPointAt(u, dummy.position);
      const pulse = 0.6 + 0.4 * Math.sin(u * Math.PI);
      dummy.scale.setScalar(size * pulse * (0.5 + radius));
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color={color}
        toneMapped={false}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
