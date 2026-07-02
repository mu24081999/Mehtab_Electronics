"use client";

import { useMemo, useRef } from "react";
import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SCENES, COLORS } from "@/lib/constants";
import { brushedMetal, chrome, neon } from "@/lib/three/materials";
import Planet from "@/components/three/primitives/Planet";
import DataStream from "@/components/three/primitives/DataStream";
import ParticleField from "@/components/three/primitives/ParticleField";

const S = SCENES[5];

function Rack({ position, rot }: { position: [number, number, number]; rot: number }) {
  const leds = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = 24;
  const seeds = useMemo(() => Array.from({ length: count }, () => Math.random() * 10), []);
  const color = useMemo(() => new THREE.Color(), []);

  useFrame((s) => {
    const m = leds.current;
    if (!m) return;
    const t = s.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const col = i % 3;
      const row = Math.floor(i / 3);
      dummy.position.set(-0.5 + col * 0.5, 2.4 - row * 0.6, 1.05);
      dummy.scale.setScalar(0.13);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      const on = 0.4 + 0.6 * Math.abs(Math.sin(t * 3 + seeds[i]));
      color.set(i % 3 === 0 ? COLORS.emerald : COLORS.cyan).multiplyScalar(on);
      m.setColorAt(i, color);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <group position={position} rotation={[0, rot, 0]}>
      <mesh>
        <boxGeometry args={[2, 6, 2]} />
        <meshPhysicalMaterial {...brushedMetal("#0d1017")} />
      </mesh>
      <mesh position={[0, 0, 1.02]}>
        <boxGeometry args={[1.9, 5.9, 0.05]} />
        <meshPhysicalMaterial {...chrome("#1a1f2b")} />
      </mesh>
      <instancedMesh ref={leds} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

/** Planet 6 — the networking world: server racks in orbit, fiber wrapping the globe. */
export default function SceneNetworking() {
  const orbit = useRef<THREE.Group>(null);

  const racks = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2;
        const r = 20;
        return { pos: [Math.cos(a) * r, (i % 3) * 3 - 3, Math.sin(a) * r] as [number, number, number], rot: -a };
      }),
    []
  );

  const fibers = useMemo(
    () =>
      [0, 1, 2, 3].map((i) => {
        const pts: THREE.Vector3[] = [];
        for (let k = 0; k <= 40; k++) {
          const a = (k / 40) * Math.PI * 2;
          const r = 18 + i * 0.8;
          pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a * 2 + i) * (3 + i), Math.sin(a) * r));
        }
        return new THREE.CatmullRomCurve3(pts, true);
      }),
    []
  );
  const tubeMats = [COLORS.cyan, COLORS.blue, COLORS.emerald, COLORS.purple];

  useFrame((_, dt) => {
    if (orbit.current) orbit.current.rotation.y += dt * 0.05;
  });

  return (
    <group position={S.anchor}>
      <Planet
        position={[6, 0, -14]}
        radius={15}
        colorA="#050b26"
        colorB="#2f6bff"
        colorC={COLORS.blue}
        atmosphere={COLORS.blue}
      />

      {/* Fiber cables wrapping the planet + data packets */}
      {fibers.map((c, i) => (
        <group key={i}>
          <mesh>
            <tubeGeometry args={[c, 100, 0.05, 6, true]} />
            <meshPhysicalMaterial {...neon(tubeMats[i], 1.1)} />
          </mesh>
          <DataStream curve={c} count={18} color={tubeMats[i]} size={0.16} speed={0.3} />
        </group>
      ))}

      {/* Orbiting server racks */}
      <group ref={orbit}>
        {racks.map((r, i) => (
          <Rack key={i} position={r.pos} rot={r.rot} />
        ))}
      </group>

      {/* Router in front */}
      <Float speed={1.5} floatIntensity={0.8} rotationIntensity={0.3}>
        <group position={[0, 0, 12]}>
          <mesh>
            <boxGeometry args={[3, 0.6, 3]} />
            <meshPhysicalMaterial {...brushedMetal("#12161f")} />
          </mesh>
          {Array.from({ length: 6 }).map((_, i) => (
            <mesh key={i} position={[-1.2 + i * 0.5, 0.5, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 1.2, 8]} />
              <meshPhysicalMaterial {...neon(COLORS.cyan, 2)} />
            </mesh>
          ))}
        </group>
      </Float>

      <ParticleField count={200} radius={22} height={28} color={COLORS.cyan} speed={0.4} />
      <pointLight position={[0, 6, 14]} intensity={26} color={COLORS.blue} distance={44} />
    </group>
  );
}
