import * as THREE from "three";
import { SCENES } from "@/lib/constants";

// ============================================================================
// The interplanetary track. Two smooth curves derived from the scene list:
//   - camPath:  where the lens physically travels through the universe
//   - lookPath: what the lens is aimed at (each planet in turn)
// Scroll progress (0..1) is warped so the camera eases into and lingers at
// each planet, then accelerates through open space to the next — a cinematic
// "arrive, hold, depart" cadence rather than a constant crawl.
// ============================================================================

const camPoints = SCENES.map((s) => new THREE.Vector3(...s.camera));
const lookPoints = SCENES.map((s) => new THREE.Vector3(...s.anchor));

// Extend slightly beyond the first/last keyframe (further out into space) so
// the ride eases in and out instead of starting hard on a control point.
const first = camPoints[0].clone().add(new THREE.Vector3(0, 2, 22));
const last = camPoints[camPoints.length - 1].clone().add(new THREE.Vector3(0, 2, -22));
const lookFirst = lookPoints[0].clone().add(new THREE.Vector3(0, 0, 10));
const lookLast = lookPoints[lookPoints.length - 1].clone().add(new THREE.Vector3(0, 0, -10));

export const camPath = new THREE.CatmullRomCurve3(
  [first, ...camPoints, last],
  false,
  "catmullrom",
  0.5
);
export const lookPath = new THREE.CatmullRomCurve3(
  [lookFirst, ...lookPoints, lookLast],
  false,
  "catmullrom",
  0.5
);

// The extra endpoint padding occupies curve parameter space; remap the usable
// 0..1 of planet travel into the padded curve's range.
const pad = 1 / (camPoints.length + 1);
export function toCurveT(progress: number) {
  return pad + progress * (1 - 2 * pad);
}

function smootherstep(x: number) {
  x = THREE.MathUtils.clamp(x, 0, 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
}

/**
 * Warp linear scroll into a station-dwell curve: near each planet the mapping
 * flattens (camera slows / holds), between planets it steepens (fast transit).
 */
export function warpProgress(progress: number) {
  const n = SCENES.length - 1;
  const seg = THREE.MathUtils.clamp(progress, 0, 1) * n;
  const i = Math.min(Math.floor(seg), n - 1);
  const f = seg - i;
  return (i + smootherstep(f)) / n;
}

const _pos = new THREE.Vector3();
const _look = new THREE.Vector3();
const _tan = new THREE.Vector3();

export interface CameraState {
  position: THREE.Vector3;
  look: THREE.Vector3;
  /** Banking roll in radians derived from how sharply the track turns. */
  roll: number;
}

const out: CameraState = { position: _pos, look: _look, roll: 0 };

/** Sample the track at a given 0..1 scroll progress (already warped by caller). */
export function sampleTrack(progress: number): CameraState {
  const t = toCurveT(THREE.MathUtils.clamp(progress, 0, 1));
  camPath.getPointAt(t, _pos);
  lookPath.getPointAt(t, _look);
  camPath.getTangentAt(t, _tan);
  // Bank into horizontal turns — the harder x changes with the track, the more
  // the camera leans, like a craft rolling into a curve.
  out.roll = THREE.MathUtils.clamp(-_tan.x * 0.9, -0.4, 0.4);
  return out;
}

/** Which planet index is closest to the given progress (for nav highlight). */
export function sceneAtProgress(progress: number): number {
  const n = SCENES.length;
  return THREE.MathUtils.clamp(Math.round(progress * (n - 1)), 0, n - 1);
}

/** Distance (0..1) to the nearest planet — 1 mid-transit, 0 at a planet. */
export function transitionAmount(progress: number): number {
  const n = SCENES.length - 1;
  const seg = progress * n;
  const frac = seg - Math.floor(seg);
  const d = Math.abs(frac - 0.5) * 2;
  return 1 - d;
}
