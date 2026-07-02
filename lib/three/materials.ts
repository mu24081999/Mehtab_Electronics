import * as THREE from "three";

// ============================================================================
// Physically based material presets. These are plain prop objects spread onto
// <meshPhysicalMaterial {...} /> in JSX, so every surface in the world shares
// one consistent, reusable definition — no duplicated material logic.
// ============================================================================

export type PhysicalProps = Partial<
  THREE.MeshPhysicalMaterialParameters & { color: THREE.ColorRepresentation }
>;

/** Transparent acrylic / optical glass — transmission + IOR + clearcoat. */
export const glass = (color: THREE.ColorRepresentation = "#dff6ff"): PhysicalProps => ({
  color,
  transmission: 1,
  thickness: 1.4,
  ior: 1.5,
  roughness: 0.04,
  metalness: 0,
  clearcoat: 1,
  clearcoatRoughness: 0.06,
  envMapIntensity: 1.4,
  transparent: true,
  attenuationColor: color,
  attenuationDistance: 3,
});

/** Frosted / diffused glass for UI-like surfaces. */
export const frosted = (color: THREE.ColorRepresentation = "#bcd6ff"): PhysicalProps => ({
  color,
  transmission: 0.9,
  thickness: 2,
  ior: 1.3,
  roughness: 0.4,
  metalness: 0,
  clearcoat: 0.6,
  clearcoatRoughness: 0.4,
  envMapIntensity: 1,
  transparent: true,
});

/** Polished chrome / mirror metal. */
export const chrome = (color: THREE.ColorRepresentation = "#eef4ff"): PhysicalProps => ({
  color,
  metalness: 1,
  roughness: 0.05,
  clearcoat: 1,
  clearcoatRoughness: 0.05,
  envMapIntensity: 1.8,
});

/** Brushed / anisotropic metal for camera bodies and hardware. */
export const brushedMetal = (color: THREE.ColorRepresentation = "#20242e"): PhysicalProps => ({
  color,
  metalness: 0.95,
  roughness: 0.28,
  anisotropy: 1,
  anisotropyRotation: Math.PI / 4,
  clearcoat: 0.7,
  clearcoatRoughness: 0.25,
  envMapIntensity: 1.3,
});

/** Dark PCB / composite substrate with subtle clearcoat sheen. */
export const substrate = (color: THREE.ColorRepresentation = "#06110d"): PhysicalProps => ({
  color,
  metalness: 0.35,
  roughness: 0.55,
  clearcoat: 0.4,
  clearcoatRoughness: 0.5,
  envMapIntensity: 0.7,
});

/** Emissive neon — reads strongly under bloom. */
export const neon = (
  color: THREE.ColorRepresentation = "#22d3ee",
  intensity = 3
): PhysicalProps => ({
  color: "#000000",
  emissive: color,
  emissiveIntensity: intensity,
  metalness: 0,
  roughness: 1,
  toneMapped: false,
});

/** Liquid chrome with a coloured tint — the "mercury" look. */
export const liquidChrome = (color: THREE.ColorRepresentation = "#9fd6ff"): PhysicalProps => ({
  color,
  metalness: 1,
  roughness: 0.12,
  clearcoat: 1,
  clearcoatRoughness: 0.08,
  iridescence: 1,
  iridescenceIOR: 1.8,
  envMapIntensity: 1.6,
});

/** Solar-panel photovoltaic glass. */
export const solarGlass = (): PhysicalProps => ({
  color: "#0a1740",
  metalness: 0.6,
  roughness: 0.2,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
  iridescence: 0.6,
  iridescenceIOR: 1.6,
  envMapIntensity: 1.4,
});
