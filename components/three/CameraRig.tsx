"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useJourneyStore } from "@/store/useJourneyStore";
import { sampleTrack, transitionAmount, warpProgress } from "@/lib/three/cameraPath";

/**
 * The cinematic camera. Scroll progress is heavily damped, warped into a
 * planet-dwell curve, then mapped onto the 3D track: the lens flies through
 * the universe from planet to planet, easing in to hold at each one, banking
 * into turns and drifting with the mouse.
 *
 * There is deliberately NO per-frame high-frequency shake (that is what made
 * the world "shiver"). Any jolt scales with real scroll velocity and decays to
 * exactly zero when the user stops, so a planet you're parked at is perfectly
 * still.
 */
export default function CameraRig() {
  const { camera } = useThree();
  const smoothProgress = useRef(0);
  const pointerX = useRef(0);
  const pointerY = useRef(0);
  const shake = useRef(0);
  const pos = useRef(new THREE.Vector3());
  const curLook = useRef(new THREE.Vector3(0, 0, 0));
  const noise = useRef(new THREE.Vector3());

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const { progress, velocity, pointer, reducedMotion } = useJourneyStore.getState();
    const t = state.clock.elapsedTime;

    // 1) Buttery scroll, then warp so we ease into + hold at each planet.
    const damp = reducedMotion ? 14 : 3.0;
    smoothProgress.current = THREE.MathUtils.damp(smoothProgress.current, progress, damp, delta);
    const warped = warpProgress(smoothProgress.current);

    const track = sampleTrack(warped);
    pos.current.copy(track.position);

    // 2) Smoothed mouse parallax.
    pointerX.current = THREE.MathUtils.damp(pointerX.current, pointer.x, 3, delta);
    pointerY.current = THREE.MathUtils.damp(pointerY.current, pointer.y, 3, delta);

    if (!reducedMotion) {
      // Slow cinematic drift — reads as a floating hold in zero-g, not a buzz.
      pos.current.x += Math.sin(t * 0.22) * 0.4 + pointerX.current * 1.6;
      pos.current.y += Math.cos(t * 0.18) * 0.28 - pointerY.current * 1.0;
      pos.current.z += Math.sin(t * 0.15) * 0.25;

      // Velocity-driven shake envelope (decays to 0 at rest).
      const target = Math.min(Math.abs(velocity) * 0.4 + transitionAmount(warped) * 0.2, 1);
      shake.current = THREE.MathUtils.damp(shake.current, target, 4, delta);
      if (shake.current > 0.001) {
        noise.current.set(
          Math.sin(t * 6.1) + Math.sin(t * 3.3),
          Math.cos(t * 5.4) + Math.sin(t * 2.7),
          Math.sin(t * 4.2)
        );
        pos.current.addScaledVector(noise.current, shake.current * 0.08);
      }
    }

    camera.position.copy(pos.current);

    const lookTarget = track.look;
    if (!reducedMotion) {
      lookTarget.x += pointerX.current * 2.2;
      lookTarget.y += -pointerY.current * 1.4;
    }
    curLook.current.lerp(lookTarget, reducedMotion ? 1 : 0.06);
    camera.lookAt(curLook.current);

    const roll = track.roll + (reducedMotion ? 0 : shake.current * Math.sin(t * 2.0) * 0.04);
    camera.rotateZ(roll);

    const cam = camera as THREE.PerspectiveCamera;
    const targetFov = 50 + shake.current * 8;
    cam.fov = THREE.MathUtils.damp(cam.fov, targetFov, 4, delta);
    cam.updateProjectionMatrix();
  });

  return null;
}
