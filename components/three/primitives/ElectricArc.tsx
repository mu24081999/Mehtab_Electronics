"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  from: [number, number, number];
  to: [number, number, number];
  color?: string;
  segments?: number;
  jitter?: number;
  /** How often (seconds) the bolt reshapes. */
  interval?: number;
}

/**
 * A crackling high-voltage bolt that reshapes on an interval. Built as a raw
 * THREE.Line via <primitive> to sidestep the R3F/SVG `line` JSX name clash.
 */
export default function ElectricArc({
  from,
  to,
  color = "#8b5cff",
  segments = 14,
  jitter = 0.9,
  interval = 0.12,
}: Props) {
  const last = useRef(0);

  const { line, positions, a, b } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const positions = new Float32Array((segments + 1) * 3);
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      toneMapped: false,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const line = new THREE.Line(geom, mat);
    return { line, positions, a, b };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((s) => {
    if (s.clock.elapsedTime - last.current > interval) {
      last.current = s.clock.elapsedTime;
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const p = a.clone().lerp(b, t);
        if (i !== 0 && i !== segments) {
          p.x += (Math.random() - 0.5) * jitter;
          p.y += (Math.random() - 0.5) * jitter;
          p.z += (Math.random() - 0.5) * jitter;
        }
        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;
      }
      line.geometry.attributes.position.needsUpdate = true;
    }
    (line.material as THREE.LineBasicMaterial).opacity = 0.35 + Math.random() * 0.65;
  });

  return <primitive object={line} />;
}
