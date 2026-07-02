"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  count?: number;
  radius?: number;
  height?: number;
  centerY?: number;
  color?: string;
  size?: number;
  speed?: number;
}

/** Drifting volumetric dust — additive points that rise slowly through the world. */
export default function ParticleField({
  count = 400,
  radius = 22,
  height = 60,
  centerY = 0,
  color = "#bcd6ff",
  size = 0.06,
  speed = 0.4,
}: Props) {
  const ref = useRef<THREE.Points>(null);

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = Math.sqrt(Math.random()) * radius;
      const a = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = centerY + (Math.random() - 0.5) * height;
      positions[i * 3 + 2] = Math.sin(a) * r;
      seeds[i] = Math.random() * 100;
    }
    return { positions, seeds };
  }, [count, radius, height, centerY]);

  useFrame((state) => {
    const pts = ref.current;
    if (!pts) return;
    const t = state.clock.elapsedTime;
    const arr = pts.geometry.attributes.position.array as Float32Array;
    const top = centerY + height / 2;
    const bottom = centerY - height / 2;
    for (let i = 0; i < count; i++) {
      let y = arr[i * 3 + 1] + speed * 0.016 * (0.4 + (seeds[i] % 1));
      if (y > top) y = bottom;
      arr[i * 3 + 1] = y;
      arr[i * 3] += Math.sin(t * 0.3 + seeds[i]) * 0.004;
    }
    pts.geometry.attributes.position.needsUpdate = true;
    pts.rotation.y = t * 0.01;
  });

  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.4, "rgba(255,255,255,0.5)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c);
    return t;
  }, []);

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={tex}
        color={color}
        size={size}
        sizeAttenuation
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.7}
      />
    </points>
  );
}
